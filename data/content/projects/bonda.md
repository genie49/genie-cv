# Bonda — 문화재 발굴 보고서 AI 검색 시스템

문화재청 발굴조사보고서와 UNESCO 세계유산 보존현황보고서(SOC)를 AI로 검색하는 RAG 시스템. PDF에서 텍스트와 이미지를 추출하고, Qdrant 벡터DB에 저장하여 자연어 시맨틱 검색과 메타데이터 필터링을 제공합니다. LangChain 에이전트가 4개 도구를 활용해 보고서 검색, 이미지 검색, 고고학 사전 조회, 웹 검색까지 수행합니다.

## 프로젝트 개요

한국 문화재 발굴조사보고서는 대부분 스캔 PDF로 제공되어 전문 검색이 불가능합니다. 연구자가 특정 시대·지역·유적 유형의 보고서를 찾으려면 수백 건의 PDF를 일일이 열어봐야 하는 문제가 있었습니다. Bonda는 이 PDF들을 OCR로 텍스트화하고, 청킹·임베딩·벡터 저장 파이프라인을 거쳐 Qdrant에 적재한 뒤, LangChain 에이전트가 시맨틱 검색으로 관련 내용을 찾아주는 End-to-End RAG 시스템입니다. UNESCO SOC 보고서도 동일한 파이프라인으로 처리하여, 국내 발굴보고서와 세계유산 보존현황을 하나의 인터페이스에서 검색할 수 있습니다.

## 기술 스택

- **프론트엔드**: Next.js 16, React 19, Tailwind CSS, assistant-ui, Drizzle ORM (PostgreSQL), Zustand
- **AI 백엔드**: FastAPI, LangChain `create_agent`, Claude Sonnet 4.6 / Gemini 3.1 Pro, SSE 스트리밍 (sse-starlette)
- **전처리**: PyMuPDF (텍스트 추출), PaddleOCR VL-1.5 (doc_parser), Gemini Vision (이미지 설명), Modal (서버리스 GPU L40S)
- **벡터DB**: Qdrant — 3개 컬렉션 (`archie_reports`, `archie_chunks`, `archie_images`)
- **임베딩**: Gemini Embedding 2 Preview (1536차원), Gemini Batch API
- **인프라**: Docker Compose (AI + Frontend + Qdrant), GCS, Vercel, LangSmith 트레이싱

## 주요 기능

### End-to-End RAG 파이프라인

크롤러(Playwright + nodriver)가 문화재청·UNESCO에서 PDF와 메타데이터를 수집합니다. PDF는 PyMuPDF로 텍스트를 추출하고, 글자 수가 부족한 스캔 PDF는 PaddleOCR로 폴백합니다. 추출된 텍스트를 2,000자 단위(500자 오버랩)로 청킹한 뒤, Gemini Embedding 2 Preview(1536차원)로 임베딩하여 Qdrant `archie_chunks` 컬렉션에 저장합니다. 보고서 메타데이터와 AI 요약은 `archie_reports` 컬렉션에 별도 저장하여 필터링 검색을 지원합니다.

```python
# 벡터화 설정
EMBEDDING_MODEL = "gemini-embedding-2-preview"
EMBEDDING_DIMENSION = 1536
CHUNK_SIZE = 2000
CHUNK_OVERLAP = 500
```

### OCR 폴백 전략

발굴조사보고서는 스캔 이미지 PDF가 대부분이므로 바로 OCR을 수행하고, UNESCO 보고서는 PyMuPDF 텍스트 추출을 먼저 시도한 뒤 글자 수가 부족하면 OCR로 폴백합니다. OCR은 Modal 서버리스 GPU(L40S)에서 PaddleOCR VL-1.5 모델을 vLLM 서버로 서빙하여 처리합니다. PDF를 페이지별 이미지로 렌더링해 배치로 전송하면, PaddleOCR 내부 3단계 파이프라인(레이아웃 분석 → VLM 인식 → 마크다운 변환)이 자동 미니배칭으로 처리합니다.

```python
# Modal 서버리스 GPU 설정
@app.cls(image=image, gpu="L40S", scaledown_window=2 * MINUTES)
class DocParserService:
    @modal.enter()
    def load_model(self):
        self.pipeline = PaddleOCRVL(
            vl_rec_backend="vllm-server",
            vl_rec_max_concurrency=8,
        )
```

### 듀얼 벡터 이미지 검색

보고서 내 이미지를 GCS에 저장하고, Qdrant `archie_images` 컬렉션에 두 개의 벡터를 저장합니다: Gemini Embedding으로 생성한 이미지 벡터(1536차원)와 Gemini Vision이 생성한 텍스트 설명의 임베딩 벡터(1536차원). 텍스트 검색(`by_text` 모드)은 설명 벡터로, 유사 이미지 검색(`similar` 모드)은 이미지 벡터로 수행합니다. 프론트엔드는 SSE 스트림 종료 후 `image_results` 이벤트로 이미지 패널을 렌더링합니다.

### 멀티모델 AI 에이전트

LangChain `create_agent`로 구성한 에이전트가 4개 도구를 활용합니다: 보고서 시맨틱 검색(RAG/Filter/Hybrid 3모드), 이미지 검색(텍스트/유사 이미지 2모드), 13,000건 이상의 고고학 사전 검색(용어명/정의 듀얼 벡터), 현재 시각 조회. Claude Sonnet 4.6과 Gemini 3.1 Pro를 요청별로 전환할 수 있으며, 모델별 에이전트 인스턴스를 캐싱합니다. 응답은 SSE로 스트리밍하고, LangSmith로 에이전트 실행을 트레이싱합니다.

```python
self.agent = create_agent(
    model=llm,
    tools=[archie_search_tool, archie_image_search_tool,
           dictionary_search_tool, get_current_datetime],
    system_prompt=MAIN_AGENT_SYSTEM_PROMPT,
)
```

## 담당 영역

2~3명 소규모 팀에서 풀스택을 담당했습니다:

- **AI 백엔드**: LangChain 에이전트 설계, 4개 도구 구현, SSE 스트리밍, 멀티모델 전환
- **전처리 파이프라인**: 크롤러(Playwright), PDF 파싱(PyMuPDF + OCR 폴백), 청킹·임베딩·벡터화
- **OCR 서비스**: Modal 서버리스 GPU에서 PaddleOCR VL-1.5 + vLLM 서빙
- **프론트엔드**: Next.js 16 + assistant-ui 챗봇 UI, 이미지 검색 패널, Drizzle ORM
- **인프라**: Docker Compose 구성, GCS 이미지 저장, Qdrant 컬렉션 스키마 설계

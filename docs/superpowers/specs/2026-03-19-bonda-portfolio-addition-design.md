# Bonda 포트폴리오 프로젝트 추가 설계

## 개요

문화재 발굴 보고서 AI 검색 시스템인 Bonda 프로젝트를 포트폴리오 사이트(genie-cv)에 추가한다. RAG 파이프라인 설계 역량에 초점을 맞추며, 기존 프로젝트 패턴을 따른다.

## 프로젝트 정보

- **이름**: Bonda — 문화재 발굴 보고서 AI 검색 시스템
- **기간**: 2026.02 ~
- **팀 규모**: 2~3명 소규모 팀
- **담당**: 풀스택 (프론트엔드 + AI 백엔드 + 전처리 파이프라인)
- **GitHub**: https://github.com/heir-ai/bonda
- **experience 추가**: 하지 않음

## 접근 방식

방식 C 채택: 기존 패턴 따르기 + 전략 문서 연동 강화 + profile.json 기술 스택 업데이트.

## 데이터 구조

### projects.json 등록

```json
{
  "slug": "bonda",
  "title": "Bonda — 문화재 발굴 보고서 AI 검색 시스템",
  "description": "한국 고고학 발굴보고서와 UNESCO 보존보고서를 대상으로 한 RAG 기반 AI 검색 시스템. PDF 파싱, OCR, 듀얼 벡터 이미지 검색, 멀티모델 에이전트를 통해 문화재 데이터에 대한 시맨틱 검색을 제공한다.",
  "tags": ["Next.js", "FastAPI", "LangChain", "Qdrant", "PaddleOCR", "Gemini", "Claude", "GCS", "Docker"],
  "period": "2026.02 ~",
  "github": "https://github.com/heir-ai/bonda",
  "features": [
    { "title": "End-to-End RAG 파이프라인", "description": "PDF → OCR 폴백 → 청킹 → 벡터화 → 시맨틱 검색의 전체 파이프라인" },
    { "title": "듀얼 벡터 이미지 검색", "description": "시각적 유사도(512dim) + 텍스트 기반(1536dim) 이중 임베딩으로 이미지 검색" },
    { "title": "멀티모델 AI 에이전트", "description": "Claude/Gemini 전환 가능한 에이전트 + 4개 특화 도구(문서·이미지·사전 검색)" },
    { "title": "OCR 폴백 파이프라인", "description": "PyMuPDF 빠른 경로 + PaddleOCR 폴백 + Modal 서버리스 GPU 활용" }
  ],
  "notes": [
    {
      "id": "bonda-rag-pipeline",
      "projectSlug": "bonda",
      "title": "발굴보고서 PDF가 검색 가능해지기까지",
      "date": "2026-03-19",
      "tags": ["RAG", "Qdrant", "Embedding", "Pipeline"],
      "summary": "PDF 파싱부터 벡터화, Qdrant 컬렉션 설계까지 End-to-End RAG 파이프라인 전체 흐름"
    },
    {
      "id": "bonda-ocr-fallback",
      "projectSlug": "bonda",
      "title": "텍스트가 없는 PDF를 어떻게 읽을까",
      "date": "2026-03-19",
      "tags": ["OCR", "PaddleOCR", "Modal", "PyMuPDF"],
      "summary": "PyMuPDF 빠른 경로와 PaddleOCR 폴백 전략, 서버리스 GPU 활용 경험"
    },
    {
      "id": "bonda-image-search",
      "projectSlug": "bonda",
      "title": "유물 사진을 텍스트로도, 이미지로도 찾는다",
      "date": "2026-03-19",
      "tags": ["Image Search", "Dual Vector", "Multimodal", "Embedding"],
      "summary": "시각적 유사도 + 텍스트 기반 듀얼 벡터 이미지 검색 설계와 Gemini Vision 연동"
    },
    {
      "id": "bonda-agent-tools",
      "projectSlug": "bonda",
      "title": "에이전트에게 문화재 전문가의 도구를 쥐어주면",
      "date": "2026-03-19",
      "tags": ["Agent", "LangChain", "Claude", "Gemini", "SSE"],
      "summary": "4개 특화 도구 설계, 멀티모델 전환, SSE 스트리밍 기반 에이전트 아키텍처"
    }
  ]
}
```

## 콘텐츠 파일

### 프로젝트 설명: `data/content/projects/bonda.md`

구조:
- `# Bonda` — 2~3문장 인트로
- `## 프로젝트 개요` — 문제 정의, 해결 방향
- `## 기술 스택` — 카테고리별 정리
- `## 주요 기능` — 4개 기능 각각 상세
- `## 담당 영역` — 풀스택, 팀 구성

### 기술 노트 4개: `data/content/notes/`

| 파일 | 제목 | 핵심 내용 |
|------|------|-----------|
| `bonda-rag-pipeline.md` | 발굴보고서 PDF가 검색 가능해지기까지 | 전체 파이프라인 흐름, 청킹 전략, Qdrant 3개 컬렉션(archie_reports, archie_chunks, archie_images) 설계 |
| `bonda-ocr-fallback.md` | 텍스트가 없는 PDF를 어떻게 읽을까 | PyMuPDF → PaddleOCR 폴백, Modal 서버리스 GPU(L4, 동시 10개), 정확도 트레이드오프 |
| `bonda-image-search.md` | 유물 사진을 텍스트로도, 이미지로도 찾는다 | 듀얼 벡터 설계(이미지 512dim + 텍스트 1536dim), GCS 저장, Gemini Vision 설명 생성 |
| `bonda-agent-tools.md` | 에이전트에게 문화재 전문가의 도구를 쥐어주면 | 4개 도구(archie_search, archie_image_search, dictionary_search, get_current_datetime), Claude/Gemini 전환, SSE 스트리밍 |

각 노트는 기존 패턴을 따른다:
- 문제 제기 (왜 이게 필요한가)
- 해결 과정 (어떻게 설계했는가)
- Mermaid 아키텍처 다이어그램
- 결과/인사이트

## 전략 문서 연동

### toss-agent-portfolio-strategy.md

체크리스트에 추가:
```markdown
- [x] Add bonda project (문화재 RAG 시스템)
- [x] Add 4 technical notes on bonda (RAG 파이프라인, OCR 폴백, 이미지 검색, 에이전트 도구)
```

5대 핵심 역량 매핑에 bonda 추가:
- **Context Engineering & RAG 파이프라인**: fingoo + genie-cv + **bonda**
- **Full-Stack E2E 구현**: all projects + **bonda**

## profile.json 업데이트

기존에 없는 기술 추가:

| 카테고리 | 추가 항목 |
|---------|----------|
| AI/ML | Qdrant, PaddleOCR |

> FastAPI는 이미 profile.json에 존재하므로 추가하지 않는다.
> Modal은 프로젝트 콘텐츠와 기술 노트에는 언급하되, profile.json techStack에는 추가하지 않는다.

## 임베딩 재실행

모든 콘텐츠 추가 완료 후 `bun run embed` 실행하여 RAG 챗봇에 bonda 프로젝트 반영.

## 변경하지 않는 것

- experience 섹션 (profile.json의 experience 배열, experience.md)
- 커스텀 Hero 컴포넌트 (기존 공통 컴포넌트 활용)
- 프론트엔드 라우팅 (slug 기반 자동 라우팅)

# Bonda 포트폴리오 프로젝트 추가 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 문화재 발굴 보고서 AI 검색 시스템 Bonda를 포트폴리오 사이트에 추가한다.

**Architecture:** 기존 프로젝트 추가 패턴을 따른다. projects.json 등록 → 프로젝트 마크다운 → 기술 노트 4개 → 전략 문서 연동 → profile.json 업데이트 → 임베딩 재실행.

**Tech Stack:** Markdown, JSON (기존 데이터 구조)

**Spec:** `docs/superpowers/specs/2026-03-19-bonda-portfolio-addition-design.md`

---

## File Structure

| Action | Path | Purpose |
|--------|------|---------|
| Create | `data/content/projects/bonda.md` | 프로젝트 상세 설명 |
| Create | `data/content/notes/bonda-rag-pipeline.md` | 기술 노트 1: End-to-End RAG 파이프라인 |
| Create | `data/content/notes/bonda-ocr-fallback.md` | 기술 노트 2: OCR 폴백 전략 |
| Create | `data/content/notes/bonda-image-search.md` | 기술 노트 3: 듀얼 벡터 이미지 검색 |
| Create | `data/content/notes/bonda-agent-tools.md` | 기술 노트 4: 멀티모델 에이전트 도구 설계 |
| Modify | `data/projects.json` | bonda 프로젝트 엔트리 추가 |
| Modify | `data/profile.json:81-88` | techStack에 Qdrant, PaddleOCR 추가 |
| Modify | `docs/toss-agent-portfolio-strategy.md:62,220-233` | 역량 매핑 + 체크리스트 업데이트 |

---

### Task 1: projects.json에 bonda 프로젝트 등록

**Files:**
- Modify: `data/projects.json` (배열 끝에 새 프로젝트 추가)

- [ ] **Step 1: projects.json 끝에 bonda 엔트리 추가**

`ai-portfolio-chatbot` 엔트리 뒤에 다음을 추가:

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

- [ ] **Step 2: JSON 유효성 확인**

Run: `cd /Users/genie/temp/genie-cv && cat data/projects.json | python3 -m json.tool > /dev/null`
Expected: 정상 종료 (에러 없음)

- [ ] **Step 3: 커밋**

```bash
git add data/projects.json
git commit -m "feat: add bonda project entry to projects.json"
```

---

### Task 2: 프로젝트 설명 마크다운 작성

**Files:**
- Create: `data/content/projects/bonda.md`

- [ ] **Step 1: bonda.md 작성**

Bonda 프로젝트의 실제 코드를 참고하여 작성. 구조는 기존 `hey-bara.md` 패턴을 따른다:

```markdown
# Bonda — 문화재 발굴 보고서 AI 검색 시스템

(2~3문장 인트로)

## 프로젝트 개요
(문제 정의 → 해결 방향. 발굴보고서 PDF 검색 불가 문제, RAG로 시맨틱 검색 제공)

## 기술 스택
- **프론트엔드**: Next.js 16, React 19, Tailwind CSS, assistant-ui, Drizzle ORM
- **AI 백엔드**: FastAPI, LangChain, Claude/Gemini, SSE 스트리밍
- **전처리**: PyMuPDF, PaddleOCR, Gemini Vision, Modal(서버리스 GPU)
- **벡터DB**: Qdrant (3개 컬렉션: archie_reports, archie_chunks, archie_images)
- **인프라**: Docker, GCS, GitHub Actions, Vercel

## 주요 기능
### End-to-End RAG 파이프라인
(PDF 파싱 → OCR 폴백 → 청킹 → Gemini Embedding → Qdrant 저장 → 시맨틱 검색)

### OCR 폴백 전략
(PyMuPDF 텍스트 추출 → 실패 시 PaddleOCR doc_parser → Modal 서버리스 GPU L4)

### 듀얼 벡터 이미지 검색
(이미지 벡터 512dim + 텍스트 설명 벡터 1536dim, GCS 저장, Gemini Vision 설명 생성)

### 멀티모델 AI 에이전트
(Claude Sonnet/Gemini Pro 전환, 4개 도구, SSE 스트리밍, LangSmith 트레이싱)

## 담당 영역
- 풀스택 (프론트엔드 + AI 백엔드 + 전처리 파이프라인)
- 2~3명 소규모 팀
```

실제 작성 시 `/Users/genie/temp/bonda`의 코드를 읽어 구체적인 수치와 설계 결정을 반영한다.

- [ ] **Step 2: 커밋**

```bash
git add data/content/projects/bonda.md
git commit -m "feat: add bonda project description markdown"
```

---

### Task 3: 기술 노트 1 — End-to-End RAG 파이프라인

**Files:**
- Create: `data/content/notes/bonda-rag-pipeline.md`

- [ ] **Step 1: 노트 작성**

Bonda의 전처리 파이프라인 코드(`/Users/genie/temp/bonda/preprocessing/archie-pipeline/`)와 검색 서비스(`/Users/genie/temp/bonda/apps/ai/app/services/`)를 참고하여 작성.

구조:
```markdown
# 발굴보고서 PDF가 검색 가능해지기까지

(1~2문장 도입: 발굴보고서가 검색 불가한 PDF로만 존재하는 문제)

## 파이프라인 전체 구조
(Mermaid flowchart: PDF → 텍스트 추출 → 청킹 → 임베딩 → Qdrant)

## Qdrant 컬렉션 설계
(3개 컬렉션: archie_reports 메타데이터, archie_chunks 텍스트 청크, archie_images 이미지)
(각 컬렉션의 벡터 차원, 필터 필드, 인덱스 전략)

## 청킹 전략
(문서 구조 기반 청킹, 메타데이터 보존, 보고서 제목/허가번호/시대/지역 필터링)

## 검색 흐름
(쿼리 → Gemini Embedding → Qdrant 시맨틱 검색 + 필터 → 결과 반환)

## 배운 점
(문화재 도메인 특화 RAG 설계 시 고려 사항)
```

- [ ] **Step 2: 커밋**

```bash
git add data/content/notes/bonda-rag-pipeline.md
git commit -m "feat: add bonda RAG pipeline technical note"
```

---

### Task 4: 기술 노트 2 — OCR 폴백 전략

**Files:**
- Create: `data/content/notes/bonda-ocr-fallback.md`

- [ ] **Step 1: 노트 작성**

Bonda의 파서 코드(`/Users/genie/temp/bonda/preprocessing/archie-pipeline/services/pdf_parser.py`)와 OCR 서비스(`/Users/genie/temp/bonda/preprocessing/ocr/`)를 참고하여 작성.

구조:
```markdown
# 텍스트가 없는 PDF를 어떻게 읽을까

(도입: 스캔된 PDF, 이미지 기반 PDF에서 텍스트 추출이 안 되는 문제)

## 2단계 폴백 전략
(Mermaid flowchart: PyMuPDF 시도 → 텍스트 부족 → PaddleOCR doc_parser 폴백)

## PyMuPDF 빠른 경로
(텍스트 직접 추출, 빠르고 정확하지만 스캔 PDF에서 실패)

## PaddleOCR doc_parser
(문서 구조 인식, 표·그림·텍스트 블록 분리, 이미지 좌표 추출)

## Modal 서버리스 GPU
(L4 GPU, 동시 10개 요청, 스냅샷 기반 콜드 스타트 최적화)

## 정확도와 비용 트레이드오프
(PyMuPDF vs OCR 품질 비교, GPU 비용 고려)
```

- [ ] **Step 2: 커밋**

```bash
git add data/content/notes/bonda-ocr-fallback.md
git commit -m "feat: add bonda OCR fallback technical note"
```

---

### Task 5: 기술 노트 3 — 듀얼 벡터 이미지 검색

**Files:**
- Create: `data/content/notes/bonda-image-search.md`

- [ ] **Step 1: 노트 작성**

Bonda의 이미지 처리 코드(`/Users/genie/temp/bonda/preprocessing/archie-pipeline/services/`)와 이미지 검색 도구(`/Users/genie/temp/bonda/apps/ai/app/tools/`)를 참고하여 작성.

구조:
```markdown
# 유물 사진을 텍스트로도, 이미지로도 찾는다

(도입: 발굴보고서 속 유물 사진을 어떻게 검색 가능하게 만들 것인가)

## 이미지 처리 파이프라인
(Mermaid: PDF → PaddleOCR 이미지 블록 감지 → bbox 크롭 → GCS 업로드)

## 듀얼 벡터 설계
(이미지 벡터: multimodalembedding@001 512dim — 시각적 유사도)
(텍스트 벡터: gemini-embedding-001 1536dim — 설명 기반 검색)
(왜 2개가 필요한가: "토기" 텍스트 검색 vs 비슷한 모양 이미지 검색)

## Gemini Vision 설명 생성
(Gemini 2.0 Flash로 이미지 2~3문장 설명 자동 생성)

## Qdrant archie_images 컬렉션
(듀얼 named vector, payload 구조, GCS signed URL)

## 검색 UX
(텍스트 쿼리 → 텍스트 벡터 검색 + 이미지 벡터 검색 → 결과 통합)
```

- [ ] **Step 2: 커밋**

```bash
git add data/content/notes/bonda-image-search.md
git commit -m "feat: add bonda dual-vector image search technical note"
```

---

### Task 6: 기술 노트 4 — 멀티모델 에이전트 도구 설계

**Files:**
- Create: `data/content/notes/bonda-agent-tools.md`

- [ ] **Step 1: 노트 작성**

Bonda의 에이전트 코드(`/Users/genie/temp/bonda/apps/ai/app/agents/main_agent.py`)와 도구(`/Users/genie/temp/bonda/apps/ai/app/tools/`)를 참고하여 작성.

구조:
```markdown
# 에이전트에게 문화재 전문가의 도구를 쥐어주면

(도입: 문화재 데이터를 단순 검색이 아니라 에이전트가 판단하여 활용하게 하려면)

## 에이전트 아키텍처
(Mermaid: 사용자 질문 → LangChain Agent → 도구 선택 → 결과 조합 → 응답)

## 4개 특화 도구
### archie_search_tool — 문서 시맨틱 검색 + 필터
### archie_image_search_tool — 이미지 듀얼 벡터 검색
### dictionary_search_tool — 고고학 용어 사전 (13K+ 항목)
### get_current_datetime — 시간 컨텍스트

## 멀티모델 전환
(Claude Sonnet / Gemini Pro 선택, 모델별 에이전트 캐싱, 프론트엔드 헤더로 전환)

## SSE 스트리밍
(FastAPI SSE 엔드포인트, 이미지 결과 포함 스트리밍, 프론트엔드 실시간 렌더링)

## LangSmith 트레이싱
(에이전트 실행 모니터링, 도구 호출 추적)
```

- [ ] **Step 2: 커밋**

```bash
git add data/content/notes/bonda-agent-tools.md
git commit -m "feat: add bonda agent tools technical note"
```

---

### Task 7: 전략 문서 연동 + profile.json 업데이트

**Files:**
- Modify: `docs/toss-agent-portfolio-strategy.md:62` (역량 2 매핑)
- Modify: `docs/toss-agent-portfolio-strategy.md:220-233` (체크리스트)
- Modify: `data/profile.json:82,84` (techStack)

- [ ] **Step 1: 전략 문서 역량 2 매핑 업데이트**

`docs/toss-agent-portfolio-strategy.md` 62번째 줄:
```
Before: **보여줄 프로젝트:** fingoo + genie-cv
After:  **보여줄 프로젝트:** fingoo + genie-cv + bonda
```

- [ ] **Step 2: 전략 문서 체크리스트 업데이트**

222번째 줄 부근, 기존 체크리스트 끝에 추가:
```markdown
- [x] bonda 프로젝트를 projects.json에 추가
- [x] bonda 관련 기술 노트 4개 작성 (RAG 파이프라인, OCR 폴백, 이미지 검색, 에이전트 도구)
```

- [ ] **Step 3: profile.json techStack 업데이트**

`data/profile.json`:
- `AI/ML` 배열에 `"PaddleOCR"` 추가
- `DB/MESSAGE` 배열에 `"Qdrant"` 추가

- [ ] **Step 4: 커밋**

```bash
git add docs/toss-agent-portfolio-strategy.md data/profile.json
git commit -m "feat: update strategy doc and profile for bonda project"
```

---

### Task 8: 임베딩 재실행

**Files:**
- 변경 없음 (LanceDB 데이터 갱신)

- [ ] **Step 1: 임베딩 스크립트 실행**

Run: `cd /Users/genie/temp/genie-cv && bun run embed`
Expected: 새로운 bonda 관련 마크다운 파일 5개가 청킹되고 임베딩됨

- [ ] **Step 2: 결과 확인**

출력에서 bonda 관련 청크가 포함되었는지 확인.

- [ ] **Step 3: 커밋**

```bash
git add apps/server/db/
git commit -m "feat: re-embed all content including bonda project"
```

# Bonda Hero 도식도 + Description 재설계

**Date:** 2026-03-23
**Scope:** `BondaHero.tsx` SVG 재설계 + `projects.json` description 교체

## 배경

Aimers/Fingoo와 동일한 동기. 현재 Bonda hero는 RAG 파이프라인을 보여주지만 단순 노드 나열 수준. 시스템 아키텍처로 재설계하여 전처리 파이프라인과 애플리케이션 레이어를 명확히 분리.

## 변경 파일

| 파일 | 변경 내용 |
|------|----------|
| `apps/client/src/components/BondaHero.tsx` | SVG 전면 재설계. Node에 `violet`+`orange` 색상 + `fontSize` prop 추가, Arrow에 `stroke` prop 추가 |
| `data/projects.json` | bonda의 `description` 필드 교체 (`\n\n`으로 3문단 구분) |

---

## 1. Hero 도식도 재설계

### 방향
2단 구조: 상단 전처리 파이프라인 + 하단 애플리케이션 레이어. 수평 점선으로 구분.

### 레이아웃 (viewBox 640×280)

```
─── PREPROCESSING ───
Crawler → PyMuPDF/PaddleOCR → Chunking → Embedding(Gemini) → Qdrant    Modal GPU(L40S)
                                                                         ↑ (dashed)
─── APPLICATION ────
Client → FastAPI → [AI Agent: LangChain(Claude/Gemini) + 4 Tools + SSE + LangSmith]  → GCS / Dual Vector
                                             ↑ query (dashed to Qdrant)

─── INFRA ───
Docker Compose · Vercel · LangSmith Tracing
PostgreSQL  Qdrant  GCS
```

### 상단 — PREPROCESSING
- "PREPROCESSING" 라벨 (zinc 텍스트)
- **Crawler** (zinc) — Playwright + nodriver
- **PyMuPDF / PaddleOCR 폴백** (amber)
- **Chunking** (blue)
- **Embedding / Gemini** (blue)
- **Qdrant** (cyan, 강조) — 3 Collections
- **Modal GPU** (zinc) — L40S · vLLM, PaddleOCR에서 점선 연결

### 하단 — APPLICATION
- "APPLICATION" 라벨 (zinc 텍스트)
- **Client / Next.js** (blue)
- **FastAPI / AI Backend** (emerald)
- **AI Agent** (큰 emerald 박스, 내부):
  - **LangChain** (Claude / Gemini) — 메인 노드
  - **4개 도구**: 문서 검색, 이미지 검색, 사전 조회, 웹 검색 (rose)
  - **SSE Streaming** 바 (emerald)
  - **LangSmith** (zinc)
- **GCS** (zinc) — 이미지 저장
- **Dual Vector** (cyan) — 이미지 + 텍스트
- Agent → Qdrant 점선 (query 라벨)

### 최하단 — INFRA
- Docker Compose · Vercel · LangSmith Tracing 바 (zinc)
- PostgreSQL (emerald), Qdrant (cyan), GCS (zinc)

### 기존 패턴 준수
- viewBox `640 × 280`, `Node`/`Arrow` 컴포넌트 재사용
- Node에 `fontSize` prop, `violet`+`orange` 색상 추가 (기존 BondaHero에는 `cyan`, `rose`가 이미 있음)
- Arrow에 `stroke` prop + amber marker 추가
- Framer Motion `FLOW_DELAY` 애니메이션
- Interactive zoom/pan, "BONDA" 타이틀 유지

### 색상 체계
| 역할 | 색상 | 용도 |
|------|------|------|
| emerald | `#d1fae5` / `#6ee7b7` | FastAPI, Agent, SSE, PostgreSQL |
| blue | `#dbeafe` / `#93c5fd` | Client, Chunking, Embedding |
| cyan | `#cffafe` / `#67e8f9` | Qdrant, Dual Vector |
| amber | `#fef3c7` / `#fcd34d` | PyMuPDF/PaddleOCR |
| rose | `#ffe4e6` / `#fda4af` | 4개 도구 |
| zinc | `#f4f4f5` / `#d4d4d8` | Crawler, Modal GPU, GCS, 인프라 |

---

## 2. Description 교체

### 현재
```
한국 고고학 발굴보고서와 UNESCO 보존보고서를 대상으로 한 RAG 기반 AI 검색 시스템. PDF 파싱, OCR, 듀얼 벡터 이미지 검색, 멀티모델 에이전트를 통해 문화재 데이터에 대한 시맨틱 검색을 제공한다.
```

### 변경 후
```
문화재 발굴조사보고서는 대부분 스캔 PDF로 제공되어 텍스트 검색이 불가능합니다. 연구자가 특정 시대·지역·유적 유형의 보고서를 찾으려면 수백 건의 PDF를 일일이 열어봐야 했습니다.

이 문제를 해결하기 위해 PDF를 텍스트로 변환하고, 벡터화하여 시맨틱 검색이 가능한 End-to-End RAG 파이프라인을 구축했습니다. PyMuPDF로 텍스트를 추출하되 스캔 PDF는 PaddleOCR로 폴백하고, 청킹·임베딩을 거쳐 Qdrant에 적재합니다. 보고서 내 이미지는 이미지 벡터와 텍스트 설명 벡터를 동시에 저장하는 듀얼 벡터 검색으로, 텍스트로도 유사 이미지로도 찾을 수 있습니다.

그 결과, 고고학 연구자가 자연어로 질문하면 AI 에이전트가 수백 건의 보고서에서 관련 내용을 찾아 답해주는 환경이 만들어졌습니다. 보고서 검색, 유물 이미지 검색, 고고학 용어 사전 조회, 웹 검색까지 — 에이전트가 4개 전문 도구를 상황에 맞게 선택하여 응답합니다.
```

---

## 3. 변경하지 않는 것

- ProjectDetailPage, ProjectCard 전체 레이아웃 (멀티 문단 렌더링 이미 구현됨)
- features 카드, notes, `data/content/projects/bonda.md`
- 다른 프로젝트의 hero/description

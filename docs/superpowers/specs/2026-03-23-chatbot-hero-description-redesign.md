# AI Portfolio Chatbot Hero + Description 재설계

**Date:** 2026-03-23
**Scope:** `ChatbotHero.tsx` SVG 재설계 + `projects.json` description 교체

## 변경 파일

| 파일 | 변경 내용 |
|------|----------|
| `apps/client/src/components/ChatbotHero.tsx` | SVG 전면 재설계. Node 확장 + Arrow stroke 추가 |
| `data/projects.json` | ai-portfolio-chatbot description 교체 |

---

## 1. Hero — RAG 파이프라인 중심 2단 구조

### 상단 — RAG PIPELINE
- Markdown(프로젝트·경력) → Chunking(H2 헤더 단위) → Embedding(Gemini 비대칭) → LanceDB(Vector DB)

### 하단 — APPLICATION
- Client(React+Vite) → ElysiaJS(Bun) → ReAct Agent 큰 박스:
  - Grok 4.1 / LangChain.js
  - 벡터 검색 (조건부 호출) — rose
  - SSE Streaming 바
  - 인용 → 라우트 매핑 — amber
  - Rate Limit + 에러 분류 — zinc
- Agent → LanceDB 점선 (query)
- assistant-ui 채팅 UI — violet

### 최하단 — DEPLOY
- Railway · React + Vite · ElysiaJS 바
- LanceDB, Tailwind CSS, React Router

### 색상
기존 ChatbotHero 색상 + 필요시 orange/violet 추가 + fontSize prop

---

## 2. Description 교체

```
포트폴리오 사이트를 방문한 채용 담당자가 프로젝트에 대해 궁금한 점이 있을 때, 페이지를 일일이 찾아다니며 확인해야 했습니다.

방문자가 자연어로 질문하면 실제 데이터를 기반으로 답변하는 AI 챗봇을 설계했습니다. 마크다운으로 작성된 프로젝트·경력·기술 데이터를 H2 헤더 단위로 청킹하고, Gemini Embedding의 비대칭 임베딩으로 LanceDB에 벡터화합니다. ReAct 에이전트가 질문 의도를 판단하여 인사말에는 직접 응답하고, 기술 질문에만 RAG 검색을 수행합니다.

답변은 SSE 스트리밍으로 실시간 전달되며, 인용 번호를 클릭하면 관련 프로젝트나 개발 노트 페이지로 바로 이동합니다. 소스 파일 경로를 내부 라우트로 자동 매핑하는 인용 시스템으로, 새 콘텐츠를 추가해도 코드 변경 없이 인용 링크가 동작합니다.
```

---

## 3. 변경하지 않는 것
- ProjectDetailPage, features, notes, 다른 프로젝트

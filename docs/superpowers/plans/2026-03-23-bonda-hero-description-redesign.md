# Bonda Hero + Description 재설계 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bonda 프로젝트의 hero 도식을 2단 구조(전처리+애플리케이션) 시스템 아키텍처 뷰로 재설계하고, description을 문제→해결→임팩트 구조로 교체한다.

**Architecture:** BondaHero.tsx의 SVG 콘텐츠를 전면 교체. 기존 BondaHero는 cyan/rose 색상을 이미 가지고 있으므로 violet/orange만 추가. projects.json description 교체.

**Tech Stack:** React, TypeScript, Framer Motion, SVG

**Spec:** `docs/superpowers/specs/2026-03-23-bonda-hero-description-redesign.md`

---

## File Structure

| 파일 | 작업 |
|------|------|
| `apps/client/src/components/BondaHero.tsx` | SVG 전면 교체, Node에 violet+orange+fontSize 추가, Arrow에 stroke 추가 |
| `data/projects.json` | bonda description 교체 |

---

### Task 1: projects.json description 교체

**Files:**
- Modify: `data/projects.json` — bonda 객체의 `description` 필드

- [ ] **Step 1: description 교체**

slug가 `"bonda"`인 객체의 description을 아래로 교체:

```json
"description": "문화재 발굴조사보고서는 대부분 스캔 PDF로 제공되어 텍스트 검색이 불가능합니다. 연구자가 특정 시대·지역·유적 유형의 보고서를 찾으려면 수백 건의 PDF를 일일이 열어봐야 했습니다.\n\n이 문제를 해결하기 위해 PDF를 텍스트로 변환하고, 벡터화하여 시맨틱 검색이 가능한 End-to-End RAG 파이프라인을 구축했습니다. PyMuPDF로 텍스트를 추출하되 스캔 PDF는 PaddleOCR로 폴백하고, 청킹·임베딩을 거쳐 Qdrant에 적재합니다. 보고서 내 이미지는 이미지 벡터와 텍스트 설명 벡터를 동시에 저장하는 듀얼 벡터 검색으로, 텍스트로도 유사 이미지로도 찾을 수 있습니다.\n\n그 결과, 고고학 연구자가 자연어로 질문하면 AI 에이전트가 수백 건의 보고서에서 관련 내용을 찾아 답해주는 환경이 만들어졌습니다. 보고서 검색, 유물 이미지 검색, 고고학 용어 사전 조회, 웹 검색까지 — 에이전트가 4개 전문 도구를 상황에 맞게 선택하여 응답합니다."
```

- [ ] **Step 2: JSON 유효성 확인 + Commit**

```bash
node -e "JSON.parse(require('fs').readFileSync('data/projects.json','utf8')); console.log('valid')"
git add data/projects.json && git commit -m "content: rewrite Bonda description — problem-solution-impact structure"
```

---

### Task 2: BondaHero SVG 전면 재설계

**Files:**
- Modify: `apps/client/src/components/BondaHero.tsx`

- [ ] **Step 1: Node에 violet+orange+fontSize 추가, Arrow에 stroke 추가**

BondaHero의 기존 Node는 `"emerald" | "blue" | "amber" | "zinc" | "cyan" | "rose"`. 여기에 `"violet"` | `"orange"` 추가 + `fontSize` prop.

Node color 타입:
```tsx
color: "emerald" | "blue" | "amber" | "zinc" | "cyan" | "rose" | "violet" | "orange";
```

colors 객체에 추가:
```tsx
violet: { fill: "#ede9fe", stroke: "#c4b5fd", text: "#5b21b6", sub: "#7c3aed" },
orange: { fill: "#fff7ed", stroke: "#fed7aa", text: "#c2410c", sub: "#ea580c" },
```

fontSize prop: `fontSize={fs ?? 10}` 라벨, `fontSize={fs ? fs * 0.7 : 7}` sub.

Arrow: optional `stroke` prop + amber marker (id: `bonda-arrow-amber`).

- [ ] **Step 2: SVG 콘텐츠를 2단 구조로 교체**

`<defs>` 마커 유지 + amber 마커 추가. 그 아래 모든 Node/Arrow/motion.text 제거 후 교체.

**상단 PREPROCESSING** (y: 35~82):
- "PREPROCESSING" 라벨 (x=20, y=38)
- Crawler (zinc, x=15 y=45 w=55 h=28, fontSize=6.5)
- → PyMuPDF / PaddleOCR 폴백 (amber, x=88 y=42 w=65 h=34, fontSize=6.5)
- → Chunking (blue, x=170 y=45 w=55 h=28, fontSize=6.5)
- → Embedding / Gemini (blue, x=242 y=42 w=68 h=34, fontSize=6.5)
- → Qdrant 3 Collections (cyan, x=327 y=42 w=70 h=34, fontSize=7)
- Modal GPU L40S·vLLM (zinc, x=420 y=45 w=65 h=28, fontSize=5.5)
- PaddleOCR → Modal 점선 연결

**구분선** (y=92, dashed)

**하단 APPLICATION** (y: 100~200):
- "APPLICATION" 라벨 (x=20, y=108)
- Client / Next.js (blue, x=15 y=115 w=55 h=32)
- FastAPI / AI Backend (emerald, x=90 y=115 w=65 h=32)
- AI Agent 큰 박스 (emerald, x=175 y=100 w=225 h=108):
  - LangChain / Claude/Gemini (emerald, x=192 y=122 w=100 h=28)
  - 4 Tools (rose): 문서검색, 이미지검색, 사전조회, 웹검색 (각 48×16, fontSize=5)
  - SSE Streaming 바 (emerald)
  - LangSmith (zinc)
- GCS 이미지저장 (zinc, x=420 y=115 w=65 h=28)
- Dual Vector 이미지+텍스트 (cyan, x=420 y=155 w=78 h=32)
- Agent → Qdrant 점선 (query 라벨)

**최하단 INFRA** (y: 220~270):
- Docker Compose · Vercel · LangSmith Tracing 바 (zinc)
- PostgreSQL (emerald), Qdrant (cyan), GCS (zinc)

- [ ] **Step 3: 빌드 확인 + Commit**

```bash
bun run build
git add apps/client/src/components/BondaHero.tsx
git commit -m "feat: redesign Bonda hero — 2-tier system architecture with RAG pipeline"
```

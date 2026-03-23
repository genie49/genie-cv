# Fingoo Hero + Description 재설계 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fingoo 프로젝트의 hero 도식을 시스템 아키텍처 뷰로 재설계하고, description을 문제→해결→교육→비전 구조로 교체한다.

**Architecture:** ProjectHero.tsx(FingooHero)의 SVG 콘텐츠를 전면 교체하되 외부 인터페이스(props, export)는 유지. projects.json의 description을 멀티 문단으로 교체. ProjectDetailPage의 멀티 문단 렌더링은 Aimers 태스크에서 이미 구현 완료.

**Tech Stack:** React, TypeScript, Framer Motion, SVG, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-03-23-fingoo-hero-description-redesign.md`

---

## File Structure

| 파일 | 작업 | 비고 |
|------|------|------|
| `apps/client/src/components/ProjectHero.tsx` | Modify | SVG 콘텐츠 전면 교체, Node에 orange+fontSize 추가, Arrow에 stroke 추가 |
| `data/projects.json` | Modify | fingoo description 필드 교체 |

---

### Task 1: projects.json description 교체

**Files:**
- Modify: `data/projects.json` — fingoo 객체의 `description` 필드

- [ ] **Step 1: description 필드 교체**

`data/projects.json`에서 slug가 `"fingoo"`인 객체의 `description` 값을 아래로 교체:

```json
"description": "투자 분석에 필요한 데이터는 DART 공시, 해외 주가, 경제 지표, 뉴스까지 곳곳에 흩어져 있고, 이를 종합하여 판단하는 건 전문가의 영역이었습니다.\n\n흩어진 금융 데이터를 한곳에 집약하고, 전문 분석 도구를 하나의 채팅 인터페이스 안에서 간편하게 제공하는 것이 목표였습니다. Supervisor 에이전트가 7명의 전문 에이전트(시장분석·기술분석·리서치·포트폴리오·퀀트·시각화·지표)를 오케스트레이션하며, 81개의 도구로 데이터 수집부터 차트 생성, 기술적 분석, 성과 예측까지 자동으로 수행합니다. 사용자는 자연어로 요청하기만 하면 에이전트 팀이 데이터를 모으고, 분석하고, 차트로 시각화해줍니다.\n\n분석 도구만으로는 금융에 처음 접근하는 사용자의 진입 장벽을 낮출 수 없었습니다. 투자에 흥미를 갖고 자연스럽게 친해지도록 챕터별 학습 모듈과 퀴즈, 출석·XP·랭킹 등 게이미피케이션 요소를 결합한 투자 교육 시스템을 함께 설계했습니다. 분석 플랫폼과 교육이 하나의 서비스 안에 있기 때문에, 배운 내용을 바로 실제 차트에서 확인하며 학습할 수 있습니다.\n\n궁극적으로, 금융의 진입 장벽을 낮추고 누구나 투자와 자연스럽게 친해질 수 있는 환경을 만드는 것이 핀구의 목표입니다."
```

- [ ] **Step 2: JSON 유효성 확인**

Run: `cd /Users/genie/workspace/genie-cv && node -e "JSON.parse(require('fs').readFileSync('data/projects.json','utf8')); console.log('valid')"`
Expected: `valid`

- [ ] **Step 3: Commit**

```bash
git add data/projects.json
git commit -m "content: rewrite Fingoo description — problem-solution-education-vision structure"
```

---

### Task 2: FingooHero SVG 전면 재설계

**Files:**
- Modify: `apps/client/src/components/ProjectHero.tsx`

이 태스크는 파일의 SVG 콘텐츠 부분만 교체한다. 외부 인터페이스(FingooHero export, props), 줌/팬 로직, wrapper div, 배경 그리드, 타이틀, 리셋 버튼은 모두 유지.

- [ ] **Step 1: Node 컴포넌트에 orange 색상 + fontSize prop 추가, Arrow에 stroke prop 추가**

KimproHero.tsx에 적용한 것과 동일한 패턴. ProjectHero.tsx는 자체 로컬 Node/Arrow를 가지고 있으므로 독립적으로 수정.

**Node** — color 타입에 `"orange"` 추가 (line 26), colors 객체에 orange 추가, `fontSize` prop 추가:

```tsx
function Node({
  x, y, w, h, label, sub, color, delay, fontSize: fs,
}: {
  x: number; y: number; w: number; h: number;
  label: string; sub?: string;
  color: "violet" | "emerald" | "blue" | "amber" | "zinc" | "orange";
  delay: number;
  fontSize?: number;
}) {
```

colors 객체에 추가:
```tsx
orange: {
  fill: "#fff7ed",
  stroke: "#fed7aa",
  text: "#c2410c",
  sub: "#ea580c",
},
```

fontSize 적용 (기존 `fontSize={10}` → `fontSize={fs ?? 10}`, sub 텍스트도 `fontSize={fs ? fs * 0.7 : 7}`).

**Arrow** — optional `stroke` prop 추가:

```tsx
function Arrow({
  points, delay, dashed, stroke: strokeColor,
}: {
  points: string; delay: number; dashed?: boolean; stroke?: string;
}) {
  return (
    <motion.polyline
      ...
      stroke={strokeColor ?? "#ccc"}
      ...
      markerEnd={strokeColor ? "url(#fingoo-arrow-amber)" : "url(#fingoo-arrow)"}
    />
  );
}
```

`<defs>` 안에 amber marker 추가:
```tsx
<marker id="fingoo-arrow-amber" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
  <polygon points="0,0 0,6 9,3" fill="#fcd34d" />
</marker>
```

- [ ] **Step 2: SVG 콘텐츠를 시스템 아키텍처 뷰로 교체**

`<defs>` 마커는 유지(+ amber 마커 추가). 그 아래의 모든 Node, Arrow, motion.text (lines 289-386)를 제거하고 새 아키텍처 레이아웃으로 교체.

브라우저 mockup `fingoo-hero-direction.html` 기준 좌표:

**Col 1 — Client:**
- `Node x={12} y={80} w={60} h={38} label="Client" sub="Next.js" color="blue"`

**Col 2 — Nginx:**
- `Node x={90} y={72} w={50} h={55} label="Nginx" sub="Reverse Proxy" color="zinc" fontSize={7}`

**Col 3 — Backend Services:**
- `Node x={162} y={38} w={65} h={30} label="NestJS" color="emerald"`
- `Node x={162} y={82} w={65} h={36} label="FastAPI" sub="AI Service" color="violet"`
- Arrow: FastAPI → Agent (violet stroke, "WS" 라벨)

**Col 4 — AI Agent System (큰 wrapper rect + 내부):**
- Wrapper: `motion.rect x={252} y={30} w={195} h={170} rx={6} fill="#faf5ff" stroke="#c4b5fd"`
- 라벨: "AI Agent System"
- `Node x={270} y={54} w={160} h={32} label="Supervisor" sub="LangChain · Grok/Claude/Gemini" color="violet"`
- 서브에이전트 5개 (흰색, violet border): 시장, 기술, 리서치, 퀀트, 시각화 (fontSize 4.5-5)
- "81 Tools" + "Middleware × 10" 둥근 바
- "Human-in-Loop" + "PG Checkpoint" zinc 노드
- "Eval: MockService + 6 Graders" 텍스트

**Col 5 — Data Sources:**
- `Node x={472} y={32} w={85} h={24} label="금융 데이터" color="amber" fontSize={6.5}`
- 4개 orange 도구: DART, FRED, yfinance, Tavily (fontSize 6.5, 2×2 grid)
- `Node x={472} y={110} w={85} h={34} label="시황 RAG" sub="pgvector + 웹검색" color="emerald" fontSize={6.5}`
- 화살표: Agent → 금융 데이터 (amber), Agent → 시황 RAG (amber)

**하단 — 스트리밍 + 인프라:**
- Socket.IO 바: rect (blue)
- DB: PostgreSQL, Redis (emerald, fontSize 7)
- 인프라: Docker, AWS, FluentBit (zinc, fontSize 7)
- Workflow → Socket.IO 점선, Socket.IO → 하단 점선

**애니메이션 순서:** Aimers와 동일한 좌→우, 상→하 패턴. FLOW_DELAY × 1~10.

- [ ] **Step 3: dev 서버에서 시각 확인**

Run: `cd /Users/genie/workspace/genie-cv && bun run dev:client`
확인사항:
- `/projects/fingoo` 상세 페이지: hero가 시스템 아키텍처로 표시, interactive zoom/pan 정상
- `/projects` 목록: 카드 썸네일 정상
- `/` 대시보드: 카드 정상
- 다른 프로젝트 hero에 영향 없음 (kimpro, hey-bara 등)
- 텍스트가 박스를 넘어가지 않는지 확인 (fontSize prop 활용)

- [ ] **Step 4: Commit**

```bash
git add apps/client/src/components/ProjectHero.tsx
git commit -m "feat: redesign Fingoo hero — system architecture view with agent orchestration"
```

---

### Task 3: 최종 빌드 확인

- [ ] **Step 1: 전체 빌드 확인**

Run: `cd /Users/genie/workspace/genie-cv && bun run build`
Expected: 빌드 성공

- [ ] **Step 2: 전체 페이지 시각 확인**

- `/projects/fingoo`: hero + 4문단 description + features + 개발 노트
- `/projects`: 카드 description 잘림 자연스러운지
- 다른 프로젝트들 영향 없음

- [ ] **Step 3: 정리 커밋 (필요 시)**

```bash
git add -A
git commit -m "fix: visual adjustments for Fingoo hero and description"
```

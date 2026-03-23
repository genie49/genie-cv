# Aimers Hero + Description 재설계 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aimers 프로젝트의 hero 도식을 시스템 아키텍처 뷰로 재설계하고, description을 문제→해결→임팩트 구조로 교체한다.

**Architecture:** KimproHero.tsx의 SVG 콘텐츠를 전면 교체하되 외부 인터페이스(props, export)는 유지. projects.json의 description을 멀티 문단으로 교체하고, ProjectDetailPage에서 `\n\n` 기준으로 문단 분리 렌더링.

**Tech Stack:** React, TypeScript, Framer Motion, SVG, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-03-23-aimers-hero-description-redesign.md`

---

## File Structure

| 파일 | 작업 | 비고 |
|------|------|------|
| `apps/client/src/components/KimproHero.tsx` | Modify | SVG 콘텐츠 전면 교체, Node에 orange 색상 추가 |
| `data/projects.json` | Modify | kimpro description 필드 교체 |
| `apps/client/src/pages/ProjectDetailPage.tsx` | Modify | description 멀티 문단 렌더링 (line 161) |

---

### Task 1: projects.json description 교체

**Files:**
- Modify: `data/projects.json:5`

- [ ] **Step 1: description 필드 교체**

`data/projects.json`의 kimpro 항목에서 `description` 값을 아래로 교체:

```json
"description": "인플루언서 마케팅 캠페인 하나를 운영하려면 캠페인 기획, 크리에이터 탐색·컨택, 콘텐츠 가이드 생성, 모니터링, 성과 분석까지 여러 전문가가 몇 주에 걸쳐 반복 작업해야 했습니다.\n\n이 과정을 자동화하기 위해 실제 마케팅 팀의 협업 구조를 모방했습니다. Account Manager가 캠페인 전체를 총괄하고, 상황에 따라 적절한 전문가에게 업무를 위임하듯 — Supervisor 에이전트가 5명의 전문 에이전트(Insight Analyst, Campaign Manager, Content Planner, Recruitment Manager, Contract Manager)에게 작업을 나눠 맡기는 구조를 설계했습니다.\n\n각 에이전트는 사람이 쓰던 도구를 그대로 AI 도구로 옮겼습니다. 제품 URL을 넣으면 자동으로 분석하고, 크리에이터 DB에서 조건에 맞는 후보를 찾고, 과거 캠페인 데이터로 성과를 예측합니다. 사람이 엑셀과 검색엔진을 오가며 하던 일을 에이전트가 전용 도구를 호출해 처리합니다.\n\n그 결과, 캠페인 초기 세팅에 몇 주가 걸리던 프로세스를 한 페이지 안에서 대화만으로 완료할 수 있게 되었습니다. 광고주가 제품 정보와 요구사항만 전달하면 에이전트 팀이 브리프 분석부터 크리에이터 매칭, 콘텐츠 가이드 생성까지 자동으로 처리합니다."
```

- [ ] **Step 2: JSON 유효성 확인**

Run: `cd /Users/genie/workspace/genie-cv && node -e "JSON.parse(require('fs').readFileSync('data/projects.json','utf8')); console.log('valid')"`
Expected: `valid`

- [ ] **Step 3: Commit**

```bash
git add data/projects.json
git commit -m "content: rewrite Aimers description — problem-solution-impact structure"
```

---

### Task 2: ProjectDetailPage 멀티 문단 렌더링

**Files:**
- Modify: `apps/client/src/pages/ProjectDetailPage.tsx:161`

- [ ] **Step 1: description 렌더링을 멀티 문단으로 변경**

`ProjectDetailPage.tsx` line 161에서:

기존:
```tsx
<p className="text-sm leading-[1.7] text-toss-body">{project.description}</p>
```

변경:
```tsx
{project.description.split("\n\n").map((paragraph, i) => (
  <p key={i} className="text-sm leading-[1.7] text-toss-body">
    {paragraph}
  </p>
))}
```

부모 `<motion.div>`에 이미 `flex flex-col gap-3`이 있으므로 문단 간 간격은 자동 적용됨.

- [ ] **Step 2: dev 서버에서 확인**

Run: `cd /Users/genie/workspace/genie-cv && bun run dev:client`
확인: `/projects/kimpro` 페이지에서 description이 4개 문단으로 분리되어 표시되는지 확인.
다른 프로젝트 페이지에서도 기존 단일 문단 description이 정상 표시되는지 확인.

- [ ] **Step 3: Commit**

```bash
git add apps/client/src/pages/ProjectDetailPage.tsx
git commit -m "feat: render multi-paragraph description on project detail page"
```

---

### Task 3: KimproHero SVG 전면 재설계

**Files:**
- Modify: `apps/client/src/components/KimproHero.tsx`

이 태스크는 파일의 SVG 콘텐츠 부분만 교체한다. 외부 인터페이스(KimproHero export, props), 줌/팬 로직, wrapper div, 배경 그리드, 타이틀, 리셋 버튼은 모두 유지.

- [ ] **Step 1: Node 컴포넌트에 orange 색상 추가, Arrow 컴포넌트에 stroke 색상 prop 추가**

`KimproHero.tsx`의 `Node` 컴포넌트에서:

color 타입에 `"orange"` 추가:
```tsx
color: "violet" | "emerald" | "blue" | "amber" | "zinc" | "orange";
```

colors 객체에 orange 추가:
```tsx
orange: {
  fill: "#fff7ed",
  stroke: "#fed7aa",
  text: "#c2410c",
  sub: "#ea580c",
},
```

Arrow 컴포넌트에 optional `stroke` prop 추가 (Chat→Workflow, Workflow→Tools 화살표에 amber 색상 사용):

```tsx
function Arrow({
  points,
  delay,
  dashed,
  stroke: strokeColor,
}: {
  points: string;
  delay: number;
  dashed?: boolean;
  stroke?: string;
}) {
  return (
    <motion.polyline
      initial={{ opacity: 0 }}
      animate={{ opacity: dashed ? 0.5 : 1 }}
      transition={{ delay, duration: 0.25 }}
      points={points}
      fill="none"
      stroke={strokeColor ?? "#ccc"}
      strokeWidth={1.2}
      strokeDasharray={dashed ? "4,3" : undefined}
      markerEnd="url(#kimpro-arrow)"
    />
  );
}
```

- [ ] **Step 2: SVG 콘텐츠를 시스템 아키텍처 뷰로 교체**

`<defs>` 마커는 유지. 그 아래의 모든 Node, Arrow, motion.text (lines 289-370)를 제거하고 아래 구조로 교체.

레이아웃 (viewBox 0 0 640 280):

```
Col1 (x:12-70)    Col2 (x:90-145)    Col3 (x:170-222)    Col4 (x:255-450)              Col5 (x:472-562)
Client             Nginx GW           Auth                 ┌─ Workflow Service ─────────┐  Tools API
                                      API                  │ Account Manager            │  ├ 제품 분석
                                      Chat ──pub/sub──>    │ Insight Campaign Content   │  ├ 키워드
                                                           │ Recruit                    │  ├ 성과 예측
                                                           │ Middleware Pipeline × 5    │  ├ 매칭
                                                           │ PG Checkpoint  Prompt Cache│  ├ 레퍼런스
                                                           └────────────────────────────┘  └ 크롤링
                                                                    │
                              ┌──────── GCP Pub/Sub Event Bus ─────────────────┐
                              Notification WK   History WK   PostgreSQL  MongoDB  Redis
```

구현할 노드 목록과 좌표 (브라우저 mockup `hero-landscape-v3.html` 기준):

**Col 1 — Client:**
- `Node x={12} y={85} w={58} h={35} label="Client" sub="Next.js" color="blue"`

**Col 2 — Nginx Gateway:**
- `Node x={90} y={70} w={55} h={65} label="Nginx" sub="Gateway" color="zinc"`
- 추가 서브 텍스트 `auth_request` (motion.text, fontSize 5, fill #a1a1aa)

**Col 3 — Services:**
- `Node x={170} y={40} w={52} h={26} label="Auth" color="emerald"`
- `Node x={170} y={78} w={52} h={26} label="API" color="emerald"`
- `Node x={170} y={135} w={52} h={32} label="Chat" sub="Socket.IO" color="blue"`

**Col 4 — Workflow Service (큰 wrapper rect + 내부 노드):**
- Wrapper: `motion.rect x={255} y={32} w={195} h={175} rx={6} fill="#faf5ff" stroke="#c4b5fd"`
- 라벨: motion.text "Workflow Service" (x=352, y=49, fontSize 8, font-weight 700, fill #7c3aed)
- `Node x={272} y={57} w={160} h={38} label="Account Manager" sub="Supervisor · LangGraph · Claude/GPT" color="violet"`
- 서브에이전트 4개 (흰색 배경, violet border — 직접 rect/text로 렌더):
  - Insight: rect x={268} y={104} w={38} h={20}
  - Campaign: rect x={310} y={104} w={44} h={20}
  - Content: rect x={358} y={104} w={40} h={20}
  - Recruit: rect x={402} y={104} w={38} h={20}
- Middleware Pipeline: rect x={272} y={133} w={168} h={16} rx={8} (연한 violet 바)
- PG Checkpoint: rect x={272} y={157} w={78} h={16}
- Prompt Cache: rect x={356} y={157} w={84} h={16}
- LLM Factory: motion.text (x=356, y=190, fontSize 5)

**Col 5 — Tools API:**
- `Node x={472} y={32} w={90} h={28} label="Tools API" sub="Fastify · 독립 배포" color="amber"`
- 도구 6개 (2×3 grid, orange 색상):
  - `Node x={472} y={66} w={43} h={16} label="제품 분석" color="orange"`
  - `Node x={519} y={66} w={43} h={16} label="키워드" color="orange"`
  - `Node x={472} y={86} w={43} h={16} label="성과 예측" color="orange"`
  - `Node x={519} y={86} w={43} h={16} label="매칭" color="orange"`
  - `Node x={472} y={106} w={43} h={16} label="레퍼런스" color="orange"`
  - `Node x={519} y={106} w={43} h={16} label="크롤링" color="orange"`

**하단 — Pub/Sub + Workers + DB:**
- Pub/Sub 바: rect x={90} y={222} w={470} h={18} rx={9} (amber)
- Notification WK: `Node x={100} y={250} w={75} h={20} label="Notification WK" color="zinc"`
- History WK: `Node x={185} y={250} w={60} h={20} label="History WK" color="zinc"`
- PostgreSQL: `Node x={355} y={250} w={58} h={20} label="PostgreSQL" color="emerald"`
- MongoDB: `Node x={418} y={250} w={50} h={20} label="MongoDB" color="emerald"`
- Redis: `Node x={473} y={250} w={42} h={20} label="Redis" color="emerald"`

**화살표 연결:**
- Client → Nginx: polyline "70,102 88,102"
- Nginx → Auth: polyline "145,82 168,57"
- Nginx → API: polyline "145,100 168,100"
- Nginx → Chat: polyline "145,118 168,143"
- Chat → Workflow: polyline "222,151 253,130" (amber 색 stroke, "pub/sub" 라벨)
- Workflow → Tools API: polyline "450,76 472,58" (amber 색 stroke, "HTTP" 라벨)
- Workflow → Pub/Sub: dashed line "352,207 352,222"
- Pub/Sub → Workers/DB: dashed lines 각각

**애니메이션 순서 (FLOW_DELAY 기준):**
1. Client (×1)
2. Nginx (×2)
3. Client→Nginx 화살표 (×1.5)
4. Auth, API (×3)
5. Nginx→Auth/API 화살표 (×2.5)
6. Chat (×4)
7. Nginx→Chat 화살표 (×3.5)
8. Workflow wrapper + Account Manager (×5)
9. Chat→Workflow 화살표 + pub/sub 라벨 (×4.5)
10. 서브에이전트 4개 (×6)
11. Middleware, Checkpoint, Cache (×7)
12. Tools API + 도구 6개 (×8)
13. Workflow→Tools 화살표 (×7.5)
14. Pub/Sub 바 (×9)
15. Workers + DB (×10)

- [ ] **Step 3: dev 서버에서 시각 확인**

Run: `cd /Users/genie/workspace/genie-cv && bun run dev:client`
확인사항:
- `/projects/kimpro` 상세 페이지: hero가 시스템 아키텍처로 표시, interactive zoom/pan 정상 동작
- `/projects` 목록 페이지: 카드 썸네일에서 축소된 형태로 정상 표시
- `/` 대시보드: 카드가 정상 렌더링
- 다른 프로젝트 hero에 영향 없음 (fingoo, hey-bara 등)

- [ ] **Step 4: Commit**

```bash
git add apps/client/src/components/KimproHero.tsx
git commit -m "feat: redesign Aimers hero — system architecture view with agent orchestration"
```

---

### Task 4: 최종 확인 및 정리 커밋

- [ ] **Step 1: 전체 빌드 확인**

Run: `cd /Users/genie/workspace/genie-cv && bun run build`
Expected: 빌드 성공, 에러 없음

- [ ] **Step 2: 전체 페이지 시각 확인**

확인 리스트:
- `/projects/kimpro`: hero 아키텍처 도식 + 4문단 description + features 카드 + 개발 노트
- `/projects`: 카드 썸네일에서 hero 정상 표시, description 첫 2줄 자연스러운 잘림
- `/`: 대시보드 카드 정상
- 다른 프로젝트들 (`/projects/fingoo`, `/projects/hey-bara` 등): 영향 없음

- [ ] **Step 3: 정리 커밋 (필요 시)**

변경이 있으면:
```bash
git add -A
git commit -m "fix: visual adjustments for Aimers hero and description"
```

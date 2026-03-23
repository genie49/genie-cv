# hey-bara 포트폴리오 추가 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** genie-cv 포트폴리오 사이트에 hey-bara 프로젝트를 데이터, 콘텐츠, 히어로 컴포넌트와 함께 추가하고, RAG 임베딩을 재실행한다.

**Architecture:** projects.json index 1에 프로젝트 메타데이터를 추가하고, 6개 개발 노트 마크다운과 Mermaid 다이어그램을 생성한다. HeyBaraHero SVG 인터랙티브 컴포넌트를 기존 히어로 패턴으로 구현하고, 프론트엔드 라우팅을 연결한 뒤 임베딩 파이프라인을 재실행한다.

**Tech Stack:** React, TypeScript, Motion, SVG, Markdown, Mermaid, Gemini Embedding, LanceDB

**Spec:** `docs/superpowers/specs/2026-03-19-hey-bara-portfolio-addition-design.md`

---

### Task 1: projects.json에 hey-bara 엔트리 추가

**Files:**
- Modify: `data/projects.json` — 배열 index 1에 hey-bara 엔트리 삽입 (kimpro 뒤, fingoo 앞)

- [ ] **Step 1: projects.json 수정**

스펙 문서의 완전한 JSON 엔트리를 index 1에 삽입. features 6개, notes 6개 (모두 projectSlug: "hey-bara"), github 링크 포함.

- [ ] **Step 2: JSON 유효성 검증**

Run: `cd /Users/genie/workspace/genie-cv && node -e "JSON.parse(require('fs').readFileSync('data/projects.json','utf8')); console.log('Valid JSON')"`

- [ ] **Step 3: 커밋**

```bash
git add data/projects.json
git commit -m "feat: projects.json에 hey-bara 프로젝트 엔트리 추가"
```

---

### Task 2: HeyBaraHero 컴포넌트 생성

**Files:**
- Create: `apps/client/src/components/HeyBaraHero.tsx`

**Reference:** `apps/client/src/components/KimproHero.tsx`를 베이스로 복사 후 수정.

> Note: Node, Arrow, 줌/패닝 로직 중복은 기존 패턴 따름. 추후 리팩토링 가능.

- [ ] **Step 1: HeyBaraHero.tsx 생성**

KimproHero를 복사하여 다음 변경:
- 컴포넌트명: `HeyBaraHero`
- marker id: `bara-arrow`
- 배경 그라디언트: `from-slate-50 via-blue-50/30 to-emerald-50/20`
- 타이틀: `HEY BARA` + `[ VOICE_PIPELINE ]`
- 하단 텍스트: `Sherpa-ONNX · Koog Agent · Gemini API · Supertonic 2`

노드 배치 (스펙 Section 2 테이블 기준):
```tsx
{/* 사용자 (left) */}
<Node x={20} y={90} w={70} h={48} label="사용자" color="violet" delay={FLOW_DELAY} />
<Arrow points="90,114 115,95" delay={FLOW_DELAY * 2} />

{/* 웨이크 워드 */}
<Node x={115} y={70} w={100} h={50} label="웨이크 워드" sub="Porcupine" color="blue" delay={FLOW_DELAY * 3} />
<Arrow points="215,95 240,95" delay={FLOW_DELAY * 4} />

{/* 음성 인식 */}
<Node x={240} y={70} w={100} h={50} label="음성 인식" sub="Sherpa-ONNX STT" color="blue" delay={FLOW_DELAY * 5} />
<Arrow points="340,95 365,95" delay={FLOW_DELAY * 6} />

{/* 명령 처리 */}
<Node x={365} y={70} w={100} h={50} label="명령 처리" sub="Koog Agent" color="emerald" delay={FLOW_DELAY * 7} />
<Arrow points="465,95 490,95" delay={FLOW_DELAY * 8} />

{/* 음성 응답 */}
<Node x={490} y={70} w={100} h={50} label="음성 응답" sub="Supertonic 2 TTS" color="amber" delay={FLOW_DELAY * 9} />

{/* 점선: Tool 실행 */}
<Arrow points="415,120 365,170" delay={FLOW_DELAY * 10} dashed />
<Arrow points="415,120 448,170" delay={FLOW_DELAY * 10} dashed />
<Arrow points="415,120 548,170" delay={FLOW_DELAY * 10} dashed />

{/* 액션 노드 */}
<Node x={315} y={170} w={85} h={34} label="전화 · 문자" color="zinc" delay={FLOW_DELAY * 11} />
<Node x={415} y={170} w={85} h={34} label="일정 · 알림" sub="Google Calendar" color="zinc" delay={FLOW_DELAY * 11.5} />
<Node x={515} y={170} w={85} h={34} label="앱 제어" sub="Accessibility" color="zinc" delay={FLOW_DELAY * 12} />
```

- [ ] **Step 2: 커밋**

```bash
git add apps/client/src/components/HeyBaraHero.tsx
git commit -m "feat: HeyBaraHero 인터랙티브 SVG 컴포넌트 생성"
```

---

### Task 3: 프론트엔드 라우팅 연결

**Files:**
- Modify: `apps/client/src/pages/ProjectDetailPage.tsx`
- Modify: `apps/client/src/components/dashboard/ProjectCard.tsx`

- [ ] **Step 1: ProjectDetailPage.tsx 수정**

import 추가 + Hero 분기에 hey-bara 케이스 추가 (kimpro 뒤, fingoo 앞).

- [ ] **Step 2: ProjectCard.tsx 수정**

import 추가 + ProjectHeroThumbnail에 hey-bara 분기 추가.

- [ ] **Step 3: 커밋**

```bash
git add apps/client/src/pages/ProjectDetailPage.tsx apps/client/src/components/dashboard/ProjectCard.tsx
git commit -m "feat: ProjectDetailPage·ProjectCard에 hey-bara 히어로 분기 추가"
```

---

### Task 4: 프로젝트 콘텐츠 마크다운 + Mermaid

**Files:**
- Create: `data/content/projects/hey-bara.md`
- Create: `data/architectures/projects/hey-bara.mmd`

**Reference:** `~/workspace/hey-bara` 실제 코드 참조. `data/content/projects/fingoo.md` 스타일.

- [ ] **Step 1: hey-bara.md 작성** (~60-80줄)

구조: 프로젝트 개요, 기술 스택, 주요 기능 (6개 H3), 담당 영역.
코드 스니펫 포함 가능.

- [ ] **Step 2: hey-bara.mmd 작성**

Mermaid graph LR: 사용자 → Wake Word → STT → Agent(14 Tools) → TTS → 사용자. 하단에 디바이스 서비스(Calendar, Contacts, Accessibility) 연결.

- [ ] **Step 3: 커밋**

```bash
git add data/content/projects/hey-bara.md data/architectures/projects/hey-bara.mmd
git commit -m "feat: hey-bara 프로젝트 설명 마크다운 + Mermaid 아키텍처 추가"
```

---

### Task 5: 개발 노트 1~3 마크다운 작성

**Files:**
- Create: `data/content/notes/bara-voice-pipeline.md`
- Create: `data/content/notes/bara-koog-agent.md`
- Create: `data/content/notes/bara-dual-llm.md`

**Reference:** `~/workspace/hey-bara` 실제 코드 참조. 각 노트 ~150-250줄. 코드 스니펫(Kotlin) 포함 가능.

- [ ] **Step 1: bara-voice-pipeline.md 작성**

음성 파이프라인 4단계 통합: Wake Word(Porcupine) → STT(Sherpa-ONNX Zipformer Korean, 9.91% CER) → NLP(Koog Agent) → TTS(Supertonic 2, 66M params). OnDemand 로딩 패턴.

- [ ] **Step 2: bara-koog-agent.md 작성**

Koog 프레임워크 기반 Agent 설계. 14개 SimpleTool 패턴, Function Calling, stateless singleton + mutable static 패턴.

- [ ] **Step 3: bara-dual-llm.md 작성**

Gemini API vs Gemma 3n E2B 듀얼 아키텍처. 비용·지연·품질 트레이드오프 비교 테이블. 전환 전략.

- [ ] **Step 4: 커밋**

```bash
git add data/content/notes/bara-voice-pipeline.md data/content/notes/bara-koog-agent.md data/content/notes/bara-dual-llm.md
git commit -m "feat: hey-bara 개발 노트 1~3 작성 (음성 파이프라인, Agent, 듀얼 LLM)"
```

---

### Task 6: 개발 노트 4~6 마크다운 작성

**Files:**
- Create: `data/content/notes/bara-hitl-confirmation.md`
- Create: `data/content/notes/bara-app-control.md`
- Create: `data/content/notes/bara-state-machine.md`

- [ ] **Step 1: bara-hitl-confirmation.md 작성**

Kotlin Channel 기반 suspend 패턴으로 UI-Agent 브릿지. ActionConfirmation singleton. 10초 auto-confirm. 위험 액션 분류.

- [ ] **Step 2: bara-app-control.md 작성**

AccessibilityService로 UI 트리 캡처 → LLM이 액션 결정 → 최대 30스텝 자동화. AppControlAgent 위임 패턴.

- [ ] **Step 3: bara-state-machine.md 작성**

IDLE → LISTENING → PROCESSING → CONFIRMING 4-State 세션 머신. OnDemand 컴포넌트 로딩 (대기 ~10MB). 타임아웃 전략 (5초 + "네?" + 3초).

- [ ] **Step 4: 커밋**

```bash
git add data/content/notes/bara-hitl-confirmation.md data/content/notes/bara-app-control.md data/content/notes/bara-state-machine.md
git commit -m "feat: hey-bara 개발 노트 4~6 작성 (HITL, 앱 제어, 상태 머신)"
```

---

### Task 7: 임베딩 파이프라인 재실행 및 최종 검증

**Files:**
- Run: `scripts/embed.ts`

- [ ] **Step 1: 임베딩 실행**

Run: `cd /Users/genie/workspace/genie-cv && bun run embed`

- [ ] **Step 2: 로컬 전체 확인**

Run: `cd /Users/genie/workspace/genie-cv && bun run dev`

확인 체크리스트:
- [ ] 프로젝트 목록: hey-bara가 두 번째 위치, 히어로 썸네일 표시
- [ ] `/projects/hey-bara`: HeyBaraHero 다이어그램 렌더링 (줌/패닝)
- [ ] features 6개 가로 스크롤 카드 표시
- [ ] notes 6개 리스트, 각 노트 클릭 시 마크다운 렌더링
- [ ] GitHub 버튼 표시 및 링크 정상
- [ ] AI 챗봇에서 "음성 비서" 또는 "hey bara" 질문 시 관련 답변

# Hey Bara Hero + Description 재설계 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Hey Bara hero를 가로 흐름 시스템 아키텍처로 재설계하고 description을 문제→해결→임팩트 구조로 교체.

**Architecture:** HeyBaraHero.tsx SVG 전면 교체. 기존 색상(violet/emerald/blue/amber/zinc)에 rose/cyan/orange + fontSize 추가.

**Tech Stack:** React, TypeScript, Framer Motion, SVG

**Spec:** `docs/superpowers/specs/2026-03-23-heybara-hero-description-redesign.md`

---

### Task 1: projects.json description 교체

**Files:** `data/projects.json` — hey-bara description

- [ ] **Step 1: description 교체**

```json
"description": "스마트폰으로 전화, 문자, 일정 관리 같은 단순한 작업도 화면을 켜고 앱을 열어 직접 조작해야 합니다. 운전 중이거나 손을 쓸 수 없는 상황에서는 이런 작업이 불가능했습니다.\n\n음성 한마디로 이 모든 것을 해결하기 위해, 웨이크워드 감지부터 음성 인식, AI 판단, 음성 응답까지 4단계 음성 파이프라인을 설계했습니다. Sherpa-ONNX가 \"헤이 바라\" 호출을 감지하고 한국어 음성을 텍스트로 변환하면, Koog AI Agent가 적절한 도구를 선택해 전화·문자·카카오톡·일정·앱 제어를 실행합니다. Supertonic 2 TTS가 결과를 음성으로 안내합니다.\n\n전화·문자 같은 비가역적 액션은 반드시 사용자 확인을 거치는 Human-in-the-Loop 패턴을 적용했습니다. AccessibilityService 기반 범용 앱 제어로 에이전트가 직접 앱 화면을 조작할 수도 있어, 별도 API가 없는 앱까지 음성으로 제어할 수 있습니다."
```

- [ ] **Step 2: JSON 확인 + Commit**

```bash
node -e "JSON.parse(require('fs').readFileSync('data/projects.json','utf8')); console.log('valid')"
git add data/projects.json && git commit -m "content: rewrite Hey Bara description — problem-solution-impact structure"
```

---

### Task 2: HeyBaraHero SVG 전면 재설계

**Files:** `apps/client/src/components/HeyBaraHero.tsx`

- [ ] **Step 1: Node에 rose/cyan/orange+fontSize 추가, Arrow에 stroke 추가**

HeyBaraHero 기존 색상: `"violet" | "emerald" | "blue" | "amber" | "zinc"`. 추가:

```tsx
color: "violet" | "emerald" | "blue" | "amber" | "zinc" | "rose" | "cyan" | "orange";
```

colors에 추가:
```tsx
rose: { fill: "#ffe4e6", stroke: "#fda4af", text: "#9f1239", sub: "#e11d48" },
cyan: { fill: "#cffafe", stroke: "#67e8f9", text: "#155e75", sub: "#0891b2" },
orange: { fill: "#fff7ed", stroke: "#fed7aa", text: "#c2410c", sub: "#ea580c" },
```

fontSize prop + Arrow stroke prop + amber marker (동일 패턴).

- [ ] **Step 2: SVG 콘텐츠를 가로 흐름 아키텍처로 교체**

mockup `heybara-hero-direction.html` 기준 좌표 사용. 기존 SVG 콘텐츠 (lines ~289-331) 전부 제거 후 교체.

레이아웃:
- 좌측: Wake Word (blue) → STT (blue) — 세로 흐름
- 중앙: Koog AI Agent 큰 박스 (emerald) — Gemini + 4 Tool categories (rose) + HITL (amber) + VoiceSession FSM + 대화 히스토리 + System Prompt
- 우측 상단: TTS (amber)
- 우측 하단: Device API 3개 (zinc) — Accessibility, Calendar, SmsManager
- 최하단: Android 플랫폼 바 (violet) + Room DB, SecurePref, OAuth 2.0

- [ ] **Step 3: 빌드 확인 + Commit**

```bash
bun run build
git add apps/client/src/components/HeyBaraHero.tsx
git commit -m "feat: redesign Hey Bara hero — system architecture with voice pipeline and agent"
```

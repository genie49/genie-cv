# hey-bara 포트폴리오 추가 — 설계 문서

> **목적**: 토스 AI Engineer (Agent) 포지션 지원을 위해, genie-cv 포트폴리오에 hey-bara 프로젝트를 차별화 포인트로 추가한다.
> **방식**: 데이터 + 콘텐츠 + 히어로 컴포넌트를 일괄 추가하고, 임베딩을 재실행한다.
> **공개 범위**: GitHub 공개 프로젝트. 코드 스니펫 포함 가능.

---

## 1. projects.json 엔트리

> **삽입 위치**: 배열 index 1 (kimpro 다음, fingoo 앞). Agent 포지션 차별화 포인트.

```json
{
  "slug": "hey-bara",
  "title": "헤이 바라 — 온디바이스 AI 음성 비서",
  "description": "\"헤이 바라\" 웨이크 워드로 호출하는 Android AI 음성 비서입니다. Sherpa-ONNX 한국어 STT, Koog AI Agent의 14개 Tool Calling, Supertonic 2 한국어 TTS를 통합한 음성 파이프라인으로 전화·문자·일정·앱 제어를 음성으로 수행합니다. Gemini 클라우드와 Gemma 온디바이스 듀얼 LLM 아키텍처를 설계했습니다.",
  "tags": ["Kotlin", "Sherpa-ONNX", "Koog", "Gemini", "Jetpack Compose", "ONNX", "Android"],
  "period": "2026.01 ~ 2026.03",
  "github": "https://github.com/genie49/hey-bara",
  "features": [
    { "title": "음성 파이프라인", "description": "Porcupine 웨이크 워드 → Sherpa-ONNX Zipformer 한국어 STT → Koog AI Agent → Supertonic 2 한국어 TTS. OnDemand 로딩으로 대기 시 ~10MB" },
    { "title": "AI Agent + 14개 Tool", "description": "Koog(JetBrains) 프레임워크 기반 Agent가 연락처 검색, 전화, 문자, 카카오톡, 일정 관리, 알림 조회, 앱 제어 등 14개 도구를 Function Calling으로 실행" },
    { "title": "듀얼 LLM 아키텍처", "description": "Gemini API 클라우드 모드와 Gemma 3n E2B 온디바이스 모드를 설계. 네트워크 상태·비용·지연 시간에 따라 전환" },
    { "title": "Human-in-the-Loop 확인", "description": "전화·문자 등 위험 액션에 Channel 기반 UI-Agent 브릿지로 사용자 확인. 10초 타임아웃 자동 확인" },
    { "title": "범용 앱 제어", "description": "AccessibilityService로 UI 트리를 캡처하고, LLM이 클릭·입력·스크롤 액션을 결정하는 Vision-Language 앱 자동화" },
    { "title": "Google Calendar/Tasks 연동", "description": "OAuth 2.0 인증 후 REST API 직접 호출로 일정 CRUD. 클라이언트 라이브러리 없이 경량 구현" }
  ],
  "notes": [
    { "id": "bara-voice-pipeline", "projectSlug": "hey-bara", "title": "\"헤이 바라\" — 한마디로 시작되는 4단계 음성 파이프라인", "date": "2026-01-15", "tags": ["Sherpa-ONNX", "STT", "TTS", "Pipeline"], "summary": "웨이크 워드 감지부터 음성 인식, AI 처리, 음성 합성까지 4단계를 하나의 파이프라인으로 통합하고, OnDemand 로딩으로 대기 시 메모리를 최소화한 설계" },
    { "id": "bara-koog-agent", "projectSlug": "hey-bara", "title": "음성 한마디에 14가지 행동 — Koog Agent와 Tool Calling", "date": "2026-01-25", "tags": ["Koog", "Agent", "Tool Calling"], "summary": "JetBrains Koog 프레임워크로 14개 SimpleTool을 등록하고, Gemini Function Calling으로 음성 명령을 디바이스 액션으로 변환하는 Agent 설계" },
    { "id": "bara-dual-llm", "projectSlug": "hey-bara", "title": "클라우드가 안 되면? 폰이 직접 생각한다", "date": "2026-02-05", "tags": ["Gemini", "Gemma", "On-Device", "Architecture"], "summary": "Gemini API 클라우드와 Gemma 3n 온디바이스 모드를 설계하면서 비용·지연·품질 트레이드오프를 분석한 의사결정 과정" },
    { "id": "bara-hitl-confirmation", "projectSlug": "hey-bara", "title": "AI가 멋대로 전화를 걸면 안 되잖아", "date": "2026-02-15", "tags": ["HITL", "Coroutine", "Channel"], "summary": "위험 액션에 Kotlin Channel 기반 suspend 패턴으로 UI-Agent 브릿지를 만들고, 사용자 확인을 받는 Human-in-the-Loop 설계" },
    { "id": "bara-app-control", "projectSlug": "hey-bara", "title": "\"스포티파이에서 내 플레이리스트 틀어줘\"", "date": "2026-02-25", "tags": ["Accessibility", "Vision-Language", "App Control"], "summary": "AccessibilityService로 UI 트리를 캡처하고 LLM이 클릭·입력 액션을 결정하는 범용 앱 제어 Agent 설계. 최대 30스텝 자동화" },
    { "id": "bara-state-machine", "projectSlug": "hey-bara", "title": "IDLE → LISTENING → PROCESSING → CONFIRMING", "date": "2026-03-05", "tags": ["State Machine", "OnDemand", "Session"], "summary": "4-State 세션 상태 머신으로 음성 비서의 전체 라이프사이클을 관리하고, OnDemand 컴포넌트 로딩으로 대기 시 메모리 10MB를 달성한 설계" }
  ]
}
```

- 하이라이트 태그 (처음 4개): **Kotlin, Sherpa-ONNX, Koog, Gemini**
- GitHub 링크 포함: `https://github.com/genie49/hey-bara`

---

## 2. HeyBaraHero 컴포넌트

### 디자인

FingooHero/KimproHero와 동일한 SVG 인터랙티브 패턴. 횡방향 음성 파이프라인 흐름.

- **viewBox**: 640×280
- **좌상단 타이틀**: `HEY BARA` + `[ VOICE_PIPELINE ]`
- **배경 그라디언트**: `from-slate-50 via-blue-50/30 to-emerald-50/20`
- **하단 텍스트**: `Sherpa-ONNX · Koog Agent · Gemini API · Supertonic 2`

### 노드 배치

| 노드 | x | y | w | h | label | sub | 색상 |
|---|---|---|---|---|---|---|---|
| 사용자 | 20 | 90 | 70 | 48 | 사용자 | (없음) | violet |
| 웨이크 워드 | 115 | 70 | 100 | 50 | 웨이크 워드 | Porcupine | blue |
| 음성 인식 | 240 | 70 | 100 | 50 | 음성 인식 | Sherpa-ONNX STT | blue |
| 명령 처리 | 365 | 70 | 100 | 50 | 명령 처리 | Koog Agent | emerald |
| 음성 응답 | 490 | 70 | 100 | 50 | 음성 응답 | Supertonic 2 TTS | amber |
| 전화·문자 | 315 | 170 | 85 | 34 | 전화 · 문자 | (없음) | zinc |
| 일정·알림 | 415 | 170 | 85 | 34 | 일정 · 알림 | Google Calendar | zinc |
| 앱 제어 | 515 | 170 | 85 | 34 | 앱 제어 | Accessibility | zinc |

> Note: 우측 사용자 노드는 노드 겹침 문제로 제거. 음성 응답이 파이프라인 끝점.

### 화살표

**실선 (파이프라인 흐름, 좌→우)**:
- 사용자 → 웨이크 워드
- 웨이크 워드 → 음성 인식
- 음성 인식 → 명령 처리
- 명령 처리 → 음성 응답

**점선 (Tool 실행, 위→아래)**:
- 명령 처리 → 전화·문자
- 명령 처리 → 일정·알림
- 명령 처리 → 앱 제어

### 구현

- `apps/client/src/components/HeyBaraHero.tsx` 새 파일 생성
- **Node 색상 타입**: `"violet" | "emerald" | "blue" | "amber" | "zinc"`
- marker id: `bara-arrow`
- `ProjectDetailPage.tsx`, `ProjectCard.tsx`에 slug 분기 추가

---

## 3. 콘텐츠 파일

### 생성할 파일 목록

```
data/content/projects/hey-bara.md              # 프로젝트 상세 설명 (RAG용)
data/content/notes/bara-voice-pipeline.md      # 음성 파이프라인
data/content/notes/bara-koog-agent.md          # Koog Agent + Tool
data/content/notes/bara-dual-llm.md            # 듀얼 LLM 아키텍처
data/content/notes/bara-hitl-confirmation.md   # HITL 확인 패턴
data/content/notes/bara-app-control.md         # 범용 앱 제어
data/content/notes/bara-state-machine.md       # 상태 머신
data/architectures/projects/hey-bara.mmd       # Mermaid 아키텍처 다이어그램
```

### 노트 마크다운 구조

kimpro 노트와 동일한 구조. 단, **코드 스니펫 포함 가능** (GitHub 공개 프로젝트).

```markdown
# {대화체 제목}

{1-2문장 도입부}

## 배경 / 문제
## 설계 의사결정
## 아키텍처 (Mermaid 다이어그램 + 코드 스니펫)
## 결과 / 교훈
## 핵심 인사이트
```

### 콘텐츠 작성 원칙

1. **코드 스니펫 포함**: Kotlin 코드 발췌 가능 (GitHub 공개)
2. **대화체 톤**: 기존 노트와 일관된 스타일
3. **Agent 포지션 관점**: 각 노트가 Agent 시스템 설계 역량을 보여주도록 프레이밍

---

## 4. 프론트엔드 변경

### HeyBaraHero.tsx

`apps/client/src/components/HeyBaraHero.tsx`에 새 파일 생성.

### ProjectDetailPage.tsx

```tsx
import { HeyBaraHero } from "../components/HeyBaraHero";

project.slug === "kimpro" ? (
  <KimproHero className="h-[360px]" interactive />
) : project.slug === "hey-bara" ? (
  <HeyBaraHero className="h-[360px]" interactive />
) : project.slug === "fingoo" ? (
  ...
```

### ProjectCard.tsx (ProjectHeroThumbnail)

```tsx
import { HeyBaraHero } from "../HeyBaraHero";

if (slug === "kimpro") return <KimproHero className={className} />;
if (slug === "hey-bara") return <HeyBaraHero className={className} />;
if (slug === "fingoo") return <FingooHero className={className} />;
```

---

## 5. 데이터 업데이트

### profile.json techStack 수정

```diff
- "AI/ML": ["LangChain", "RAG", "Gemini", "Grok", "HuggingFace", "Claude"],
+ "AI/ML": ["LangChain", "RAG", "Gemini", "Grok", "HuggingFace", "Claude", "Sherpa-ONNX"],

+ "MOBILE": ["Kotlin", "Jetpack Compose", "Android"],
```

> Note: Sherpa-ONNX를 AI/ML에 추가, 새로운 MOBILE 카테고리 신설.

---

## 6. 프로젝트 순서

projects.json 배열 순서: **kimpro → hey-bara → fingoo → ai-portfolio-chatbot**

---

## 7. Citation 매핑 및 임베딩

기존 동적 매핑 로직이 자동 처리. 추가 코드 수정 불필요.
`bun run embed` 재실행으로 모든 새 콘텐츠 자동 인덱싱.

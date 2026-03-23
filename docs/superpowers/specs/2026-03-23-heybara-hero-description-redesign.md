# Hey Bara Hero 도식도 + Description 재설계

**Date:** 2026-03-23
**Scope:** `HeyBaraHero.tsx` SVG 재설계 + `projects.json` description 교체

## 배경

동일 시리즈. 현재 Hey Bara hero는 선형 파이프라인(사용자→웨이크워드→STT→Agent→TTS→도구)으로 기술적 깊이가 드러나지 않음.

## 변경 파일

| 파일 | 변경 내용 |
|------|----------|
| `apps/client/src/components/HeyBaraHero.tsx` | SVG 전면 재설계. Node에 orange+cyan+fontSize 추가, Arrow에 stroke 추가 |
| `data/projects.json` | hey-bara의 `description` 필드 교체 |

---

## 1. Hero 도식도 재설계

### 방향
가로 흐름: Voice Input → Agent System → Voice Output + Device API. 하단 Android 플랫폼 바.

### 레이아웃 (viewBox 640×280)

**좌측 — VOICE INPUT:**
- Wake Word / Sherpa-ONNX KWS (blue)
- STT / Zipformer Korean (blue)
- 세로 화살표로 연결

**중앙 — Koog AI Agent (큰 emerald 박스):**
- Gemini API / Function Calling (emerald, 메인 노드)
- Tool 카테고리 4개: 전화·문자, 카카오톡, 일정·할일, 앱 제어 (rose)
- Human-in-the-Loop (amber 바)
- VoiceSession FSM (zinc)
- 대화 히스토리 + System Prompt (zinc)
- ForegroundService 상시 대기 텍스트

**우측 상단 — VOICE OUTPUT:**
- TTS / Supertonic 2 (amber)

**우측 하단 — DEVICE API:**
- Accessibility (zinc)
- Calendar API (zinc)
- SmsManager (zinc)
- Tool에서 점선 연결

**최하단 — Android 플랫폼:**
- Android · Kotlin · Jetpack Compose · Clean Architecture 바 (violet)
- Room DB, SecurePref, OAuth 2.0 (zinc)

### 기존 패턴 준수
- viewBox 640×280, Node/Arrow 재사용
- HeyBaraHero 기존 색상: `"violet" | "emerald" | "blue" | "amber" | "zinc"`. 추가: `"orange" | "cyan" | "rose"` + `fontSize` prop
- Arrow에 `stroke` prop + amber marker (`heybara-arrow-amber`)
- FLOW_DELAY 애니메이션, zoom/pan, "HEY BARA" 타이틀

### 색상 체계
| 역할 | 색상 |
|------|------|
| blue | Wake Word, STT |
| emerald | Agent System, Gemini |
| rose | Tool 카테고리 |
| amber | TTS, Human-in-the-Loop |
| zinc | Device API, FSM, 보조 노드 |
| violet | Android 플랫폼 바 |

---

## 2. Description 교체

### 변경 후
```
스마트폰으로 전화, 문자, 일정 관리 같은 단순한 작업도 화면을 켜고 앱을 열어 직접 조작해야 합니다. 운전 중이거나 손을 쓸 수 없는 상황에서는 이런 작업이 불가능했습니다.

음성 한마디로 이 모든 것을 해결하기 위해, 웨이크워드 감지부터 음성 인식, AI 판단, 음성 응답까지 4단계 음성 파이프라인을 설계했습니다. Sherpa-ONNX가 "헤이 바라" 호출을 감지하고 한국어 음성을 텍스트로 변환하면, Koog AI Agent가 적절한 도구를 선택해 전화·문자·카카오톡·일정·앱 제어를 실행합니다. Supertonic 2 TTS가 결과를 음성으로 안내합니다.

전화·문자 같은 비가역적 액션은 반드시 사용자 확인을 거치는 Human-in-the-Loop 패턴을 적용했습니다. AccessibilityService 기반 범용 앱 제어로 에이전트가 직접 앱 화면을 조작할 수도 있어, 별도 API가 없는 앱까지 음성으로 제어할 수 있습니다.
```

---

## 3. 변경하지 않는 것

- ProjectDetailPage, ProjectCard (멀티 문단 렌더링 이미 구현)
- features, notes, `data/content/projects/hey-bara.md`
- 다른 프로젝트 hero/description

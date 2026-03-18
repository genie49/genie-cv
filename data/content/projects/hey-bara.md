# 헤이 바라 — 온디바이스 AI 음성 비서

웨이크워드로 호출하면 음성을 인식하고, AI Agent가 14개 Tool을 활용해 전화·문자·카카오톡·일정·할일·앱 제어까지 수행하는 Android 음성 비서.

## 프로젝트 개요

"헤이 바라"라고 부르면 깨어나는 온디바이스 AI 비서입니다. Sherpa-ONNX 기반 웨이크워드 감지와 한국어 STT, JetBrains Koog AI Agent 프레임워크, Supertonic 2 한국어 TTS를 결합한 완전한 음성 파이프라인을 구현했습니다. Gemini API(클라우드)와 Gemma 3n(온디바이스) 듀얼 LLM 아키텍처를 설계하여 온·오프라인 환경 모두에서 동작합니다. Galaxy S25 Edge를 타겟으로 개인용 APK 사이드로딩으로 배포합니다.

## 기술 스택

- **플랫폼**: Android (Kotlin) — Jetpack Compose + Clean Architecture
- **웨이크워드**: Sherpa-ONNX KWS (zh-en 음소 모델, ~5MB)
- **STT**: Sherpa-ONNX Zipformer Korean (~300MB, 온디바이스)
- **AI Agent**: Koog (JetBrains) + Gemini API / Gemma 3n E2B
- **TTS**: Supertonic 2 (66M params, ONNX, ~263MB) — fallback: Android 기본 TTS
- **데이터**: Room DB, SecurePreferences, Google Calendar/Tasks REST API
- **디바이스 API**: AccessibilityService, NotificationListenerService, SmsManager

## 주요 기능

### 음성 파이프라인

Sherpa-ONNX KWS가 "Hey Bara" 웨이크워드를 감지하면 `VoiceSession` 상태 머신이 IDLE → LISTENING → PROCESSING → SPEAKING 순서로 전이합니다. STT가 한국어 음성을 텍스트로 변환하고, Koog Agent가 Tool Calling으로 명령을 실행한 뒤, Supertonic 2 TTS가 결과를 음성으로 안내합니다. 전체 파이프라인이 `ForegroundService`에서 동작하여 화면이 꺼져 있어도 항시 대기합니다.

### AI Agent + 14개 Tool

JetBrains Koog 프레임워크로 `AIAgent`를 구성하고, 14개 `SimpleTool`을 등록합니다. 시스템 프롬프트에 현재 시각과 대화 히스토리를 주입하여 "내일 오후 3시"와 같은 상대 시간 표현을 처리합니다.

```kotlin
private fun createAgent() = AIAgent(
    promptExecutor = executor,
    systemPrompt = buildSystemPrompt(),
    llmModel = model,
    toolRegistry = buildTools(),   // 14개 SimpleTool
    maxIterations = 15
)
```

### 듀얼 LLM 아키텍처

클라우드 모드(Gemini API)와 온디바이스 모드(Gemma 3n E2B, ~2GB)를 설정에서 전환할 수 있습니다. 클라우드 모드는 무료 티어로 동작하고, 온디바이스 모드는 오프라인 환경에서 프라이버시를 보장합니다.

### Human-in-the-Loop 확인

전화·문자·카카오톡 등 비가역적 액션은 `ActionConfirmation`을 통해 사용자 확인 모달을 띄운 뒤 실행합니다. Tool이 직접 확인 플로우를 호출하고, 취소 시 "사용자가 취소했습니다"를 반환하여 Agent가 자연스럽게 대응합니다.

```kotlin
val confirmed = ActionConfirmation.requestConfirmation(
    "${args.contact}님에게 전화를 겁니다", ActionType.CALL
)
if (!confirmed) return "사용자가 취소했습니다."
```

### 범용 앱 제어

`AccessibilityService`로 화면 UI 트리를 읽고, 별도 Gemini Agent가 click·scroll·type_text 등 7개 액션 Tool로 앱을 조작하는 DroidBot-GPT 방식의 범용 앱 제어입니다. 최대 30 iteration 내에서 목표를 달성하며, 보안을 위해 사용자가 설정에서 등록한 앱만 제어할 수 있습니다.

### Google Calendar/Tasks 연동

OAuth 2.0으로 Google 계정을 연결하면 캘린더 CRUD(list/create/update/delete)와 할일 CRUD(list/create/complete/delete) 8개 Tool이 활성화됩니다. Agent가 자연어 날짜 표현을 ISO 8601로 변환하여 REST API를 호출합니다.

## 담당 영역

1인 개발 프로젝트로 기획·설계·구현·배포 전 과정을 수행했습니다:

- **음성 파이프라인 설계**: 웨이크워드 → STT → Agent → TTS 전체 흐름, VoiceSession 상태 머신, ForegroundService 상시 대기
- **AI Agent 구현**: Koog 프레임워크 기반 14개 Tool 설계, 시스템 프롬프트 엔지니어링, 대화 히스토리 관리
- **Human-in-the-Loop**: ActionConfirmation 브릿지 패턴으로 Tool ↔ UI 확인 플로우 구현
- **범용 앱 제어**: AccessibilityService + Gemini Agent 기반 DroidBot-GPT 방식 UI 자동화
- **온디바이스 ML**: Sherpa-ONNX STT/KWS, Supertonic 2 TTS ONNX 추론 파이프라인 통합
- **Clean Architecture**: domain(순수 Kotlin 인터페이스) → data(SDK 구현) → ui/service 의존성 분리

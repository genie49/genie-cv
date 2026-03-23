# 왜 Sherpa-ONNX와 Koog인가

안드로이드 폰 위에서 음성 비서를 만들겠다고 결심했을 때, 가장 먼저 부딪힌 질문은 "어떤 프레임워크를 쓸 것인가"였습니다. 음성 인식 엔진, AI Agent 프레임워크, 추론 런타임 — 세 가지 축에서 각각 선택지를 비교한 과정을 정리합니다.

## ONNX Runtime vs TFLite

온디바이스 AI 추론 런타임의 양대 산맥은 ONNX Runtime과 TensorFlow Lite입니다.

| 항목 | ONNX Runtime | TFLite |
|---|---|---|
| 모델 생태계 | PyTorch → ONNX 변환 한 줄 | TF/Keras 전용, PyTorch 모델은 이중 변환 필요 |
| 연산자 지원 | Transformer 계열 완전 지원 | Custom op 필요한 경우 빈번 |
| Java/Kotlin API | `onnxruntime-android` AAR 공식 지원 | `tensorflow-lite` AAR 공식 지원 |
| 양자화 | int8/fp16 내장 | int8/fp16 내장 |

결정적 차이는 **모델 생태계**였습니다. Sherpa-ONNX의 한국어 STT, Supertonic TTS 모두 PyTorch 기반으로 학습된 모델입니다. ONNX 포맷이면 `torch.onnx.export` 한 줄로 변환이 끝나지만, TFLite로 가려면 ONNX → TF SavedModel → TFLite로 이중 변환해야 하고, 중간에 지원 안 되는 연산자를 만날 확률이 높습니다.

```kotlin
// build.gradle.kts — ONNX Runtime + Sherpa-ONNX 공존
implementation("com.microsoft.onnxruntime:onnxruntime-android:1.17.1")
implementation(files("libs/sherpa-onnx-1.12.29.aar"))
```

`onnxruntime-android`는 TTS 모델(Supertonic 2)의 4개 ONNX 세션을 직접 관리하고, Sherpa-ONNX AAR은 내부적으로 같은 ONNX Runtime 1.17.1을 사용합니다. `jniLibs.pickFirsts`로 네이티브 라이브러리 충돌을 해결했습니다.

## Sherpa-ONNX vs Whisper

온디바이스 STT의 선택지는 크게 OpenAI Whisper와 Sherpa-ONNX입니다.

| 항목 | Whisper (tiny/base) | Sherpa-ONNX Zipformer |
|---|---|---|
| 한국어 CER | ~15% (tiny), ~12% (base) | **9.91%** |
| 모델 크기 | 39MB (tiny), 74MB (base) | ~300MB (3개 ONNX) |
| 스트리밍 | X (오프라인 전용) | **O (실시간 부분 결과)** |
| 웨이크워드 | 별도 엔진 필요 | **KWS 내장 (동일 프레임워크)** |

Whisper는 범용적이지만 **스트리밍을 지원하지 않습니다**. 음성 비서에서 사용자가 말하는 동안 실시간으로 텍스트가 나타나야 하는데, Whisper는 발화가 끝난 후에야 결과를 반환합니다. Sherpa-ONNX Zipformer는 스트리밍 인식이 가능하고, 같은 프레임워크 안에서 웨이크워드 감지(KWS)까지 처리합니다.

한국어 CER 9.91%도 Whisper tiny(~15%)보다 크게 앞섭니다. 모델 크기가 300MB로 큰 편이지만, APK 번들이 아닌 별도 다운로드 방식이므로 수용 가능했습니다.

## Koog vs LangChain

AI Agent 프레임워크 선택이 가장 고민이었습니다.

| 항목 | LangChain (Python/JS) | Koog (Kotlin) |
|---|---|---|
| 언어 | Python, TypeScript | **Kotlin** (네이티브) |
| 안드로이드 통합 | 서버 필요 or React Native 브릿지 | **직접 앱 내 실행** |
| Tool 정의 | 데코레이터 기반 | `SimpleTool` + `@LLMDescription` |
| 메모리 | 다양한 메모리 타입 | 대화 히스토리 직접 관리 |
| 성숙도 | 프로덕션 검증 다수 | 2024년 출시, 초기 단계 |

LangChain은 생태계가 압도적이지만, **안드로이드 앱 안에서 직접 돌릴 수 없습니다**. Python 서버를 따로 두거나 JS 브릿지를 써야 합니다. 음성 비서는 네트워크 지연을 최소화해야 하고, Tool이 `Context`에 직접 접근해 전화를 걸거나 SMS를 보내야 합니다.

JetBrains Koog(v0.6.4)는 Kotlin 네이티브 Agent 프레임워크입니다. `SimpleTool`로 도구를 정의하면 Gemini Function Calling과 자동 연동되고, `suspend fun execute()` 안에서 안드로이드 API를 직접 호출할 수 있습니다.

```kotlin
// Koog SimpleTool — 안드로이드 Context에 직접 접근
object MakeCallTool : SimpleTool<MakeCallTool.Args>(...) {
    var appContext: Context? = null
    override suspend fun execute(args: Args): String {
        val intent = Intent(Intent.ACTION_CALL).apply {
            data = Uri.parse("tel:${args.phoneNumber}")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        appContext?.startActivity(intent)  // Android API 직접 호출
        return "${args.contact}에게 전화를 걸었습니다."
    }
}
```

LangChain이었다면 이 한 줄(`appContext?.startActivity(intent)`)을 위해 서버 → 앱 통신 레이어를 추가로 구축해야 했을 것입니다.

## Clean Architecture 레이어 구조

```
com.bara.heybara/
├── domain/          # 인터페이스 + 비즈니스 규칙
│   ├── voice/       # SpeechRecognizer, TtsEngine, WakeWordDetector
│   ├── agent/       # AgentEngine 인터페이스
│   ├── action/      # ActionConfirmation, ContactResolver
│   ├── session/     # VoiceSession, SessionState
│   └── history/     # Conversation, ConversationRepository
├── data/            # 구현체
│   ├── voice/       # SherpaSpeechRecognizer, SherpaKwsWakeWordDetector
│   ├── agent/       # KoogAgentEngine (14개 Tool)
│   ├── tts/         # SupertonicTtsEngine, AndroidTtsEngine
│   └── ...          # 캘린더, 태스크, 알림, 접근성
├── ui/              # Jetpack Compose 화면
├── service/         # VoiceAssistantService (Foreground)
└── config/          # 상수, 테마
```

`domain` 레이어는 순수 Kotlin이고 Android 의존성이 없습니다. `TtsEngine` 인터페이스 덕분에 Supertonic 2와 Android 시스템 TTS를 동일한 코드로 전환할 수 있고, `AgentEngine` 인터페이스 덕분에 Koog를 다른 프레임워크로 교체해도 세션 로직은 변하지 않습니다.

## 핵심 인사이트

- **ONNX Runtime은 PyTorch 생태계의 기본 경로**: Sherpa-ONNX도, Supertonic TTS도 PyTorch 기반. TFLite로 이중 변환하는 것보다 ONNX로 통일하는 게 현실적
- **스트리밍 STT가 음성 비서의 필수 조건**: Whisper의 오프라인 전용 방식은 UX를 해침. 실시간 부분 결과가 나와야 "듣고 있다"는 피드백을 줄 수 있음
- **안드로이드 네이티브 Agent는 Koog가 유일한 선택지**: Context 접근이 필요한 Tool을 앱 내에서 직접 실행하려면 Kotlin 네이티브 프레임워크가 필수

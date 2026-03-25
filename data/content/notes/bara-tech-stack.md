# 왜 이 스택인가 — Sherpa-ONNX + Koog + Kotlin

안드로이드 폰 위에서 음성 비서를 만들겠다고 결심했을 때, 출발점은 **Kotlin 네이티브**였다. 여러 앱을 직접 제어하려면 AccessibilityService가 필요하고, "헤이 바라"로 상시 깨우려면 ForegroundService가 필요하다. 이 두 가지가 네이티브 앱을 강제했다. Flutter나 React Native 같은 크로스플랫폼으로는 이 수준의 시스템 접근이 불가능하다.

Kotlin이 정해지니 나머지 선택은 "이 안에서 돌릴 수 있는 것"을 고르는 과정이었다.

## ONNX Runtime — PyTorch 모델의 기본 경로

온디바이스 AI 추론 런타임의 양대 산맥은 ONNX Runtime과 TensorFlow Lite다.

| 항목 | ONNX Runtime | TFLite |
|---|---|---|
| 모델 생태계 | PyTorch → ONNX 변환 한 줄 | TF/Keras 전용, PyTorch는 이중 변환 필요 |
| 연산자 지원 | Transformer 계열 완전 지원 | Custom op 필요한 경우 빈번 |
| Kotlin API | 공식 AAR 지원 | 공식 AAR 지원 |

결정적 차이는 **모델 생태계**였다. 한국어 STT(Sherpa-ONNX Zipformer)도, TTS(Supertonic 2)도 PyTorch 기반으로 학습된 모델이다. ONNX 포맷이면 변환이 한 줄로 끝나지만, TFLite로 가려면 ONNX → TF SavedModel → TFLite로 이중 변환해야 하고, 중간에 지원 안 되는 연산자를 만날 확률이 높다. PyTorch 생태계를 쓸 거라면 ONNX가 기본 경로다.

## Sherpa-ONNX — 스트리밍 STT가 필수였다

온디바이스 STT 선택에서 Whisper와 Sherpa-ONNX를 비교했다.

| 항목 | Whisper (tiny/base) | Sherpa-ONNX Zipformer |
|---|---|---|
| 한국어 CER | ~15% (tiny), ~12% (base) | 9.91% |
| 스트리밍 | 불가 (오프라인 전용) | 실시간 부분 결과 |
| 웨이크워드 | 별도 엔진 필요 | KWS 내장 |

Whisper는 범용적이지만 **스트리밍을 지원하지 않는다.** 음성 비서에서 사용자가 말하는 동안 실시간으로 텍스트가 나타나야 하는데, Whisper는 발화가 끝난 후에야 결과를 반환한다. "듣고 있다"는 피드백을 줄 수 없다.

Sherpa-ONNX Zipformer는 스트리밍 인식이 가능하고, 같은 프레임워크 안에서 웨이크워드 감지(KWS)까지 처리한다. 한국어 CER 9.91%도 Whisper tiny보다 크게 앞선다. 모델 크기가 큰 편이지만, APK 번들이 아닌 별도 다운로드 방식이므로 수용 가능했다.

## Koog — 안드로이드 앱 안에서 도구를 직접 실행해야 했다

AI Agent 프레임워크 선택이 가장 고민이었다.

| 항목 | LangChain | Koog |
|---|---|---|
| 언어 | Python, TypeScript | Kotlin 네이티브 |
| 안드로이드 통합 | 서버 필요 or 브릿지 | 앱 내 직접 실행 |
| Tool 정의 | 데코레이터 기반 | SimpleTool + 어노테이션 |

LangChain은 생태계가 압도적이지만, **안드로이드 앱 안에서 직접 돌릴 수 없다.** Python 서버를 따로 두거나 JS 브릿지를 써야 한다. 음성 비서의 도구는 전화를 걸고, SMS를 보내고, 앱을 조작하는 것이다. 이런 도구가 안드로이드 Context에 직접 접근해야 한다. 서버를 거치면 네트워크 지연이 생기고, 시스템 API 호출을 위한 통신 레이어를 추가로 구축해야 한다.

JetBrains의 Koog는 Kotlin 네이티브 Agent 프레임워크다. 도구를 정의하면 Gemini Function Calling과 자동 연동되고, 도구 실행 함수 안에서 안드로이드 API를 직접 호출할 수 있다. LangChain이었다면 "전화 걸기" 한 줄을 위해 서버 → 앱 통신 레이어를 추가로 만들어야 했을 것이다.

출시된 지 얼마 안 된 프레임워크라 성숙도는 떨어지지만, **안드로이드 앱 안에서 도구를 직접 실행할 수 있는 Kotlin Agent 프레임워크**는 사실상 Koog가 유일한 선택지였다.

## Clean Architecture로 교체 가능하게

`domain` 레이어는 순수 Kotlin이고 Android 의존성이 없다. `SpeechRecognizer`, `TtsEngine`, `AgentEngine` 같은 인터페이스만 정의하고, 구현체는 `data` 레이어에 둔다. TTS 엔진을 Supertonic에서 Android 시스템 TTS로 바꿔도, Agent 프레임워크를 Koog에서 다른 것으로 바꿔도 세션 로직은 변하지 않는다.

초기 단계의 프레임워크(Koog)를 선택했기 때문에 이 교체 가능성이 더 중요했다. 프레임워크가 발전하면 그대로 쓰고, 문제가 생기면 인터페이스 뒤의 구현체만 바꾸면 된다.

## 돌이켜보면

스택 선택의 출발점은 **"네이티브 앱이어야 한다"**였다. 앱 제어와 상시 웨이크워드가 네이티브를 강제했고, Kotlin이 정해지니 그 안에서 돌릴 수 있는 ONNX Runtime, Sherpa-ONNX, Koog가 자연스럽게 선택됐다. 하나의 제약이 나머지를 결정한 셈이다.

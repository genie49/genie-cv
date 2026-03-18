# 코드는 test가 감시할게~

코드에는 테스트가 있습니다. 프롬프트를 바꾸면 누가 감시할까요? 프롬프트를 수정할 때마다 직접 대화해보며 검증하는 건 회당 30분, 재현성은 제로. 핀구의 7개 에이전트를 체계적으로 평가하기 위한 Harness를 구축하고, 검증 시간을 30분에서 2분으로 단축한 과정을 정리합니다.

## 문제 정의

에이전트 개발의 딜레마: 프롬프트를 수정할 때마다 직접 대화해보며 검증하면 시간이 너무 오래 걸리고, 단위 테스트로는 에이전트의 "판단력"을 테스트할 수 없습니다. 특히 핀구처럼 7개 에이전트가 협업하는 시스템에서는, 한 에이전트의 프롬프트 수정이 전체 시스템에 어떤 영향을 미치는지 예측하기 어렵습니다.

## 왜 자체 Harness를 구축했나

| 접근 | 검토 결과 |
|---|---|
| LangSmith / Braintrust | SaaS 비용 높음, 커스텀 Grader 유연성 부족, 6가지 채점 기준을 자유롭게 조합 불가 |
| pytest 단위 테스트 | 도구 호출 여부는 테스트 가능하나, "어떤 도구를 선택할지"라는 에이전트의 판단력은 assertion으로 검증 불가 |
| 수동 대화 테스트 | 프롬프트 수정마다 7개 에이전트를 직접 대화하며 검증 → 회당 30분+, 재현성 없음 |

자체 Harness 구축에 2주를 투자했지만, 이후 **프롬프트 수정 검증이 30분 → 2분으로 단축**되었습니다. 7개 에이전트 × 8개 태스크 = 56개 테스트 케이스를 15분 만에 자동 실행하고, 실패한 케이스만 집중 분석할 수 있게 되었습니다.

## 평가 아키텍처

```mermaid
flowchart TB
    subgraph "1. 태스크 정의"
        Task[Task 정의<br/>질문 + 기대 결과]
        Dataset[Dataset<br/>여러 Task 묶음]
    end

    subgraph "2. 실행 환경"
        MockService[MockService<br/>ContextVar 기반 주입]
        Stores[Mock Stores<br/>chartdata · indicator<br/>company · market_data<br/>interrupt]
        Runner[AgentRunner<br/>에이전트 실행 + 트랜스크립트 캡처]
    end

    subgraph "3. 채점"
        Grader[GraderEngine<br/>6가지 Grader]
        Outcome[Outcome<br/>pass / fail / error]
    end

    Task --> Runner
    MockService --> Runner
    Stores --> MockService
    Runner --> Grader
    Grader --> Outcome
```

### Task 구조

각 태스크는 에이전트에게 보낼 질문과 기대하는 행동을 정의합니다.

```python
Task(
    name="삼성전자_기술분석",
    query="삼성전자의 RSI와 MACD를 분석해줘",
    expected=Expected(
        tool_calls=["calc_rsi", "calc_macd"],
        output_contains=["RSI", "MACD"],
        state_check={"citations": lambda c: len(c) > 0}
    )
)
```

### MockService — 외부 의존성 격리

실제 API(yfinance, DART, Tavily)를 호출하면 느리고, 결과가 매번 달라져 재현성이 없습니다. `ContextVar` 기반으로 MockService를 주입해 외부 의존성을 완전히 격리합니다.

```mermaid
flowchart LR
    subgraph "프로덕션 모드"
        Tool1[search_tool] --> API[Tavily API]
        Tool2[get_indicator_price] --> YF[yfinance]
        Tool3[financial_statement] --> DART[DART API]
    end

    subgraph "평가 모드"
        Tool4[search_tool] --> Mock1[Mock: 사전 정의 검색 결과]
        Tool5[get_indicator_price] --> Mock2[Mock: chartdata_store]
        Tool6[financial_statement] --> Mock3[Mock: company_store]
    end
```

도구 코드 내부에서 `is_eval_mode()`를 체크해 분기합니다. 이렇게 하면 도구 코드 자체는 수정 없이, 평가 환경에서는 결정론적 결과를 반환합니다.

### MockService 설계 패턴

ContextVar를 선택한 이유는 **전역 상태 오염 없는 스레드별 격리**입니다.

```python
# ContextVar 기반 서비스 주입
_service_context: ContextVar[ServiceProtocol] = ContextVar('service')

def get_service() -> ServiceProtocol:
    return _service_context.get()  # 프로덕션: RealService, 평가: MockService

# 평가 실행 시
token = _service_context.set(MockService(fixtures_path="fixtures/samsung/"))
try:
    result = await run_agent(task)
finally:
    _service_context.reset(token)
```

Mock 데이터는 `fixtures/` 폴더에 실제 API 응답의 JSON 스냅샷으로 관리합니다. yfinance에서 삼성전자 데이터를 한 번 가져와 저장해두면, 이후 테스트에서는 동일한 데이터로 재현성 있는 결과를 얻습니다.

핵심 설계 원칙: **프로덕션 코드에 테스트 분기(`if test:`)를 넣지 않는다**. ContextVar로 서비스를 주입하면, 도구 코드는 자신이 프로덕션에서 실행되는지 평가 환경에서 실행되는지 모릅니다.

## 6가지 Grader

GraderEngine은 6가지 채점 기준을 지원합니다.

```mermaid
flowchart TB
    Transcript[에이전트 트랜스크립트] --> GE[GraderEngine]

    GE --> G1[tool_calls<br/>특정 도구가 호출되었는가?]
    GE --> G2[output_contains<br/>출력에 특정 키워드가 포함되었는가?]
    GE --> G3[output_contains_any<br/>여러 키워드 중 하나라도 포함?]
    GE --> G4[constraints<br/>커스텀 제약 조건 검사]
    GE --> G5[state_check<br/>GraphState 필드 검증]
    GE --> G6[llm_grader<br/>LLM이 응답 품질을 채점]

    G1 --> Result[종합 Outcome<br/>pass / fail / error]
    G2 --> Result
    G3 --> Result
    G4 --> Result
    G5 --> Result
    G6 --> Result
```

### Grader 상세

| Grader | 입력 | 판정 기준 |
|---|---|---|
| `tool_calls` | 기대 도구 목록 | 트랜스크립트에서 해당 도구가 호출되었는지 |
| `output_contains` | 필수 키워드 목록 | 최종 응답에 모든 키워드가 포함되었는지 |
| `output_contains_any` | 키워드 목록 | 하나라도 포함되면 통과 |
| `constraints` | 커스텀 함수 | 함수가 True를 반환하면 통과 |
| `state_check` | 상태 필드별 검증 함수 | GraphState의 특정 필드가 조건을 만족하는지 |
| `llm_grader` | 채점 프롬프트 | LLM이 응답을 읽고 점수를 매김 |

`llm_grader`는 가장 유연하지만, 비결정론적이라 다른 Grader로 검증 가능한 항목은 먼저 rule-based로 체크하고, "응답이 전문적인가?", "설명이 충분한가?" 같은 주관적 품질은 llm_grader로 평가합니다.

## 자가 피드백 프롬프트 개선 파이프라인

평가 결과를 바탕으로 프롬프트를 개선하는 루프입니다.

```mermaid
flowchart TB
    Start[현재 프롬프트] --> Run[Dataset 전체 실행]
    Run --> Grade[GraderEngine 채점]
    Grade --> Analyze{통과율 분석}

    Analyze -->|100% 통과| Done[완료 — 프롬프트 확정]
    Analyze -->|실패 있음| Diagnose[실패 케이스 분석]

    Diagnose --> Pattern[패턴 도출<br/>어떤 유형의 질문에서 실패?]
    Pattern --> Fix[프롬프트 수정<br/>규칙 추가/예시 보강]
    Fix --> Run

    style Done fill:#d1fae5,stroke:#059669
    style Diagnose fill:#fef3c7,stroke:#d97706
```

### 실패 분석 예시

```
Task: "삼성전자 vs SK하이닉스 비교 분석"
Expected tool_calls: [calc_rsi, calc_macd, get_financial_statements]
Actual tool_calls: [calc_rsi, calc_macd]  ← get_financial_statements 누락!

원인: Supervisor가 비교 분석 시 리서치 에이전트를 호출하지 않음
수정: Supervisor 프롬프트에 "비교 분석 요청 시 반드시 리서치 에이전트 포함" 규칙 추가
```

이 과정을 반복하면서 프롬프트가 점진적으로 정교해집니다. 핵심은 "감으로 수정하지 않는 것"입니다. 모든 수정은 실패한 테스트 케이스에 근거합니다.

## Dataset 관리

```python
# datasets/samsung_analysis.py
DATASET = [
    Task(
        name="기본_주가_분석",
        query="삼성전자 주가 분석해줘",
        expected=Expected(
            tool_calls=["search_symbol_tool", "get_indicator_price"],
            output_contains=["삼성전자"]
        )
    ),
    Task(
        name="기술적_분석",
        query="삼성전자 RSI, MACD 분석",
        expected=Expected(
            tool_calls=["calc_rsi", "calc_macd"],
            output_contains=["RSI", "MACD"]
        )
    ),
    # ...
]
```

## 트러블슈팅: 비결정론적 LLM 출력 다루기

### 문제

같은 프롬프트로 "삼성전자 RSI 분석해줘"를 실행해도, LLM 응답이 매번 다릅니다. 도구 호출 순서가 달라지고, 출력 텍스트의 표현도 바뀝니다. 초기 평가 안정성은 **70%** — 10번 실행하면 3번은 다른 결과.

### 시도한 접근들

1. **temperature=0** (부분 해결): 텍스트 변동은 줄었으나 도구 호출 순서는 여전히 달라짐
2. **정확한 문자열 매칭** (기각): "RSI는 65.2입니다" vs "RSI 65.2로 과매수 구간" — 같은 의미지만 매칭 실패

### 최종 해결: Grader별 비결정론 대응

각 Grader가 비결정론을 다르게 처리합니다:

| Grader | 비결정론 대응 |
|---|---|
| tool_calls | **집합(set) 비교** — 호출 순서 무관, 호출 여부만 검사 |
| output_contains | **키워드 포함 여부** — 정확한 문장이 아닌 핵심 키워드만 |
| llm_grader | **3회 실행 다수결** — 2/3 이상 pass면 통과 |

```python
# llm_grader 다수결 로직
async def llm_grade_with_majority(transcript, criteria, runs=3):
    results = [await llm_grade(transcript, criteria) for _ in range(runs)]
    pass_count = sum(1 for r in results if r.passed)
    return pass_count >= (runs // 2 + 1)  # 과반수 통과
```

**결과**: 평가 안정성 70% → 95%. llm_grader의 3회 다수결만으로 false negative가 60% 감소했습니다.

## 핵심 인사이트

- **투자 대비 효과**: Harness 구축 2주 투자 → 이후 프롬프트 수정마다 검증 시간 30분 → 2분. 3회전의 프롬프트 개선으로 전체 통과율 72% → 94%
- **ContextVar 주입 = 깨끗한 프로덕션 코드**: 테스트를 위해 프로덕션 코드에 `if test:` 분기를 넣는 것은 기술 부채. ContextVar로 서비스를 주입하면 도구 코드가 환경을 모르는 상태로 동일하게 동작
- **Rule-based 먼저, LLM 나중에**: 도구 호출 여부, 키워드 포함 같은 객관적 기준은 rule-based로, "분석이 전문적인가?" 같은 주관적 품질만 llm_grader로. 비용과 안정성 모두에서 유리
- **실패 기반 개선이 유일한 방법**: "프롬프트가 좀 더 좋아질 것 같아서" 수정하면 다른 곳이 깨짐. 실패한 테스트 케이스를 근거로 수정해야 회귀를 방지
- **비결정론은 적이 아니라 현실**: LLM 출력의 비결정론을 제거하려 하지 말고, Grader가 비결정론을 수용하도록 설계 (집합 비교, 키워드 포함, 다수결)

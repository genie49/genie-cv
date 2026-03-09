# Wide Event 로깅 전략과 FluentBit 기반 로그 파이프라인

[loggingsucks.com](https://loggingsucks.com/)의 Wide Event 철학을 핀구에 적용한 구조화 로깅 전략과, FluentBit으로 로그를 수집해 Discord 웹훅으로 주요 이벤트를 알림하는 파이프라인을 정리합니다.

## Wide Event란 무엇인가

전통적 로깅은 코드가 무엇을 하는지를 기록합니다.

```
[INFO] Starting request handler
[INFO] Fetching user from database
[INFO] User found: userId=123
[INFO] Processing payment
[ERROR] Payment failed: timeout
```

Wide Event는 **요청에 무슨 일이 일어났는지**를 하나의 포괄적 이벤트로 기록합니다.

```json
{
  "time": "2025-03-01T12:00:00.000+0900",
  "level": "error",
  "msg": "request completed",
  "service": "fingoo-api",
  "method": "POST",
  "path": "/api/chat",
  "status": 500,
  "duration_ms": 3200,
  "user_id": "usr_abc123",
  "subscription_tier": "premium",
  "model": "STANDARD",
  "agent_count": 3,
  "tools_called": ["calc_rsi", "search_tool"],
  "error": "Payment gateway timeout",
  "trace_id": "tr_xyz789"
}
```

핵심 차이점:

| 전통적 로깅 | Wide Event |
|---|---|
| 코드 실행 과정 기록 | 요청의 전체 맥락 기록 |
| 여러 줄의 산발적 로그 | **서비스 홉당 1개 이벤트** |
| 문자열 grep으로 검색 | 구조화 필드로 쿼리 |
| 디버깅 시 로그를 조합해야 함 | 하나의 이벤트에 모든 정보 |

## 핀구의 Wide Event 구현

### AI 서비스 (Python) — 구조화 JSON 로깅

```mermaid
flowchart TB
    subgraph "요청 라이프사이클"
        Start[요청 시작] --> Ctx[컨텍스트 빌드<br/>thread_id, model, user_id]
        Ctx --> Process[에이전트 실행<br/>tool_calls, duration 누적]
        Process --> End[요청 완료]
    end

    End --> Emit[Wide Event 발행]
    Emit --> JSON[JSON 로그 출력]
```

loguru를 사용해 구조화 JSON 로그를 출력합니다.

```python
def _json_sink(message):
    record = message.record
    log_entry = {
        "time": record["time"].isoformat(),
        "level": record["level"].name.lower(),
        "msg": record["message"],
        "service": "fingoo-ai",
        "caller": f"{record['module']}:{record['function']}:{record['line']}"
    }

    # bind()로 주입된 컨텍스트 필드를 플랫하게 펼침
    if record["extra"]:
        log_entry.update(record["extra"])

    # 예외 정보 포함
    if record["exception"]:
        log_entry["exception"] = {
            "type": record["exception"].type.__name__,
            "value": str(record["exception"].value),
            "traceback": format_traceback(record["exception"].tb)
        }

    sys.stdout.write(json.dumps(log_entry) + "\n")
```

`bind()`를 사용해 요청 처리 중 컨텍스트를 누적합니다.

```python
# 요청 시작 시 기본 컨텍스트 바인딩
logger = logger.bind(
    thread_id=thread_id,
    model=model_tier,
    request_id=request_id
)

# 에이전트 실행 후 결과 추가
logger = logger.bind(
    tools_called=tool_names,
    agent_count=len(subagents),
    duration_ms=elapsed
)

# 요청 완료 시 1개의 Wide Event
logger.info("request completed")
```

### 프론트엔드 — 사용자 행동 이벤트

```mermaid
flowchart LR
    subgraph "사용자 이벤트 유형"
        Click[UI 클릭 이벤트<br/>버튼, 메뉴, 설정]
        Chat[채팅 이벤트<br/>질문, 답변, 도구 호출]
        Chart[차트 이벤트<br/>지표 추가/삭제, 예측]
    end

    Click --> Track[이벤트 트래커]
    Chat --> Track
    Chart --> Track

    Track --> API[텔레메트리 API<br/>POST /admin/telemetry]
    API --> Store[(이벤트 저장)]
```

프론트엔드에서도 Wide Event 원칙을 적용합니다. 각 이벤트에 풍부한 속성을 포함합니다.

```typescript
type UserEvent =
  | 'chat.question'           // 채팅 질문
  | 'chat.answer'             // AI 답변
  | 'chat.tool_request'       // 도구 호출 요청
  | 'chat.tool_response'      // 도구 호출 응답
  | 'click_button_forecast.*' // 예측 관련 버튼
  | 'click_button_share';     // 공유 버튼

// 이벤트별 속성
interface ChatQuestionEvent {
  chat_session_id: string;
  content: string;
}

interface ChatAnswerEvent {
  chat_session_id: string;
  content: string;
  loading_time: number;  // ms
}
```

## FluentBit 로그 수집 파이프라인

Docker 컨테이너의 로그를 FluentBit으로 수집하고, 에러/경고를 Discord로 전달합니다.

```mermaid
flowchart TB
    subgraph "Docker 컨테이너"
        API[api 컨테이너<br/>JSON 로그]
        AI[ai 컨테이너<br/>JSON 로그]
        Nginx[nginx 컨테이너<br/>액세스 로그]
        Redis[redis 컨테이너]
    end

    subgraph "FluentBit"
        Input[INPUT: forward<br/>port 24224]
        ErrorFilter[FILTER: rewrite_tag<br/>error|exception|critical → error.*]
        WarnFilter[FILTER: rewrite_tag<br/>warn|warning → warn.*]
        LuaFilter[FILTER: lua<br/>Discord 포맷 변환]
    end

    subgraph "출력"
        Stdout[OUTPUT: stdout<br/>모든 로그]
        Discord[OUTPUT: http<br/>Discord Webhook<br/>error.* + warn.* 만]
    end

    API -->|fluentd driver| Input
    AI -->|fluentd driver| Input
    Nginx -->|fluentd driver| Input
    Redis -->|fluentd driver| Input

    Input --> ErrorFilter --> LuaFilter --> Discord
    Input --> WarnFilter --> LuaFilter
    Input --> Stdout
```

### FluentBit 설정

모든 컨테이너가 Docker의 fluentd 로깅 드라이버로 FluentBit에 로그를 전송합니다.

```
[INPUT]
  Name     forward
  Listen   0.0.0.0
  Port     24224

[FILTER]
  Name     rewrite_tag
  Match    docker.*
  Rule     $log "(?i)(error|exception|traceback|critical|fatal)" error.$TAG true

[FILTER]
  Name     rewrite_tag
  Match    docker.api|docker.ai
  Rule     $log "(?i)(warn|warning)" warn.$TAG true
```

`rewrite_tag` 필터로 에러 키워드가 포함된 로그에 `error.` 태그를 붙이고, 경고 키워드에는 `warn.` 태그를 붙입니다. 이 태그로 Discord 전송 대상을 필터링합니다.

## Discord 웹훅 알림

```mermaid
flowchart TB
    Log[에러/경고 로그] --> Lua[discord.lua<br/>Lua 필터]

    Lua --> RateCheck{Rate Limit 체크<br/>25/분}
    RateCheck -->|허용| Format[Discord Embed 포맷]
    RateCheck -->|초과| Drop[드랍]

    Format --> Color{서비스별 색상}
    Color -->|api| Blue["🔵 Blue (3447003)"]
    Color -->|ai| Purple["🟣 Purple (10181046)"]
    Color -->|web| Green["🟢 Green (3066993)"]
    Color -->|nginx| Gold["🟡 Gold (15844367)"]
    Color -->|redis| Red["🔴 Red (15158332)"]

    Blue --> Send[Discord Webhook 전송]
    Purple --> Send
    Green --> Send
    Gold --> Send
    Red --> Send
```

### Rate Limiting

Discord API는 30 req/min 제한이 있습니다. 에러가 폭주하면 웹훅이 차단될 수 있으므로, Lua 스크립트에서 자체 rate limiting을 구현합니다.

```lua
local RATE_LIMIT = 25         -- 마진 포함 (Discord 제한: 30)
local WINDOW_SECONDS = 60

-- 슬라이딩 윈도우 rate limiting
local function is_rate_limited()
    local now = os.time()
    -- WINDOW_SECONDS 이전 기록 제거
    -- 현재 윈도우 내 카운트가 RATE_LIMIT 이상이면 제한
end
```

### 서비스별 색상 코딩

Discord Embed에 서비스별 색상을 적용해 어떤 서비스에서 문제가 발생했는지 한눈에 파악할 수 있습니다.

```lua
local service_colors = {
    ["api"]   = 3447003,   -- Blue
    ["ai"]    = 10181046,  -- Purple
    ["web"]   = 3066993,   -- Green
    ["nginx"] = 15844367,  -- Gold
    ["redis"] = 15158332,  -- Red
}
```

### 로그 메시지 처리

```lua
function cb_discord(tag, timestamp, record)
    local service = extract_service(tag)  -- "error.docker.api" → "api"
    local severity = tag:match("^error") and "ERROR" or "WARN"
    local log_text = record["log"] or ""

    -- Discord embed 제한: 4096자, 3500에서 잘라서 안전 마진
    if #log_text > 3500 then
        log_text = log_text:sub(1, 3500) .. "\n... (truncated)"
    end

    -- Discord Embed 구성
    return 1, timestamp, {
        payload = json.encode({
            embeds = {{
                title = severity .. " - " .. service,
                description = "```\n" .. log_text .. "\n```",
                color = service_colors[service],
                timestamp = os.date("!%Y-%m-%dT%H:%M:%SZ", timestamp),
                footer = { text = "Fingoo Log Monitor" }
            }}
        })
    }
end
```

## 핵심 인사이트

- **서비스 홉당 1개 이벤트**: 10줄의 로그보다 50개 필드를 가진 1개의 Wide Event가 디버깅에 훨씬 효과적
- **High Cardinality 필드가 핵심**: user_id, trace_id, thread_id 같은 고유값 필드가 있어야 특정 요청을 정확히 추적 가능
- **Rate Limiting은 필수**: 에러 폭주 시 Discord 웹훅이 차단되면 알림 자체를 받을 수 없음. 자체 rate limiting으로 보호
- **색상 코딩 = 인지 부하 감소**: Discord 채널에서 Embed 색상만 보고도 어떤 서비스 문제인지 즉시 파악
- **fluentd 드라이버 + FluentBit**: 애플리케이션 코드 변경 없이 Docker 레벨에서 로그를 수집하는 것이 가장 침습성이 낮은 방법

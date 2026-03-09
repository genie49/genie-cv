# 경제 데이터 RAG — 크롤링에서 웹 검색 보완까지

핀구의 AI가 최신 경제 정보를 기반으로 답변하기 위한 2단계 RAG(Retrieval-Augmented Generation) 파이프라인을 정리합니다. 경제 이슈 크롤링 → pgvector 벡터 검색 → 불충분 시 Tavily 웹 검색으로 보완하는 구조입니다.

## 왜 RAG가 필요한가

LLM의 학습 데이터에는 시점 제한이 있습니다. "오늘 삼성전자 주가가 얼마야?", "최근 미국 금리 인상 전망은?" 같은 질문에는 실시간 데이터가 필요합니다. RAG로 외부 지식을 주입하면 LLM의 지식 한계를 넘어설 수 있습니다.

하지만 단순 RAG에는 한계가 있습니다. 벡터 DB에 관련 데이터가 없으면 "모르겠습니다"가 됩니다. 핀구는 이를 **2단계 파이프라인**으로 해결합니다.

## 2단계 검색 파이프라인

```mermaid
flowchart TB
    Query[사용자 질문] --> KB[1단계: Knowledge Base 검색<br/>pgvector 벡터 검색]
    KB --> Results[상위 5개 결과]
    Results --> Judge[LLM 판정<br/>결과가 질문에 충분한가?]

    Judge -->|충분함| Return[KB 결과 반환<br/>+ 인용 생성]
    Judge -->|불충분| Web[2단계: Tavily 웹 검색<br/>finance 토픽, 5개 결과]
    Web --> Merge[KB + 웹 결과 병합]
    Merge --> ReturnAll[통합 결과 반환<br/>+ 인용 생성]

    style Judge fill:#fef3c7,stroke:#d97706
    style Web fill:#dbeafe,stroke:#2563eb
```

### 1단계: Knowledge Base 검색

pgvector를 사용한 벡터 유사도 검색입니다. 크롤링된 경제 데이터, 기업 분석 리포트, 뉴스 요약 등이 임베딩되어 저장되어 있습니다.

```python
# EmbeddingsRepository — pgvector 검색
results = await embeddings_repo.search(
    query=user_query,
    top_k=5
)
```

### 관련성 판정 — LLM 기반 게이트

검색 결과가 질문에 실제로 관련되는지 Gemini 모델로 판정합니다. 이 판정이 핵심입니다 — 관련 없는 결과를 무작정 LLM에 넣으면 hallucination이 발생합니다.

```python
class IsRelevant(BaseModel):
    is_relevant: bool
    reason: str

agent = create_agent(
    model=gemini_model,
    response_format=IsRelevant,
    system_prompt="검색 결과가 사용자 질문에 충분히 답할 수 있는지 판단하세요"
)
```

```mermaid
flowchart LR
    Results[검색 결과 5개] --> LLM[Gemini 판정]
    LLM --> Decision{is_relevant?}
    Decision -->|True + 결과 있음| Use[결과 사용]
    Decision -->|False| Fallback[웹 검색 폴백]
    Decision -->|True + 결과 없음| Fallback
```

### 2단계: Tavily 웹 검색 폴백

KB에 충분한 데이터가 없으면 Tavily API로 실시간 웹 검색을 수행합니다.

```python
tavily_tool = TavilySearch(
    api_key=settings.TAVILY_API_KEY,
    max_results=5,
    topic="finance",           # 금융 특화 검색
    include_raw_content=True   # 원본 내용 포함
)
```

`topic="finance"`로 금융 도메인에 특화된 검색 결과를 받습니다. `include_raw_content=True`로 스니펫이 아닌 원본 내용을 가져와, LLM이 더 정확한 분석을 할 수 있게 합니다.

## 경제 데이터 크롤링

RAG의 Knowledge Base를 채우기 위해 여러 소스에서 경제 데이터를 수집합니다.

```mermaid
flowchart TB
    subgraph "크롤링 소스"
        Hankyung[한경 글로벌마켓<br/>BeautifulSoup 스크래핑]
        YFinance[yfinance API<br/>주가 · 재무 · 배당]
        DART[DART API<br/>한국 기업 공시]
        FRED[FRED API<br/>미국 경제 지표]
    end

    subgraph "수집 데이터"
        Hankyung --> Tech[Tech/소프트웨어 종목]
        Hankyung --> Semi[반도체/전기전자 종목]
        Hankyung --> Health[헬스케어/의료 종목]
        Hankyung --> Index[S&P 500 · Nasdaq 100]

        YFinance --> KOSPI[KOSPI 시총 상위 15]
        YFinance --> KOSDAQ[KOSDAQ 시총 상위 15]
        YFinance --> Earnings[실적 · 배당 · 애널리스트]

        DART --> FinStmt[재무제표]
        DART --> Dividend[배당 정보]
        DART --> Buyback[자사주 매입]
    end

    subgraph "저장"
        Tech --> Embed[Gemini Embedding]
        Semi --> Embed
        Health --> Embed
        Index --> Embed
        KOSPI --> Embed
        KOSDAQ --> Embed
        Embed --> PG[(pgvector<br/>PostgreSQL)]
    end
```

### 한경 글로벌마켓 크롤링

BeautifulSoup으로 HTML 테이블을 파싱해 시장 데이터를 추출합니다.

```python
def get_hankyung_global_market_data(url: str, count: int):
    response = requests.get(url)
    soup = BeautifulSoup(html, 'html.parser')
    table = soup.select_one("#container > div > div > table")

    # 추출: symbol, price, change_percent, volume, market_cap
    stocks = []
    for row in table.select("tr"):
        stocks.append(QuoteStockData(
            symbol=row.select_one(".name").text,
            price=parse_float(row.select_one(".price").text),
            change_percent=parse_percent(row.select_one(".change").text),
            # ...
        ))
    return stocks[:count]
```

### yfinance 한국 시장 데이터

yfinance의 `EquityQuery`와 `Screener`를 사용해 KOSPI/KOSDAQ 시총 상위 종목을 조회합니다.

```python
def get_kospi(self) -> list[QuoteStockData]:
    query = EquityQuery("eq", ["exchange", "KSC"])  # KOSPI
    screener = Screener()
    screener.set_default_body(query, sortField="intradaymarketcap")
    return self._parse_screener(screener.response, count=15)
```

## 인용(Citation) 생성

검색 결과를 LLM에 전달할 때, `GroundingMiddleware`가 인용 ID를 생성해 출처 추적을 가능하게 합니다.

```mermaid
flowchart LR
    Search[검색 결과] --> MW[GroundingMiddleware]
    MW --> Salt[CRC32 기반 salt 생성<br/>tool_call_id에서 추출]
    Salt --> ID[인용 ID 생성<br/>src_{salt}_{index}<br/>base36 인코딩]
    ID --> Inject[시스템 프롬프트에<br/>cite_sources 주입]
    Inject --> LLM[LLM이 인용 형식으로 응답<br/>cite_start...cite_end]
```

```python
class Citation(TypedDict):
    id: str       # "src_a1b_1" (CRC32 salt + index)
    title: str    # "삼성전자 2025년 1분기 실적"
    url: str      # 원본 URL
    content: str  # 검색 결과 스니펫
```

## 에러 처리와 Rate Limiting

외부 API는 언제든 실패할 수 있습니다. 특히 Tavily는 rate limit(429)이 빈번합니다.

```mermaid
flowchart TB
    Search[웹 검색 시도] --> Try{API 호출}
    Try -->|성공| Return[결과 반환]
    Try -->|429 Rate Limit| Log[rate limit 로깅]
    Try -->|500 서버 에러| Log
    Log --> Fallback{KB 결과 있음?}
    Fallback -->|있음| UseKB[KB 결과만 반환<br/>graceful degradation]
    Fallback -->|없음| NoResult[검색 실패 알림]
```

웹 검색이 실패해도 KB 결과가 있으면 그것만으로 응답합니다. 완벽하지 않더라도 "아무것도 못 찾았습니다"보다는 낫습니다.

## 핵심 인사이트

- **2단계 검색 = 비용 최적화**: 매 질문마다 웹 검색을 하면 비용이 폭발. KB를 먼저 확인하고 필요할 때만 웹 검색하면 API 비용을 80% 이상 절감
- **LLM 게이트가 hallucination을 방지**: 관련 없는 검색 결과를 LLM에 넣으면 오히려 잘못된 답변을 생성. Gemini로 관련성을 사전 판정하는 것이 핵심
- **크롤링 다각화**: 단일 소스에 의존하면 해당 소스 장애 시 전체 서비스에 영향. 한경/yfinance/DART/FRED로 분산
- **인용 = 검증 가능성**: "AI가 말했으니 맞겠지"가 아니라 "이 URL에서 확인할 수 있습니다"를 제공하면 사용자 신뢰가 근본적으로 달라짐

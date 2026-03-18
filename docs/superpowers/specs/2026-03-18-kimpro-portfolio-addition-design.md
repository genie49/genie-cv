# kimpro-agent-service 포트폴리오 추가 — 설계 문서

> **목적**: 토스 AI Engineer (Agent) 포지션 지원을 위해, genie-cv 포트폴리오 사이트에 kimpro-agent-service 프로젝트를 추가한다.
> **방식**: 데이터 + 콘텐츠 + 히어로 컴포넌트를 일괄 추가하고, 임베딩을 재실행한다.
> **공개 범위**: 아키텍처와 설계 의사결정 중심. 실제 코드나 비즈니스 로직은 노출하지 않음. GitHub 링크 없음.

---

## 1. projects.json 엔트리

### 메타데이터

```json
{
  "slug": "kimpro",
  "title": "Aimers — AI 인플루언서 마케팅 자동화 플랫폼",
  "description": "LangChain 멀티에이전트가 인플루언서 마케팅 캠페인의 4단계(기획→브리프→매칭→가이드)를 자동 수행하는 플랫폼. Account Manager가 5개 전문 에이전트를 오케스트레이션하고, GCP Pub/Sub 기반 이벤트 드리븐 마이크로서비스로 안정적인 프로덕션 운영을 지원합니다.",
  "tags": ["LangChain", "Fastify", "GCP Pub/Sub", "WebSocket", "Next.js", "PostgreSQL", "MongoDB", "Redis", "TypeScript", "Docker", "Nginx"],
  "period": "2025.09 ~ 2026.03"
}
```

- 하이라이트 태그 (처음 4개): **LangChain, Fastify, GCP Pub/Sub, WebSocket**
- GitHub/Demo 링크 없음 (회사 프로젝트)

### Features (프로젝트 기여, 6개)

| # | title | description |
|---|---|---|
| 1 | AI 멀티에이전트 캠페인 자동화 | Account Manager + 5개 전문 에이전트가 4단계 마케팅 워크플로우를 자동 수행. Claude 3.5 Sonnet 기반 Tool Calling으로 서브에이전트 라우팅 |
| 2 | 이벤트 드리븐 마이크로서비스 | Auth·API·Chat·Workflow·Tools·Notification·History 7개 서비스를 GCP Pub/Sub 토픽으로 연결하는 분산 아키텍처 |
| 3 | 프로덕션 레벨 Agent 인프라 | PostgreSQL 체크포인팅으로 Agent 대화 영속화, Nginx auth_request 기반 인증 게이트웨이, PM2 graceful shutdown |
| 4 | 실시간 워크플로우 스트리밍 | LangChain 스트리밍 튜플을 WebSocket으로 클라이언트에 전달. messages·updates·tasks 3가지 모드로 실시간 진행 상황 표시 |
| 5 | 캠페인 스냅샷 & 롤백 | Redis 기반 CAS 패턴으로 Agent 실행 중 캠페인 상태를 스냅샷하고, 실패 시 원자적 롤백. 성공 시 MongoDB에 커밋 |
| 6 | LangChain 미들웨어 파이프라인 | Tool Call Patch·Error Status·Dynamic Prompt·TodoList·SubAgent 5개 미들웨어를 조합한 Agent 실행 파이프라인 |

### Notes (개발 노트, 8개)

대화체/후킹 스타일로 작성. 기존 fingoo 노트와 톤 일치.

| id | title | date | tags | summary |
|---|---|---|---|---|
| kimpro-multi-agent | 혼자 다 하는 AI는 없다 — 팀장과 전문가 5명의 협업 구조 | 2025-10-15 | LangChain, Multi-Agent, Orchestration | 하나의 에이전트로는 복잡한 캠페인을 처리할 수 없었다. Account Manager가 상황을 판단하고 5개 전문 에이전트에게 작업을 위임하는 오케스트레이션 구조를 설계한 과정 |
| kimpro-snapshot-rollback | AI가 실수하면 어떡하지? — 되돌릴 수 있게 만들자 | 2025-11-01 | Redis, State Management, Rollback | Agent가 데이터를 잘못 수정하면 복구할 수 없었다. Redis에 스냅샷을 찍고 실패 시 원자적으로 롤백하는 CAS 패턴으로 해결한 과정 |
| kimpro-realtime-streaming | AI가 일하는 동안 사용자는 뭘 보고 있지? | 2025-11-15 | WebSocket, GCP Pub/Sub, Streaming | Agent 워크플로우가 수십 초 걸리는데 사용자는 빈 화면만 봐야 했다. 3가지 스트리밍 모드로 실시간 진행 상황을 전달한 설계 |
| kimpro-marketing-automation | 매번 똑같은 일을 왜 사람이 해야 하지? | 2025-10-01 | Automation, Workflow, Business Impact | 캠페인 기획부터 크리에이터 매칭까지 매번 반복되는 4단계 수동 프로세스를 분석하고, Agent 워크플로우로 전환한 과정과 비즈니스 임팩트 |
| kimpro-middleware-pipeline | 에이전트한테 맥락 없이 일 시키면 당연히 못하지 | 2025-12-01 | LangChain, Middleware, Context Engineering | 매번 같은 시스템 프롬프트로는 상황에 맞는 응답이 안 나왔다. 5개 미들웨어를 조합해 동적으로 컨텍스트를 주입하고 에러를 처리하는 파이프라인 설계 |
| kimpro-event-driven | 서비스 7개가 서로 직접 호출하면 어떻게 될까? | 2025-12-15 | GCP Pub/Sub, Event-Driven, Microservices | 서비스 간 직접 호출이 늘어나면서 장애 전파와 결합도 문제가 생겼다. GCP Pub/Sub로 이벤트 기반 비동기 통신으로 전환한 과정 |
| kimpro-agent-evaluation | 이 에이전트 진짜 잘하고 있는 거 맞아? | 2026-01-15 | Evaluation, Quality, LLM-as-Judge | 프롬프트를 수정할 때마다 다른 곳이 망가졌다. 자동화된 평가 체계를 구축해 품질을 수치로 측정하고 개선하는 루프를 만든 과정 |
| kimpro-prompt-caching | 매번 같은 프롬프트를 보내는데 매번 돈을 내야 해? | 2026-02-01 | Anthropic, Prompt Caching, Cost Optimization | 시스템 프롬프트가 길어지면서 비용과 지연 시간이 급증했다. Anthropic Prompt Caching으로 반복 토큰 비용을 절감한 전략 |

---

## 2. KimproHero 컴포넌트

### 디자인

FingooHero와 동일한 패턴의 SVG 인터랙티브 다이어그램. 횡방향 4단계 서비스 플로우.

- **viewBox**: 640×280 (기존과 동일)
- **좌상단 타이틀**: `AIMERS [ SERVICE_FLOW ]`
- **배경 그라디언트**: `from-slate-50 via-emerald-50/30 to-amber-50/20`
- **하단 텍스트**: `LangChain multi-agent · GCP Pub/Sub · WebSocket streaming`

### 노드 배치

| 노드 | x | y | w | h | label | sub | 색상 |
|---|---|---|---|---|---|---|---|
| 사용자 | 20 | 100 | 75 | 48 | 사용자 | (없음) | violet |
| 데이터 분석 | 125 | 75 | 110 | 50 | 데이터 분석 | URL·PDF → AI 크롤링 | blue |
| 캠페인 구성 | 265 | 75 | 110 | 50 | 캠페인 구성 | AI 대화로 자동 생성 | emerald |
| 크리에이터 매칭 | 405 | 75 | 110 | 50 | 크리에이터 매칭 | AI 주도 컨택 · 계약 | amber |
| 캠페인 모니터링 | 545 | 100 | 75 | 48 | 모니터링 | (없음) | emerald |
| 크롤링 엔진 | 125 | 170 | 110 | 34 | 크롤링 엔진 | (없음) | zinc |
| 크리에이터 DB | 265 | 170 | 110 | 34 | 크리에이터 DB | 특성 분석 | zinc |
| AI 커뮤니케이션 | 405 | 170 | 110 | 34 | AI 커뮤니케이션 | 연락 · 계약 · 대화 | zinc |

### 화살표

**실선 (메인 플로우, 좌→우)**:
- 사용자 → 데이터 분석
- 데이터 분석 → 캠페인 구성
- 캠페인 구성 → 크리에이터 매칭
- 크리에이터 매칭 → 캠페인 모니터링

**점선 (데이터 레이어, 위→아래)**:
- 데이터 분석 → 크롤링 엔진
- 캠페인 구성 → 크리에이터 DB
- 크리에이터 매칭 → AI 커뮤니케이션

### 구현

- `apps/client/src/components/KimproHero.tsx`에 새 파일 생성
- FingooHero의 Node, Arrow 컴포넌트 패턴을 동일하게 사용 (줌/패닝 인터랙션 포함)
- marker id를 `kimpro-arrow`로 분리하여 다른 히어로와 충돌 방지
- `ProjectDetailPage.tsx`에 `project.slug === "kimpro"` 분기 추가

---

## 3. 콘텐츠 파일

### 생성할 파일 목록

```
data/content/projects/kimpro.md              # 프로젝트 상세 설명 (RAG용)
data/content/notes/kimpro-multi-agent.md     # 멀티에이전트 오케스트레이션
data/content/notes/kimpro-snapshot-rollback.md  # 스냅샷 & 롤백
data/content/notes/kimpro-realtime-streaming.md # 실시간 스트리밍
data/content/notes/kimpro-marketing-automation.md # 마케팅 자동화
data/content/notes/kimpro-middleware-pipeline.md  # 미들웨어 파이프라인
data/content/notes/kimpro-event-driven.md    # 이벤트 드리븐 아키텍처
data/content/notes/kimpro-agent-evaluation.md # Agent 평가 체계
data/content/notes/kimpro-prompt-caching.md  # Prompt Caching
data/architectures/projects/kimpro.mmd      # Mermaid 아키텍처 다이어그램
```

### 노트 마크다운 구조

모든 노트는 다음 구조를 따름:

```markdown
# {대화체 제목}

{1-2문장 도입부 — 문제 상황을 생생하게 묘사}

## 배경 / 문제
왜 이 설계가 필요했는가

## 설계 의사결정
어떤 선택지가 있었고, 왜 이걸 골랐는가

## 아키텍처
구조 설명 (Mermaid 다이어그램 포함 가능)

## 결과 / 교훈
어떤 효과가 있었고, 다시 한다면 뭘 바꿀 것인가
```

### 콘텐츠 작성 원칙

1. **코드 비공개**: 실제 코드 스니펫 없음. 의사코드나 다이어그램으로 설명
2. **비즈니스 로직 최소화**: 구체적인 비즈니스 용어보다 기술적 구조와 의사결정에 집중
3. **대화체 톤**: 기존 fingoo 노트와 일관된 스타일 (문제→시행착오→해결 내러티브)
4. **Mermaid 다이어그램 활용**: 각 노트에 아키텍처 다이어그램 포함 가능

---

## 4. 데이터 업데이트

### profile.json techStack 수정

```diff
- "AI/ML": ["LangChain", "RAG", "Gemini", "Grok", "HuggingFace"],
+ "AI/ML": ["LangChain", "RAG", "Gemini", "Grok", "HuggingFace", "Claude"],

- "BACKEND": ["ElysiaJS", "FastAPI", "Node.js", "Bun"],
+ "BACKEND": ["ElysiaJS", "Fastify", "FastAPI", "Node.js", "Bun"],

- "DB/MESSAGE": ["LanceDB", "PostgreSQL", "Redis", "Kafka"],
+ "DB/MESSAGE": ["LanceDB", "PostgreSQL", "MongoDB", "Redis", "GCP Pub/Sub"],
```

### experience.md 보강

`data/content/experience.md`의 아이머스 경력 설명을 kimpro 프로젝트 기술 내용으로 보강하여 RAG가 참조할 수 있도록 함.

---

## 5. 프론트엔드 변경

### ProjectDetailPage.tsx

slug 분기 추가:

```tsx
project.slug === "kimpro" ? (
  <KimproHero className="h-[360px]" interactive />
) : project.slug === "fingoo" ? (
  <FingooHero className="h-[360px]" interactive />
) : ...
```

### KimproHero.tsx import 추가

`ProjectDetailPage.tsx`에 import 추가.

---

## 6. Citation 매핑 및 임베딩

### Citation

기존 동적 매핑 로직이 자동 처리:
- `projects/kimpro.md` → `/projects/kimpro`
- `notes/kimpro-*.md` → `/projects/kimpro/notes/{id}`
- `architectures/projects/kimpro.mmd` → `/projects/kimpro`

추가 코드 수정 불필요.

### 임베딩

`bun run embed` 재실행으로 모든 새 콘텐츠 자동 인덱싱:
- Markdown → H2 기준 chunking → Gemini Embedding → LanceDB
- Mermaid → 단일 청크 → Gemini Embedding → LanceDB

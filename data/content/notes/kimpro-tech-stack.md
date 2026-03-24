# 왜 이 스택인가 — Turborepo + Fastify + GCP Pub/Sub

킴프로의 백엔드는 7개 마이크로서비스(API, Auth, Chat, Notification, Tools, Workflow, Workflow-History)와 11개 공유 패키지로 구성됩니다. 이 규모에서 각 서비스를 별도 레포지토리로 분리하면 어떻게 될까요? 타입 하나 바꾸려면 3개 레포에 PR을 올려야 하고, 공유 패키지 버전 맞추다 오전이 다 갑니다. Turborepo 모노레포로 이 문제를 해결한 과정을 정리합니다.

## 왜 모노레포인가

멀티에이전트 시스템에서 서비스 간 공유되는 것이 많습니다.

| 공유 대상 | 예시 | 영향 범위 |
|---|---|---|
| 타입 정의 | `Campaign`, `CampaignKey`, `AgentNode` | 전체 서비스 |
| 메시징 계약 | `WorkflowRequestEvent`, `Topic` enum | Chat ↔ Workflow ↔ History |
| 데이터 접근 | `CampaignRepository`, `BaseRedisStore` | API, Workflow, Tools |
| 유틸리티 | Fastify 플러그인, 날짜 변환 | 전체 HTTP 서비스 |

타입 하나가 바뀌면 최소 3-4개 서비스에 영향이 갑니다. 멀티레포였다면 각 레포에 패키지를 배포하고, 버전을 올리고, 테스트를 돌려야 합니다. 모노레포에서는 타입을 수정하면 `turbo build`가 의존성 순서대로 전체를 빌드합니다. 깨지는 곳이 있으면 한 번의 CI에서 즉시 알 수 있습니다.

## 레포 구조

```
kimpro-agent-service/
├── kimpro/
│   ├── apps/
│   │   ├── api/           # REST API (Fastify 5)
│   │   ├── auth/          # OAuth 인증 (Fastify 5)
│   │   ├── chat/          # WebSocket 서버 (Fastify 5)
│   │   ├── notification/  # 알림 처리 워커
│   │   ├── tools/         # AI 도구 서버 (Fastify 5)
│   │   ├── workflow/      # LangGraph 에이전트 워커
│   │   └── workflow-history/ # 워크플로우 이력 저장
│   └── frontend/          # Next.js 클라이언트
├── packages/              # 11개 공유 패키지
│   ├── database/          # MongoDB/Redis 접근 계층
│   ├── messaging/         # GCP Pub/Sub 브로커
│   ├── types-shared/      # 프론트·백엔드 공유 타입
│   ├── types-backend/     # 백엔드 전용 타입
│   └── ...
├── turbo.json
└── pnpm-workspace.yaml
```

`pnpm-workspace.yaml`에서 워크스페이스를 선언하고, Turborepo가 `package.json`의 의존성 그래프를 분석하여 빌드 순서를 자동으로 결정합니다. `packages/types-shared` → `packages/database` → `kimpro/apps/workflow` 순서로 빌드되는 식입니다.

## 기술 스택 선택 근거

### Fastify 5

4개 HTTP 서비스(API, Auth, Chat, Tools)에 Fastify 5를 사용합니다. Express가 아닌 이유는 명확합니다.

- **스키마 기반 직렬화**: Fastify의 JSON Schema 기반 직렬화는 `JSON.stringify` 대비 2-3배 빠릅니다. Agent 응답에 큰 JSON이 자주 오가는 상황에서 유의미한 차이
- **플러그인 캡슐화**: 각 플러그인이 독립된 컨텍스트를 가지므로, 서비스별로 필요한 미들웨어만 등록 가능
- **TypeScript 퍼스트**: 제네릭 기반 타입 추론이 내장되어, `@aimers/utils-fastify` 공유 패키지에서 타입 안전한 플러그인 작성 가능

### GCP Pub/Sub

서비스 간 통신에 GCP Pub/Sub를 선택한 이유는 세 가지입니다.

1. **관리형 서비스**: 자체 Kafka/RabbitMQ 클러스터를 운영할 인프라 여력이 없었습니다. GCP Pub/Sub는 프로비저닝 없이 토픽만 만들면 됩니다.
2. **Push/Pull 유연성**: Workflow 서비스는 Pull 구독으로 자체 페이스에 맞게 메시지를 처리하고, Chat 서비스는 인스턴스별 필터링된 구독을 사용합니다.
3. **자동 재시도 + Dead Letter**: 메시지 처리 실패 시 자동 재시도와 Dead Letter 토픽 전달이 내장되어, 별도 재시도 로직 없이 안정적인 메시지 전달 보장

### 3개 데이터 저장소

| 저장소 | 역할 | 선택 이유 |
|---|---|---|
| PostgreSQL | LangGraph 체크포인트 (대화 히스토리) | `@langchain/langgraph-checkpoint-postgres` 공식 지원, 트랜잭션 보장 |
| MongoDB | 캠페인·브랜드스페이스·사용자 데이터 | 캠페인 스키마가 유동적 (섹션 추가/변경 빈번), 유연한 도큐먼트 모델 적합 |
| Redis | 캠페인 스냅샷, 세션, 캐시, 노드 레지스트리 | 워크플로우 실행 중 밀리초 단위 읽기/쓰기 필요, TTL 기반 자동 정리 |

세 저장소의 역할이 명확히 분리됩니다. PostgreSQL은 "복구 가능한 상태", MongoDB는 "비즈니스 데이터", Redis는 "빠르게 접근해야 하는 임시 데이터"를 담당합니다.

## Turborepo 파이프라인

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "cache": true
    },
    "test": {
      "dependsOn": ["^build"],
      "cache": true
    }
  }
}
```

`"dependsOn": ["^build"]`가 핵심입니다. `^` 접두사는 "내 의존성 패키지들의 build가 먼저 완료되어야 한다"는 의미입니다. `@kimpro/workflow`를 빌드하면 Turborepo가 자동으로 `@aimers/types-shared` → `@aimers/database` → `@aimers/messaging` → `@kimpro/workflow` 순서로 빌드합니다.

캐시가 켜져 있으므로, 변경이 없는 패키지는 이전 빌드 결과를 재사용합니다. 11개 패키지 + 7개 앱 전체 빌드에서 실제로 다시 빌드되는 것은 변경된 패키지와 그 하위 의존성뿐입니다.

## 핵심 인사이트

- **타입 공유가 많은 시스템에서 멀티레포는 버전 지옥**: 공유 타입이 10개 넘어가면 패키지 버전 관리만으로 하루가 끝남. 모노레포는 이 비용을 0으로 만듦
- **저장소는 데이터 특성에 맞게 분리**: "전부 PostgreSQL"이나 "전부 MongoDB"가 아니라, 각 데이터의 접근 패턴과 일관성 요구 수준에 맞는 저장소를 선택
- **Turborepo의 의존성 그래프 빌드가 CI 시간을 절반으로**: 변경이 없는 패키지를 건너뛰므로, 전체 빌드 대비 캐시 히트율이 높아 CI 파이프라인 속도가 크게 개선됨

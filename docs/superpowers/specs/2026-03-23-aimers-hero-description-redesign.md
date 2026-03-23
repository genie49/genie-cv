# Aimers Hero 도식도 + Description 재설계

**Date:** 2026-03-23
**Scope:** `KimproHero.tsx` SVG 재설계 + `projects.json` description 교체

## 배경

현재 Aimers(kimpro) 프로젝트의 hero 도식과 description이 프로젝트의 기술적 차별점을 충분히 전달하지 못하고 있음.

- **Hero**: 비즈니스 도메인(브랜드→AI→크리에이터) 중심으로만 표현. 멀티에이전트 오케스트레이션, 마이크로서비스 아키텍처가 보이지 않음.
- **Description**: 기술 키워드 나열. 어떤 문제를 왜 이렇게 해결했는지가 드러나지 않음.
- **타겟 독자**: AI/ML Engineer 채용 담당자

## 변경 파일

| 파일 | 변경 내용 |
|------|----------|
| `apps/client/src/components/KimproHero.tsx` | SVG 전체 재설계 |
| `data/projects.json` | kimpro의 `description` 필드 교체 |

UI 구조(ProjectDetailPage, ProjectCard 등)는 변경하지 않음. features 카드도 현행 유지.

---

## 1. Hero 도식도 재설계

### 방향
계층형 시스템 아키텍처 뷰. 왼쪽에서 오른쪽으로 요청 흐름을 따라가는 구조.

### 레이아웃 (viewBox 640×280)

```
Client → Nginx Gateway → Auth / API / Chat → Workflow Service(Agent) → Tools API
                                                      ↓
                              GCP Pub/Sub Event Bus
                              ↓                    ↓
                        Notification WK    History WK    PostgreSQL  MongoDB  Redis
```

### 컬럼 구성

**Col 1 — Client** (좌측)
- Next.js Client 노드
- 색상: blue

**Col 2 — Nginx Gateway**
- `auth_request` 기반 중앙 인증
- Client에서 받은 요청을 Auth / API / Chat으로 분기
- 색상: zinc

**Col 3 — Services** (Auth, API, Chat)
- Auth: 인증 서비스 (emerald)
- API: REST API (emerald)
- Chat: Socket.IO 기반 실시간 채팅 (blue, 강조)
- Chat → Pub/Sub → Workflow 연결선에 "pub/sub" 라벨

**Col 4 — Workflow Service** (큰 박스, 도식의 중심)
- 전체를 감싸는 큰 박스 (violet 계열, `#faf5ff` fill, `#c4b5fd` stroke)
- 내부 구성:
  - **Account Manager** (Supervisor · LangGraph · Claude/GPT) — 핵심 에이전트 노드, 가장 크고 진한 violet
  - **서브에이전트 4개** — Insight, Campaign, Content, Recruit (작은 흰색 노드, violet border)
  - Account Manager → 서브에이전트 연결선
  - **Middleware Pipeline × 5** — 둥근 바 형태 (연한 violet)
  - **PG Checkpoint** + **Prompt Cache** — zinc 작은 노드
  - **Dynamic Model Selection · LLM Factory** — 최하단 작은 텍스트

**Col 5 — Tools API** (우측 상단)
- Workflow에서 HTTP로 호출하는 관계 (amber 연결선)
- Fastify · 독립 배포 서브라벨
- 전용 도구 6개: 제품 분석, 키워드, 성과 예측, 매칭, 레퍼런스, 크롤링 (2×3 그리드, orange 계열)

**하단 — Pub/Sub + Workers + DB**
- GCP Pub/Sub Event Bus — 가로로 긴 둥근 바 (amber)
- Workers: Notification WK, History WK (zinc)
- DB: PostgreSQL, MongoDB, Redis (emerald)
- Workflow → Pub/Sub 점선 연결

### 기존 패턴 준수 사항
- 다른 hero와 동일한 viewBox `640 × 280`
- `Node`, `Arrow` 컴포넌트 재사용
- Framer Motion `FLOW_DELAY` 기반 순차 애니메이션
- Interactive zoom/pan (마우스 휠, 핀치, 드래그)
- 좌상단 "AIMERS" 타이틀 유지
- 배경: radial dot grid 패턴

### 색상 체계
| 역할 | 색상 | 용도 |
|------|------|------|
| violet | `#ede9fe` / `#c4b5fd` | Workflow, Agent, 서브에이전트 |
| blue | `#dbeafe` / `#93c5fd` | Client, Chat (실시간 통신) |
| emerald | `#d1fae5` / `#6ee7b7` | Auth, API, DB |
| amber | `#fef3c7` / `#fcd34d` | Pub/Sub, Tools API |
| orange | `#fff7ed` / `#fed7aa` | 개별 도구 아이템 |
| zinc | `#f4f4f5` / `#d4d4d8` | Nginx, Workers, 보조 노드 |

---

## 2. Description 교체

### 현재
```
LangChain 멀티에이전트가 인플루언서 마케팅 캠페인의 4단계(기획→브리프→매칭→가이드)를 자동 수행하는 플랫폼. Account Manager가 5개 전문 에이전트를 오케스트레이션하고, GCP Pub/Sub 기반 이벤트 드리븐 마이크로서비스로 안정적인 프로덕션 운영을 지원합니다.
```

### 변경 후
```
인플루언서 마케팅 캠페인 하나를 운영하려면 캠페인 기획, 크리에이터 탐색·컨택, 콘텐츠 가이드 생성, 모니터링, 성과 분석까지 여러 전문가가 몇 주에 걸쳐 반복 작업해야 했습니다.

이 과정을 자동화하기 위해 실제 마케팅 팀의 협업 구조를 모방했습니다. Account Manager가 캠페인 전체를 총괄하고, 상황에 따라 적절한 전문가에게 업무를 위임하듯 — Supervisor 에이전트가 5명의 전문 에이전트(Insight Analyst, Campaign Manager, Content Planner, Recruitment Manager, Contract Manager)에게 작업을 나눠 맡기는 구조를 설계했습니다.

각 에이전트는 사람이 쓰던 도구를 그대로 AI 도구로 옮겼습니다. 제품 URL을 넣으면 자동으로 분석하고, 크리에이터 DB에서 조건에 맞는 후보를 찾고, 과거 캠페인 데이터로 성과를 예측합니다. 사람이 엑셀과 검색엔진을 오가며 하던 일을 에이전트가 전용 도구를 호출해 처리합니다.

그 결과, 캠페인 초기 세팅에 몇 주가 걸리던 프로세스를 한 페이지 안에서 대화만으로 완료할 수 있게 되었습니다. 광고주가 제품 정보와 요구사항만 전달하면 에이전트 팀이 브리프 분석부터 크리에이터 매칭, 콘텐츠 가이드 생성까지 자동으로 처리합니다.
```

### Description 설계 원칙
- 기술 키워드 나열이 아닌 **문제 → 해결 → 임팩트** 구조
- 사업적 맥락에서 왜 이런 시스템을 설계했는지가 드러나는 톤
- AI Engineer 채용 담당자가 "이 사람이 어떤 판단을 했는지" 읽을 수 있도록

---

## 3. UI 표시 고려사항

### ProjectCard (목록 페이지)
- 현재 `line-clamp-2`로 2줄 제한 → description이 길어지므로 카드에서는 첫 문단(문제 제시)만 보임
- 첫 문장이 "인플루언서 마케팅 캠페인 하나를 운영하려면..."으로 시작하여 카드에서도 맥락 전달 가능
- line-clamp 값 조정 필요 여부는 구현 시 확인

### ProjectDetailPage (상세 페이지)
- description을 `<p>` 태그 하나로 표시 중
- 4문단 구조이므로 줄바꿈(`\n\n`)을 반영하도록 렌더링 수정 필요
- 방법: description을 `\n\n`으로 split하여 각각 `<p>` 태그로 감싸기

---

## 4. 변경하지 않는 것

- ProjectDetailPage, ProjectCard 컴포넌트 구조
- features 카드 내용
- notes (개발 노트)
- `data/content/projects/kimpro.md` (AI 챗봇용 상세 콘텐츠)
- 다른 프로젝트의 hero/description

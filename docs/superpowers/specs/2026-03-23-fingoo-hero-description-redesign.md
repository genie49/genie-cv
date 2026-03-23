# Fingoo Hero 도식도 + Description 재설계

**Date:** 2026-03-23
**Scope:** `ProjectHero.tsx` (FingooHero) SVG 재설계 + `projects.json` description 교체

## 배경

Aimers 재설계와 동일한 동기. 현재 Fingoo hero는 비즈니스 도메인(사용자→서비스→데이터) 중심이며, description은 기능 나열. AI Engineer 채용 담당자에게 기술적 차별점이 전달되지 않음.

## 변경 파일

| 파일 | 변경 내용 |
|------|----------|
| `apps/client/src/components/ProjectHero.tsx` | FingooHero SVG 전면 재설계. Node에 `orange` 색상 + `fontSize` prop 추가, Arrow에 `stroke` prop 추가 (Aimers KimproHero에서 적용한 패턴 동일) |
| `data/projects.json` | fingoo의 `description` 필드 교체 (`\n\n`으로 4문단 구분) |

ProjectDetailPage의 멀티 문단 렌더링은 Aimers Task 2에서 이미 구현 완료 (split("\n\n").map 패턴).

---

## 1. Hero 도식도 재설계

### 방향
Aimers와 동일한 계층형 시스템 아키텍처 뷰. 왼쪽에서 오른쪽으로 요청 흐름.

### 레이아웃 (viewBox 640×280)

```
Client → Nginx → NestJS / FastAPI(AI) → AI Agent System → 금융 데이터 / 시황 RAG
                                              ↓
                        Socket.IO Real-time Streaming
                        PostgreSQL  Redis  Docker  AWS  FluentBit
```

### 컬럼 구성

**Col 1 — Client**
- Next.js Client 노드 (blue)

**Col 2 — Nginx**
- Reverse Proxy (zinc)

**Col 3 — Backend Services**
- NestJS (emerald) — 비즈니스 API
- FastAPI AI Service (violet, 강조) — AI 에이전트 호스팅
- FastAPI → Agent System 연결 (WS 라벨)

**Col 4 — AI Agent System** (큰 박스, 도식의 중심)
- 전체를 감싸는 큰 박스 (violet 계열, `#faf5ff` fill, `#c4b5fd` stroke)
- 내부 구성:
  - **Supervisor** (LangChain · Grok/Claude/Gemini) — 핵심 에이전트 노드
  - **서브에이전트 5개 표시** — 시장, 기술, 리서치, 퀀트, 시각화 (실제 7개지만 공간 제약으로 5개 표시, description에서 7명 전체 언급)
  - **81 Tools** + **Middleware × 10** — 둥근 바
  - **Human-in-Loop** + **PG Checkpoint** — zinc 작은 노드
  - **Eval: MockService + 6 Graders** — 최하단 작은 텍스트

**Col 5 — Data Sources** (우측)
- 금융 데이터 (amber) + 하위 도구 4개: DART, FRED, yfinance, Tavily (orange)
- 시황 RAG (emerald) — pgvector + 웹검색

**하단 — 스트리밍 + 인프라**
- Socket.IO Real-time Streaming — 가로 긴 바 (blue)
- DB: PostgreSQL, Redis (emerald)
- 인프라: Docker, AWS, FluentBit (zinc)

### 기존 패턴 준수 사항
- viewBox `640 × 280`
- `Node`, `Arrow` 컴포넌트 재사용. `Node`에 `orange` 색상 + `fontSize` prop 추가, `Arrow`에 optional `stroke` prop 추가 (Aimers KimproHero와 동일한 확장)
- Framer Motion `FLOW_DELAY` 기반 순차 애니메이션
- Interactive zoom/pan
- 좌상단 "FINGOO" 타이틀 유지
- 배경: radial dot grid 패턴

### 노드 밀도
Aimers와 유사한 ~20+ 노드. fontSize prop으로 작은 노드의 가독성 확보. 정확한 좌표는 브라우저 mockup 기준으로 구현 시 조정.

### 색상 체계
Aimers와 동일한 팔레트:
| 역할 | 색상 | 용도 |
|------|------|------|
| violet | `#ede9fe` / `#c4b5fd` | Agent System, Supervisor, 서브에이전트, FastAPI |
| blue | `#dbeafe` / `#93c5fd` | Client, Socket.IO 스트리밍 |
| emerald | `#d1fae5` / `#6ee7b7` | NestJS, 시황 RAG, DB |
| amber | `#fef3c7` / `#fcd34d` | 금융 데이터 |
| orange | `#fff7ed` / `#fed7aa` | 개별 데이터 소스 아이템 |
| zinc | `#f4f4f5` / `#d4d4d8` | Nginx, 인프라, 보조 노드 |

---

## 2. Description 교체

### 현재
```
개인 투자자를 위한 올인원 투자 플랫폼입니다. 실시간 금융 데이터(DART·FRED·Twelve Data·공공데이터)를 기반으로 인터랙티브 차트에서 종목 시세 조회, 비교 분석, 통계 분석을 제공합니다. AI 채팅을 통해 자연어로 투자 분석을 요청하면 차트 시각화, 리포트, 포트폴리오 제안까지 받을 수 있으며, 파일을 업로드해 AI와 함께 분석할 수도 있습니다. 매일 수집되는 경제 시황 데이터와 실시간 웹 검색을 결합해 최신 시장 상황을 반영합니다. 투자 교육 서비스에서는 챕터별 학습과 퀴즈로 투자 기초를 배우고, 출석·XP·랭킹 등 게이미피케이션 요소로 꾸준한 학습을 유도합니다.
```

### 변경 후
```
투자 분석에 필요한 데이터는 DART 공시, 해외 주가, 경제 지표, 뉴스까지 곳곳에 흩어져 있고, 이를 종합하여 판단하는 건 전문가의 영역이었습니다.

흩어진 금융 데이터를 한곳에 집약하고, 전문 분석 도구를 하나의 채팅 인터페이스 안에서 간편하게 제공하는 것이 목표였습니다. Supervisor 에이전트가 7명의 전문 에이전트(시장분석·기술분석·리서치·포트폴리오·퀀트·시각화·지표)를 오케스트레이션하며, 81개의 도구로 데이터 수집부터 차트 생성, 기술적 분석, 성과 예측까지 자동으로 수행합니다. 사용자는 자연어로 요청하기만 하면 에이전트 팀이 데이터를 모으고, 분석하고, 차트로 시각화해줍니다.

분석 도구만으로는 금융에 처음 접근하는 사용자의 진입 장벽을 낮출 수 없었습니다. 투자에 흥미를 갖고 자연스럽게 친해지도록 챕터별 학습 모듈과 퀴즈, 출석·XP·랭킹 등 게이미피케이션 요소를 결합한 투자 교육 시스템을 함께 설계했습니다. 분석 플랫폼과 교육이 하나의 서비스 안에 있기 때문에, 배운 내용을 바로 실제 차트에서 확인하며 학습할 수 있습니다.

궁극적으로, 금융의 진입 장벽을 낮추고 누구나 투자와 자연스럽게 친해질 수 있는 환경을 만드는 것이 핀구의 목표입니다.
```

### Description 설계 원칙
- Aimers와 동일: **문제 → 해결 → 확장(교육) → 비전** 구조
- 사업적 맥락에서 왜 이런 시스템을 설계했는지가 드러나는 톤

---

## 3. UI 표시 고려사항

### ProjectDetailPage
- Aimers Task 2에서 이미 `split("\n\n").map()` 패턴 구현 완료
- 추가 작업 불필요

### ProjectCard
- 첫 문장 "투자 분석에 필요한 데이터는..." 이 카드에서 자연스럽게 읽힘
- line-clamp 조정 필요 여부는 구현 시 확인

---

## 4. 변경하지 않는 것

- ProjectDetailPage, ProjectCard 전체 레이아웃/구조
- features 카드 내용
- notes (개발 노트)
- `data/content/projects/fingoo.md` (AI 챗봇용 상세 콘텐츠)
- 다른 프로젝트의 hero/description

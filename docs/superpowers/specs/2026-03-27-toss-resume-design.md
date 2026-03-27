# 토스 이력서/경력기술서 작성 — 디자인 문서

> 작성일: 2026-03-27
> 목적: 토스 두 포지션(AI Engineer Agent, ML Backend Engineer)에 제출할 이력서+경력기술서 문서 설계

---

## 1. 개요

### 대상 포지션
1. **AI Engineer (Agent)** — 토스 AI Platform 팀
2. **ML Backend Engineer** — 토스뱅크 ML Service Team

### 산출물
- `/Users/genie/Documents/toss-resume/toss-ai-engineer-agent.md` — 포지션 1용
- `/Users/genie/Documents/toss-resume/toss-ml-backend-engineer.md` — 포지션 2용
- 각각 마크다운 작성 후 PDF 변환하여 제출

---

## 2. 문서 구조 (공통)

**형식**: 요약 이력서 (1~1.5p) + 상세 업무기술서 (3p+) 단일 파일

### 2.1 요약 이력서 (1~1.5p)

```
이름 / 이메일 / GitHub / 포트폴리오 URL
한 줄 소개 (포지션 맞춤형)

## 경력
- 회사명 | 직무 | 기간 (한 줄씩, 최신순)

## 기술 스택
- 포지션에 맞게 재배열

## 학력
- 한양대학교 데이터사이언스학과 4학년 재학 (2021~)

## 병역
- 육군 병장 만기전역 (2023.05~2024.10)
```

### 2.2 상세 업무기술서 (3p+)

각 프로젝트별 구성:

```
## [회사명] — [프로젝트명]
기간 | 역할 | 팀 규모

### 프로젝트 개요
한두 문장으로 무엇을 만들었는지

### 문제 정의
왜 이 문제를 풀어야 했는지

### 내가 한 것
- 기술적 의사결정과 그 근거
- 구체적 구현 내용

### 결과
- 정량적 수치 중심
```

---

## 3. 포지션별 설계

### 3.1 포지션 1: AI Engineer (Agent)

**한 줄 소개**: "멀티에이전트 시스템 설계부터 품질 평가 체계까지, AI Agent의 E2E를 구축해온 엔지니어"

**기술 스택 배열 (AI 역량 우선)**:
- AI/Agent: LangChain, LangGraph, RAG, Gemini, Claude, Grok, vLLM
- Backend: FastAPI, Fastify, ElysiaJS, Node.js, Bun
- DB/Vector: PostgreSQL, pgvector, LanceDB, Qdrant, MongoDB, Redis
- Infra: Docker, GCP (Pub/Sub, Cloud Storage), AWS, Modal
- Frontend: React, Next.js, TypeScript

**프로젝트 순서 & 강조점**:

#### 프로젝트 1: Aimers (2025.09~2026.03)
- **강조**: 비즈니스 병목 → 에이전트 워크플로우 전환
- **핵심 서술**:
  - 마케팅팀 수동 프로세스를 분석하여 4단계 Agent 워크플로우로 구조화
  - 에이전트 컨텍스트 엔지니어링: Supervisor 컨텍스트 80~120k → 15~25k 토큰 (~80% 감소)
  - Anthropic Prompt Caching으로 입력 토큰 비용 90% 절감
  - 프로덕션 실패 기반 37개 테스트 태스크로 에이전트 품질 평가 체계 구축
  - 병렬 워크플로우 전환으로 2.5배 속도 개선

#### 프로젝트 2: Fingoo (2024.12~2026.03)
- **강조**: 멀티에이전트 설계 판단, RAG 파이프라인
- **핵심 서술**:
  - Supervisor 패턴 선택 근거 (vs Swarm, Sequential)
  - 2단계 RAG: pgvector 검색 → 컨텍스트 충분성 판단 → Tavily 웹 검색 보완
  - Human-in-the-Loop 차트 제어 패턴
  - Wide Event 기반 관측 시스템 (디버깅 30분→5분)

#### 프로젝트 3: VocaTokTok / Storm Study (2021.02~2023.04, 2025.02~2025.08)
- **강조**: E2E 실행력, 프로덕션 운영
- **핵심 서술**:
  - PHP/Vanilla JS 레거시 → Next.js 풀 리라이트 (655 커밋, 11.5개월)
  - 프로덕션 운영: MAU 150명, 7만 레코드
  - TTS 3단계 캐싱으로 세션당 API 호출 200회 → 최소화
  - EUC-KR → UTF-8 무손실 DB 마이그레이션

### 3.2 포지션 2: ML Backend Engineer

**한 줄 소개**: "AI 시스템의 안정적 서빙을 위한 서버 아키텍처를 설계하고 운영해온 엔지니어"

**기술 스택 배열 (인프라/백엔드 우선)**:
- Backend: FastAPI, Fastify, ElysiaJS, Node.js, Bun
- DB: PostgreSQL, MongoDB, Redis, MySQL
- Infra: Docker, GCP (Pub/Sub, Cloud Storage), AWS (EC2, RDS, S3), Modal
- AI/ML Serving: vLLM, LangChain, RAG, pgvector, Qdrant, LanceDB
- Monitoring: Wide Event Logging, FluentBit
- Frontend: React, Next.js, TypeScript

**프로젝트 순서 & 강조점**:

#### 프로젝트 1: Aimers (2025.09~2026.03)
- **강조**: 서버 아키텍처 설계, MSA
- **핵심 서술**:
  - Chat 단일 서비스 → Chat+Workflow 분리, 부하 분산 설계
  - GCP Pub/Sub 이벤트 드리븐 아키텍처 (7개 마이크로서비스)
  - 다대다 통신 고려한 아키텍처 설계
  - Redis CAS 기반 캠페인 스냅샷/롤백 시스템
  - WebSocket 실시간 스트리밍 파이프라인

#### 프로젝트 2: Fingoo (2024.12~2026.03)
- **강조**: 관측성, 백엔드 아키텍처
- **핵심 서술**:
  - Wide Event 기반 로그 추적 시스템 (디버깅 30분→5분, 6배 단축)
  - NestJS → Fastify 전환 판단과 과정
  - PostgreSQL + pgvector 데이터 파이프라인 설계
  - SSE 스트리밍 기반 실시간 에이전트 응답 전달

#### 프로젝트 3: Bonda (2026, 2~3인 팀)
- **강조**: ML 모델 서빙, GPU 인프라 최적화
- **핵심 서술**:
  - Modal 서버리스 GPU(L40S)에 vLLM 기반 OCR 모델 서빙
  - vLLM 최적화: fp8 KV-cache, GPU 메모리 90% 활용, chunked prefill
  - 5인스턴스 병렬 스케일링, Cold start ~30초
  - 40페이지 추론 ~1분 30초 (페이지당 ~3.1초)
  - 100개 PDF 문서 (문서당 200~300페이지) 처리 파이프라인
  - Qdrant 벡터 DB 3개 컬렉션 구축

#### 프로젝트 4: VocaTokTok / Storm Study (2021.02~2023.04, 2025.02~2025.08)
- **강조**: 프로덕션 운영, DB 설계
- **핵심 서술**:
  - 프로덕션 11.5개월 운영 (MAU 150명, 7만 레코드)
  - Prisma 스키마 63 모델 759줄, 레거시 MySQL 무손실 마이그레이션
  - TTS 3단계 캐싱 아키텍처 (세션당 API 호출 200회 → 최소화)

---

## 4. 작성 원칙

### 토스 맞춤 원칙 (리서치 기반)
1. **기술 스택보다 문제 정의와 구조 선택 이유 우선** — "LangChain 사용"이 아니라 "왜 LangChain을 선택했는가"
2. **모든 성과에 구체적 수치** — %, 건수, 시간, 비용
3. **본인 기여도 명확 분리** — 팀 프로젝트에서 내가 한 것만
4. **글머리 기호로 간결하게** — 줄글 최소화
5. **면접 대비** — 적은 모든 내용에 "왜?", "다른 방법은?", "결과는?"에 답할 수 있어야 함

### 토스 핵심 가치 연결
- **Execution over Perfection**: 빠르게 실행하고 피드백 받는 개발 스타일
- **Question Every Assumption**: 기술 선택 시 근거 기반 판단
- **Focus on Impact**: 임팩트 있는 문제에 집중

---

## 5. 파일 목록

| 파일 | 설명 |
|------|------|
| `toss-ai-engineer-agent.md` | 포지션 1 이력서+경력기술서 |
| `toss-ml-backend-engineer.md` | 포지션 2 이력서+경력기술서 |

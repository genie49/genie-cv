# Aimers — AI 인플루언서 마케팅 자동화 플랫폼

AI 멀티에이전트가 캠페인 기획부터 인플루언서 매칭·콘텐츠 가이드·계약 관리까지 전 과정을 자동화하는 인플루언서 마케팅 플랫폼.

## 프로젝트 개요

광고주가 인플루언서 마케팅 캠페인을 운영할 때 겪는 반복적인 작업(브리프 작성, 인플루언서 탐색, 아웃리치 가이드 생성 등)을 AI로 자동화하는 서비스입니다. LangGraph 기반 멀티에이전트 워크플로우가 4단계(캠페인 생성 → 브리프 분석 → 인플루언서 매칭 → 가이드 생성)를 순차적으로 처리하며, 각 단계에서 사용자와 실시간 스트리밍 채팅으로 상호작용합니다.

Turborepo 모노레포 위에 7개의 마이크로서비스(Auth, API, Chat, Workflow, Tools, Notification Worker, History Worker)를 구성하고, GCP Pub/Sub 이벤트 드리븐 아키텍처로 서비스 간 통신을 처리합니다. Nginx가 API Gateway 역할을 하며 auth_request 기반의 중앙 집중식 인증을 수행합니다.

공유 패키지(@aimers/database, @aimers/messaging, @aimers/types-shared 등)를 통해 서비스 간 코드 재사용을 극대화하고, Fastify 5 기반의 경량 마이크로서비스로 빠른 응답 속도와 독립적 배포를 실현합니다.

## 기술 스택

- **프론트엔드**: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- **백엔드**: Fastify 5 (TypeScript, ESM) — 7개 마이크로서비스
- **AI/ML**: LangChain 1.2 + LangGraph 1.0 — Claude·GPT 멀티 모델
- **데이터베이스**: MongoDB 7 + PostgreSQL 15 + Redis 7
- **메시징**: GCP Pub/Sub (이벤트 드리븐 서비스 통신)
- **인프라**: Docker + Turborepo + Nginx + PM2 + Google Cloud

## 주요 기능

### AI 멀티에이전트 캠페인 자동화

Account Manager를 Supervisor로 두고 5개 서브에이전트(Insight Analyst, Campaign Manager, Content Planner, Recruitment Manager, Contract Manager)를 오케스트레이션합니다. 각 에이전트는 전문 도구(제품 분석, 키워드 스코어링, 성과 예측, 모집 매칭, 레퍼런스 포스트 검색 등)를 활용하여 캠페인 단계별 작업을 수행합니다.

### 이벤트 드리븐 마이크로서비스

Chat 서비스가 사용자 메시지를 수신하면 GCP Pub/Sub를 통해 Workflow 서비스로 전달하고, 워크플로우 완료 이벤트는 Notification Worker와 History Worker가 비동기로 소비합니다. 서비스 간 직접 의존이 없어 독립적인 스케일링과 배포가 가능합니다.

### 실시간 워크플로우 스트리밍

WebSocket(Socket.IO)을 통해 LangGraph 워크플로우의 진행 상황을 실시간으로 클라이언트에 스트리밍합니다. 에이전트의 사고 과정, 도구 호출 결과, 중간 산출물이 단계별로 전달되어 사용자가 캠페인 자동화 과정을 실시간으로 확인할 수 있습니다.

### 캠페인 스냅샷 & 롤백

워크플로우 각 단계 완료 시 캠페인 상태를 스냅샷으로 저장합니다. PostgreSQL 체크포인터로 에이전트 상태를 영속화하여, 특정 단계로 롤백하거나 서버 재시작 후에도 워크플로우를 이어서 진행할 수 있습니다.

### LangChain 미들웨어 파이프라인

5개의 미들웨어(서브에이전트 위임, 동적 시스템 프롬프트, 도구 호출 패치, 도구 에러 상태 처리, TODO 확정)로 에이전트 행동을 제어합니다. 비즈니스 규칙(브리프·콘텐츠·모집·계약·아웃리치·제품)을 선언적으로 정의하여 에이전트 응답 품질을 보장합니다.

### Agent 평가 및 Prompt Caching

LLM Factory를 통해 모델별 Prompt Caching 전략을 적용하고, 동적 모델 선택으로 작업 복잡도에 따라 적절한 LLM을 할당합니다. 시스템 프롬프트와 비즈니스 규칙을 캐싱 가능한 형태로 구조화하여 API 비용을 절감합니다.

외부 도구 서비스(Tools API)를 HTTP로 분리하여 도구 로직의 독립적 배포와 테스트를 지원하며, Bruno API 테스트 스위트로 서비스별 엔드포인트를 검증합니다.

## 담당 영역

창업팀에서 풀스택 개발자로 참여하여 다음을 담당했습니다:

- **AI 에이전트 아키텍처**: Account Manager-SubAgent 오케스트레이션 설계, LangGraph 워크플로우 그래프 구성, 미들웨어 파이프라인
- **마이크로서비스 설계**: 7개 서비스 분리 전략, GCP Pub/Sub 이벤트 드리븐 통신, Nginx API Gateway 인증 흐름
- **실시간 채팅 시스템**: Socket.IO 기반 워크플로우 스트리밍, Chat 서비스 WebSocket 핸들링
- **캠페인 스냅샷 시스템**: PostgreSQL 체크포인터, 워크플로우 상태 영속화 및 롤백
- **모노레포 인프라**: Turborepo 빌드 파이프라인, 공유 패키지(@aimers/*) 설계, Docker 빌드 스크립트
- **환경 관리**: Google Cloud Secret Manager 연동, 환경변수 동기화 CLI 도구
- **비즈니스 규칙 엔진**: 캠페인 단계별 선언적 규칙 정의, 에이전트 응답 품질 검증 로직

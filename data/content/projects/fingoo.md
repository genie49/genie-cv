# 핀구 — AI 투자 분석 플랫폼

AI 대화형 채팅으로 금융 지표 분석·차트 시각화·경제 전망을 제공하는 올인원 투자 분석 플랫폼.

## 프로젝트 개요

개인 투자자를 위한 AI 기반 투자 분석 서비스입니다. LangGraph 멀티 에이전트가 DART 공시, yfinance 해외 주가, Tavily 웹 검색 등 다양한 데이터 소스를 종합하여 실시간 스트리밍 채팅으로 투자 인사이트를 제공합니다. 인터랙티브 금융 차트와 게이미피케이션 기반 투자 교육까지 포함하는 종합 플랫폼입니다.

## 기술 스택

- **프론트엔드**: Next.js 14 + TypeScript + Vercel AI SDK + Socket.io + Zustand
- **AI 서비스**: FastAPI + LangGraph + LangChain (Python) — Grok·Claude·Gemini 멀티 모델
- **백엔드**: NestJS + TypeORM + PostgreSQL + Redis
- **인프라**: Docker + GitHub Actions + AWS EC2 + Nginx + Fluent Bit
- **데이터**: DART API, yfinance, FRED, Tavily, pgvector

## 주요 기능

### AI 대화형 투자 분석
LangGraph Supervisor 패턴으로 7개 전문 에이전트(시장분석·기술분석·리서치·포트폴리오·퀀트·시각화·지표)를 오케스트레이션합니다. 사용자가 자연어로 요청하면 Tool Calling을 통해 차트 생성, 지표 예측, 화면 분할 등 프론트엔드 UI를 직접 조작합니다.

### 인터랙티브 금융 차트
주식·암호화폐·채권·원자재·ETF 등 멀티 에셋을 지원하는 차트 시스템입니다. 풀스크린/2분할/4분할 레이아웃, 다중 Y축, 추세선 그리기, AI 예측 오버레이, CSV 내보내기를 제공합니다. 일간·주간·월간·연간 인터벌과 1Y~MAX 범위를 지원합니다.

### 투자 교육 & 게이미피케이션
4챕터 구조의 단계별 투자 학습 모듈입니다. 학습 → 퀴즈 플로우로 투자 기초를 가르치며, XP·게임 코인·일일 출석·랭킹 시스템으로 학습 동기를 부여합니다.

## 담당 영역

창업팀에서 FE/AI 개발자로 참여하여 AI 채팅 프론트엔드 시스템 전체와 CI/CD 인프라를 담당했습니다.

# 핀구 — AI 투자 분석 플랫폼

Grok·Claude·Gemini 멀티 모델과 LangGraph 멀티 에이전트를 결합한 AI 투자 분석 서비스.

## 프로젝트 개요

실시간 스트리밍 채팅으로 금융 지표 분석, 차트 시각화, 경제 전망을 대화형으로 제공하는 AI 투자 분석 플랫폼입니다. 창업팀에서 FE/AI 개발자로 참여하여 AI 채팅 프론트엔드와 CI/CD 인프라를 담당했습니다.

## 기술 스택

- **프론트엔드**: Next.js + TypeScript + Vercel AI SDK + Socket.io
- **AI 서비스**: FastAPI + LangGraph + LangChain (Python)
- **백엔드**: NestJS + TypeORM + PostgreSQL
- **인프라**: Docker + GitHub Actions + AWS EC2 + Nginx

## 담당 영역

### AI 채팅 프론트엔드
Vercel AI SDK와 Socket.io 기반의 실시간 스트리밍 채팅 시스템을 구현했습니다. LLM의 Tool Calling이 프론트엔드 상태를 직접 변경하는 아키텍처를 설계하여 차트 생성, 화면 분할, 지표 분석 등을 대화형으로 제공합니다.

### CI/CD 파이프라인
GitHub Actions로 3개 파이프라인(PR CI, Dev, Prod)을 구축했습니다. 변경 감지 기반 조건부 빌드, Docker 멀티스테이지 빌드, AWS SSM 시크릿 관리, EC2 자동 배포를 포함합니다.

### 멀티 에이전트 연동
LangGraph 기반 Python AI 서비스의 멀티 에이전트 실행 상태를 프론트엔드에서 실시간으로 추적하고 시각화하는 시스템을 구현했습니다.

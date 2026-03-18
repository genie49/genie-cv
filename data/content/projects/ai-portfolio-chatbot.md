# AI 포트폴리오 챗봇

RAG 기반 AI 챗봇이 탑재된 개인 이력서/포트폴리오 웹사이트.

## 프로젝트 개요

개인 경력, 프로젝트, 기술 스택 정보를 벡터 데이터베이스에 임베딩하고, 방문자의 질문에 LLM이 해당 데이터를 기반으로 답변하는 시스템입니다.

## 기술 스택

- **프론트엔드**: React + Vite + Tailwind CSS + React Router
- **백엔드**: ElysiaJS (Bun 런타임)
- **AI**: LangChain.js + Grok 4.1
- **RAG**: LanceDB + Gemini Embedding
- **배포**: Railway

## 주요 기능

### RAG 기반 AI 챗봇
LanceDB에 사전 임베딩된 마크다운 콘텐츠를 Gemini Embedding으로 벡터 검색하고, Grok 4.1 LLM이 컨텍스트 기반으로 답변합니다. 인용 소스를 프론트엔드 라우트에 매핑하여 관련 페이지로 바로 이동할 수 있습니다.

### SSE 스트리밍 응답
Server-Sent Events를 활용하여 토큰 단위로 실시간 스트리밍 응답을 제공합니다. 사용자가 답변이 생성되는 과정을 실시간으로 확인할 수 있습니다.

### SaaS 대시보드 스타일 UI
고정 사이드바와 카드 기반 레이아웃으로 정보 밀도가 높은 대시보드 스타일 UI를 구현했습니다. Zinc 팔레트 기반의 미니멀한 디자인입니다.

## 아키텍처

프론트엔드(Vite+React)와 백엔드(ElysiaJS)를 완전 분리한 SPA + API 구조입니다. 백엔드는 chat(인터페이스), agent(오케스트레이션), knowledge(RAG) 3개 레이어로 관심사를 분리했습니다.

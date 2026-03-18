# AI 포트폴리오 챗봇

AI 챗봇이 탑재된 개인 이력서/포트폴리오 웹사이트.

## 프로젝트 개요

방문자가 채팅으로 경력, 프로젝트, 기술 스택에 대해 질문하면 실제 데이터를 기반으로 실시간 스트리밍 답변을 제공하는 포트폴리오 사이트입니다. 답변에 포함된 인용을 클릭하면 관련 프로젝트나 개발 노트 페이지로 바로 이동할 수 있습니다. SaaS 대시보드 스타일의 UI로 프로젝트 히어로 다이어그램, 개발 노트, 간트 차트 등 높은 정보 밀도를 제공합니다.

## 기술 스택

- **프론트엔드**: React + Vite + Tailwind CSS + React Router + assistant-ui
- **백엔드**: ElysiaJS (Bun 런타임)
- **AI**: LangChain.js ReAct Agent + Grok 4.1
- **RAG**: LanceDB (파일 기반 벡터 DB) + Gemini Embedding
- **배포**: Railway

## 주요 서비스

### AI 채팅
방문자가 자연어로 질문하면 경력·프로젝트·기술 스택 데이터를 검색하여 실시간 스트리밍으로 답변합니다. "안녕하세요" 같은 인사말에는 불필요한 검색 없이 직접 응답하고, "핀구의 멀티에이전트를 설명해줘" 같은 기술 질문에만 RAG 검색을 수행합니다. 답변에 포함된 인용 번호를 클릭하면 관련 페이지로 바로 이동합니다.

### 프로젝트 포트폴리오
각 프로젝트별로 인터랙티브 SVG 히어로 다이어그램(줌/팬 지원), 프로젝트 기여 카드(가로 스크롤), 개발 노트를 제공합니다. 개발 노트에서는 기술적 의사결정 과정과 트러블슈팅을 Mermaid 다이어그램과 코드 예시로 상세히 기록합니다.

### 이력서 · Q&A
경력, 학력, 기술 스택 정보를 대시보드 형태로 제공하고, 자주 묻는 질문에 대한 사전 작성된 답변을 Q&A 페이지에서 확인할 수 있습니다.

## 아키텍처

프론트엔드(Vite+React)와 백엔드(ElysiaJS)를 완전 분리한 SPA + API 구조입니다. 백엔드는 3개 레이어로 관심사를 분리했습니다:

- **chat**: 인터페이스 레이어 — SSE 스트리밍, Rate Limiting, 에러 분류
- **agent**: 오케스트레이션 레이어 — ReAct 에이전트, 시스템 프롬프트, 도구 호출 판단
- **knowledge**: RAG 레이어 — LanceDB 벡터 검색, Gemini Embedding, 인덱싱

## 기술적 특징

### RAG 파이프라인
LanceDB 파일 기반 벡터 DB로 별도 서버 없이 운영합니다. 마크다운 파일을 H2 헤더 단위로 청킹하여 의미 단위를 보존하고, Gemini Embedding의 taskType 분리(RETRIEVAL_DOCUMENT / RETRIEVAL_QUERY)로 비대칭 임베딩을 적용해 검색 정확도를 높였습니다. Mermaid 다이어그램도 텍스트로 인덱싱하여 아키텍처 관련 질문에 대응합니다.

### SSE 스트리밍
ElysiaJS의 ReadableStream을 활용한 NDJSON 스트리밍입니다. EventSource(GET만 지원)가 아닌 fetch + ReadableStream으로 POST 요청과 커스텀 헤더를 자유롭게 사용합니다. token·citations·error·done 4가지 이벤트 타입으로 구조화된 응답을 제공하며, 인용 변환은 스트리밍 완료 후 1회만 실행하여 깜빡임을 최소화합니다.

### 인용 시스템
RAG 검색 결과의 소스 파일 경로를 내부 라우트로 자동 매핑합니다. `notes/fingoo-agentic-ai.md` → `/projects/fingoo/notes/fingoo-agentic-ai` 같은 변환이 규칙 기반으로 자동 생성되므로, 새 개발 노트를 추가해도 코드 변경 없이 인용 링크가 동작합니다.

### 방어적 운영
IP 기반 Rate Limiting(20/min)으로 퍼블릭 사이트의 악의적 대량 요청을 방어합니다. LLM API 에러를 패턴 매칭으로 분류하여 사용자 친화적 한국어 메시지로 변환합니다.

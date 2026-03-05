# Genie CV - 개인 이력서/포트폴리오 + AI 챗봇 사이트

## 개요

개인 이력서와 포트폴리오를 포함하는 웹사이트. RAG 기반 AI 챗봇이 방문자의 질문에 본인의 경력/프로젝트 데이터를 기반으로 답변한다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| 런타임 | Bun |
| 모노레포 | Bun workspace |
| 프론트엔드 | Vite + React + React Router + Tailwind CSS |
| 백엔드 | ElysiaJS |
| AI | LangChain.js + LangGraph + Grok 4.1 |
| RAG | LanceDB + Gemini Embedding |
| 공유 타입 | packages/shared |
| 배포 | Railway (프론트/백 각각 별도 서비스) |

## 아키텍처: SPA + API 분리

프론트엔드(Vite+React)와 백엔드(ElysiaJS)를 완전히 분리. Railway에서 각각 별도 서비스로 배포. AI 챗은 SSE(Server-Sent Events)로 스트리밍 응답.

## 모노레포 구조

```
genie-cv/
├── packages/
│   ├── client/          # Vite + React + Tailwind
│   ├── server/          # ElysiaJS + LangChain + LanceDB
│   └── shared/          # 공유 타입 (ChatMessage, Citation, Project 등)
├── data/
│   └── content/         # 이력서/프로젝트 MD 파일
├── scripts/
│   └── embed.ts         # Gemini embedding -> LanceDB 저장
├── package.json
└── bunfig.toml
```

## 백엔드 구조

관심사 분리: chat(인터페이스) / agent(오케스트레이션) / knowledge(RAG)

```
packages/server/src/
├── index.ts                    # ElysiaJS 엔트리
├── chat/                       # 채팅 인터페이스 레이어
│   ├── routes/
│   │   └── chat.route.ts       # POST /api/chat (SSE)
│   └── dto/
│       └── chat.dto.ts         # 요청/응답 DTO
├── agent/                      # LangChain 에이전트 오케스트레이션
│   ├── graph.ts                # LangGraph 정의
│   ├── prompts/
│   │   └── system.prompt.ts    # 시스템 프롬프트
│   └── tools/
│       └── rag-search.tool.ts  # RAG 검색 도구
├── knowledge/                  # RAG 레이어
│   ├── retriever.ts            # LanceDB 벡터 검색
│   ├── citations.ts            # 인용 추출 + 프론트 라우트 매핑
│   └── loader.ts               # LanceDB 로드
└── config/
    └── env.ts                  # 환경변수
```

### API

단일 엔드포인트: `POST /api/chat`

- 요청: `{ message: string, history: ChatMessage[] }`
- 응답: SSE 스트리밍
- 마지막에 인용 정보: `{ citations: [{ text, source, route }] }`

### RAG 흐름

1. 사용자 질문 -> Gemini embedding으로 벡터화
2. LanceDB에서 관련 MD 청크 검색
3. 검색된 컨텍스트 + 질문을 Grok 4.1에 전달
4. 스트리밍 응답 + 인용 소스에 프론트 라우트 매핑

## 프론트엔드 구조

```
packages/client/src/
├── main.tsx
├── App.tsx                     # React Router 설정
├── pages/
│   ├── Home.tsx                # 메인 싱글 페이지
│   └── ProjectDetail.tsx       # 프로젝트 상세 페이지
├── sections/                   # 메인 페이지 섹션
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Skills.tsx
│   ├── Experience.tsx
│   ├── Projects.tsx
│   └── Education.tsx
├── components/
│   ├── chat/                   # AI 챗 플로팅 위젯
│   │   ├── ChatWidget.tsx      # 플로팅 버튼 + 패널
│   │   ├── ChatMessage.tsx     # 메시지 버블 (인용 링크 포함)
│   │   └── ChatInput.tsx       # 입력창
│   ├── ui/                     # 공통 UI
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── hooks/
│   └── useChat.ts              # SSE 스트리밍 + 상태 관리
├── styles/
│   └── global.css
└── lib/
    └── api.ts                  # API 클라이언트
```

### 페이지 구성 (하이브리드)

- **메인 (`/`)**: Hero, About, Skills, Experience, Projects, Education 섹션을 하나의 페이지에 나열
- **프로젝트 상세 (`/projects/:slug`)**: 개별 프로젝트 상세 페이지
- **AI 챗**: 전 페이지에 플로팅 위젯으로 표시. 인용 클릭 시 해당 페이지/섹션으로 `react-router` 네비게이션

### 디자인 스타일

- 미니멀/모던
- Tailwind CSS
- Pencil 도구로 상세 UI 디자인 진행 예정

## 임베딩 파이프라인

`scripts/embed.ts`:
1. `data/content/` 내 MD 파일들을 읽어서 청크 분할
2. Gemini Embedding API로 벡터화
3. LanceDB에 저장 (메타데이터: 원본 파일명, 프론트 라우트 매핑 포함)
4. 임베딩된 DB를 `packages/server/db/`에 배치

## 배포

Railway에서 모노레포 기반 두 개 서비스:
- **client**: Vite 빌드 후 정적 파일 서빙
- **server**: ElysiaJS 서버 실행

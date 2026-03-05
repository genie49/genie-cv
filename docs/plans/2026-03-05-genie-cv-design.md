# 김형진 CV - 개인 이력서/포트폴리오 + AI 챗봇 사이트

## 개요

개인 이력서와 포트폴리오를 포함하는 웹사이트. RAG 기반 AI 챗봇이 방문자의 질문에 본인의 경력/프로젝트 데이터를 기반으로 답변한다. SaaS 어드민 대시보드 스타일로, 개발자 방문자가 최소한의 스크롤로 정보를 효율적으로 탐색할 수 있도록 설계.

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
│   └── shared/          # 공유 타입
├── data/
│   ├── projects.json    # 프론트엔드 소스 (프로젝트 메타, 기능, 노트 목록)
│   ├── qna.json         # 프론트엔드 소스 (셀프 Q&A)
│   ├── profile.json     # 프론트엔드 소스 (프로필, 학력, 경력)
│   ├── content/         # RAG 임베딩용 MD 파일
│   └── architectures/   # Mermaid 아키텍처 파일 (RAG + 참조용)
├── scripts/
│   └── embed.ts         # Gemini embedding -> LanceDB 저장
├── design/
│   └── design.pen       # Pencil UI 디자인
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

SaaS 어드민 대시보드 스타일. 고정 사이드바 + 메인 콘텐츠 영역.

```
packages/client/src/
├── main.tsx
├── App.tsx                     # React Router 설정
├── pages/
│   ├── DashboardPage.tsx       # / (About + Tech Stack + Projects 미리보기 + Education/Experience)
│   ├── ProjectsPage.tsx        # /projects (2열 그리드, 인피니티 스크롤)
│   ├── ProjectDetailPage.tsx   # /projects/:slug (상세 + 개발 노트 목록)
│   ├── BlogPostPage.tsx        # /projects/:slug/notes/:id (개발 노트 상세)
│   ├── QnAPage.tsx             # /qna (셀프 Q&A 아코디언)
│   └── ChatPage.tsx            # /chat (AI 챗 전용 페이지)
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx         # 고정 사이드바 (프로필 + 네비 + 링크)
│   ├── chat/
│   │   ├── ChatMessage.tsx     # 메시지 버블 (인용 링크 포함)
│   │   └── ChatInput.tsx       # 입력창
│   ├── dashboard/
│   │   ├── AboutPanel.tsx      # About 패널
│   │   ├── TechStackPanel.tsx  # Tech Stack collapsible 패널
│   │   ├── ProjectCard.tsx     # 프로젝트 미리보기 카드
│   │   ├── EducationPanel.tsx  # Education 패널
│   │   └── ExperiencePanel.tsx # Experience 패널
│   ├── diagrams/               # 커스텀 아키텍처 다이어그램 (프로젝트/노트별)
│   │   ├── projects/           # 프로젝트별 커스텀 React+SVG
│   │   │   ├── AiPortfolioChatbotArch.tsx
│   │   │   └── FinanceDashboardArch.tsx
│   │   └── notes/              # 개발 노트별 커스텀 React+SVG
│   │       ├── RagPipelineArch.tsx
│   │       ├── SseStreamingArch.tsx
│   │       └── LangGraphAgentArch.tsx
│   └── ui/                     # 공통 UI 컴포넌트
├── hooks/
│   └── useChat.ts              # SSE 스트리밍 + 상태 관리
├── styles/
│   └── global.css
└── lib/
    └── api.ts                  # API 클라이언트
```

### 페이지 구성 (SaaS 대시보드)

- **Dashboard (`/`)**: About + Tech Stack (collapsible) + Projects 미리보기 3개 + Education + Experience
- **Projects (`/projects`)**: 2열 그리드 카드, 인피니티 스크롤
- **Project Detail (`/projects/:slug`)**: 프로젝트 상세 + 개발 노트 목록
- **Blog Post (`/projects/:slug/notes/:id`)**: 개발 노트 상세 (마크다운 렌더링)
- **Q&A (`/qna`)**: 셀프 Q&A 아코디언 (자기소개서 대체)
- **AI Chat (`/chat`)**: AI 챗 전용 페이지 (플로팅 위젯이 아닌 독립 페이지)

### 사이드바 네비게이션

고정 사이드바에 다음 항목:
- 프로필 (아바타 + 이름 + 역할)
- About, Projects, Q&A, AI Chat
- 하단: GitHub, Email 링크

### 디자인 스타일

- SaaS 어드민 대시보드 스타일
- 미니멀/모던, 높은 정보 밀도, 최소 스크롤
- 흑백 기반 컬러 (Zinc 팔레트)
- Tailwind CSS
- Pencil 디자인 완료 (design/design.pen)

### Tech Stack Collapsible

- 접힌 상태: AI/ML, BACKEND, DB/MESSAGE 3개 카테고리만 표시
- 열린 상태: + FRONTEND, DEVOPS/INFRA 추가 (5개 전체)

## 임베딩 파이프라인

`scripts/embed.ts`:
1. `data/content/` MD + `data/architectures/` Mermaid + `data/qna.json` (텍스트 변환)을 읽어서 청크 분할
2. Gemini Embedding API로 벡터화
3. LanceDB에 저장 (메타데이터: 원본 파일명, 프론트 라우트 매핑 포함)
4. 임베딩된 DB를 `packages/server/db/`에 배치

### 데이터 관리 전략

**원칙: JSON은 프론트엔드, MD는 RAG**

프론트엔드 렌더링 데이터와 RAG 임베딩 데이터를 분리. JSON은 프론트엔드가 직접 import하여 사용. MD는 RAG 임베딩 파이프라인에서만 사용. Q&A는 `qna.json`을 Single Source of Truth로 관리하고, 임베딩 시 텍스트 변환하여 RAG에 포함 (별도 MD 없음).

```
data/
├── projects.json              # 프론트엔드 소스 (프로젝트 메타, 기능, 개발 노트 목록)
├── qna.json                   # 프론트엔드 소스 (셀프 Q&A 항목들)
├── profile.json               # 프론트엔드 소스 (프로필, 학력, 경력, About)
├── content/                   # RAG 임베딩용 MD 파일
│   ├── about.md               # 자기소개
│   ├── education.md           # 학력 (한양대학교 데이터사이언스학과)
│   ├── experience.md          # 경력/활동
│   ├── projects/              # 프로젝트별 상세 설명
│   │   ├── ai-portfolio-chatbot.md
│   │   ├── finance-dashboard.md
│   │   └── ...
│   └── notes/                 # 개발 노트
│       ├── rag-pipeline.md
│       ├── sse-streaming.md
│       └── langgraph-agent.md
└── architectures/             # Mermaid 아키텍처 파일 (.mmd)
    ├── projects/              # 프로젝트별 대표 아키텍처
    │   ├── ai-portfolio-chatbot.mmd
    │   └── finance-dashboard.mmd
    └── notes/                 # 개발 노트별 아키텍처
        ├── rag-pipeline.mmd
        ├── sse-streaming.mmd
        └── langgraph-agent.mmd
```

### 프로젝트 아키텍처 다이어그램

**Mermaid 파일 (data/architectures/):**
- 프로젝트별 대표 아키텍처 1개 + 개발 노트별 아키텍처 1개
- `.mmd` 파일로 관리 (RAG 임베딩 시 텍스트로 포함)
- 아키텍처 관련 질문에 RAG가 답변 가능

**프론트엔드 UI (커스텀 React+SVG):**
- 각 프로젝트/개발 노트마다 개별 커스텀 컴포넌트 생성
- `components/diagrams/projects/` + `components/diagrams/notes/`
- 실제 기술 로고 SVG 파일 사용 (public/logos/)
- 노드(로고+라벨) + 엣지(화살표+라벨) + 그룹(박스) 렌더링
- Mermaid 파일은 참조용이며, UI는 Mermaid를 불러오지 않고 독립적으로 제작
- Projects 카드 썸네일: 축소 버전 / Detail 히어로: 풀사이즈

## 인용 라우트 매핑

```typescript
const ROUTE_MAP: Record<string, string> = {
  "about.md": "/",
  "education.md": "/",
  "experience.md": "/",
  "qna.json": "/qna",
};
// projects/*.md -> /projects/{slug}
// notes/*.md -> /projects/{projectSlug}/notes/{noteId}
```

## 배포

Railway에서 모노레포 기반 두 개 서비스:
- **client**: Vite 빌드 후 정적 파일 서빙
- **server**: ElysiaJS 서버 실행

## 프로필 정보

- 이름: 김형진
- 역할: AI Engineer
- 이메일: kimgenie0409@gmail.com
- GitHub: github.com/genie49
- 학력: 한양대학교 데이터사이언스학과 4학년 재학중 (2021~)

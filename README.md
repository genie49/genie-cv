# genie-cv

AI 포트폴리오 사이트. 프로필, 프로젝트, 기술 노트, Q&A를 보여주고, RAG 기반 챗봇이 방문자 질문에 답변한다.

> https://genie-cv.com

## 구조

```
apps/
  client/          # React + Vite + TailwindCSS (SPA)
  server/          # Elysia + LangGraph (Bun 런타임)
packages/
  shared/          # 공용 타입
data/
  content/         # 마크다운 콘텐츠 (notes, projects, about, experience, education)
  architectures/   # 프로젝트별 아키텍처 다이어그램 데이터
  *.json           # profile, projects, qna 데이터
scripts/
  embed.ts         # 벡터 임베딩 생성 (Google AI → LanceDB)
  generate-llms.ts # llms.txt + 마크다운 자동 생성
```

## 기술 스택

| 영역 | 스택 |
|------|------|
| Frontend | React 19, Vite, TailwindCSS, React Router, Motion, assistant-ui |
| Backend | Elysia, LangGraph, LangChain, xAI |
| Embedding | Google AI (Gemini), LanceDB |
| Runtime | Bun |
| Shared | TypeScript monorepo (Bun workspaces) |

## 시작하기

```bash
# 의존성 설치
bun install

# 환경 변수 설정
cp .env.example .env
# .env에 GOOGLE_API_KEY 등 설정

# 개발 서버 (client + server 동시)
bun run dev

# 개별 실행
bun run dev:client   # Vite dev server
bun run dev:server   # Elysia server (watch mode)
```

## 스크립트

```bash
bun run embed              # 콘텐츠 벡터 임베딩 생성
bun run build              # 전체 빌드
```

## llms.txt

AI 에이전트를 위한 사이트 요약 파일. 빌드 시 `scripts/generate-llms.ts`가 `data/` 기반으로 자동 생성한다.

- `llms.txt` — 사이트 구조 + 링크 목록
- `llms/*.md` — 각 섹션별 상세 마크다운

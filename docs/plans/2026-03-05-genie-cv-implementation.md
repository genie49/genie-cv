# Genie CV Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Bun 모노레포 기반 개인 이력서/포트폴리오 사이트 + RAG AI 챗봇 구축

**Architecture:** SPA(Vite+React) + API(ElysiaJS) 분리 구조. 백엔드는 chat/agent/knowledge로 관심사 분리. LanceDB에 사전 임베딩된 MD 콘텐츠를 Grok 4.1이 RAG로 답변.

**Tech Stack:** Bun, Vite, React, Tailwind CSS, React Router, ElysiaJS, LangChain.js, LangGraph, LanceDB, Gemini Embedding, Grok 4.1

---

### Task 1: Bun 모노레포 초기 설정

**Files:**
- Create: `package.json`
- Create: `bunfig.toml`
- Create: `packages/shared/package.json`
- Create: `packages/shared/src/index.ts`
- Create: `packages/server/package.json`
- Create: `packages/client/package.json`
- Create: `.gitignore`
- Create: `tsconfig.base.json`

**Step 1: 루트 package.json 생성**

```json
{
  "name": "genie-cv",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "dev:client": "bun --filter client dev",
    "dev:server": "bun --filter server dev",
    "dev": "bun run dev:client & bun run dev:server",
    "build": "bun --filter '*' build",
    "embed": "bun run scripts/embed.ts"
  }
}
```

**Step 2: .gitignore 생성**

```
node_modules/
dist/
.env
.env.local
*.db
*.lance/
```

**Step 3: tsconfig.base.json 생성**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

**Step 4: shared 패키지 초기화**

`packages/shared/package.json`:
```json
{
  "name": "@genie-cv/shared",
  "version": "0.0.1",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit"
  }
}
```

`packages/shared/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
```

`packages/shared/src/index.ts`:
```typescript
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Citation {
  text: string;
  source: string;
  route: string;
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

export interface ChatSSEEvent {
  type: "token" | "citations" | "done" | "error";
  data: string | Citation[] | null;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  period: string;
  thumbnail?: string;
}
```

**Step 5: bun install 실행**

Run: `bun install`

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: initialize bun monorepo with shared types"
```

---

### Task 2: ElysiaJS 서버 초기 설정

**Files:**
- Create: `packages/server/package.json`
- Create: `packages/server/tsconfig.json`
- Create: `packages/server/src/index.ts`
- Create: `packages/server/src/config/env.ts`

**Step 1: server package.json 생성**

```json
{
  "name": "@genie-cv/server",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "build": "bun build src/index.ts --outdir dist --target bun",
    "start": "bun dist/index.js"
  },
  "dependencies": {
    "@genie-cv/shared": "workspace:*",
    "elysia": "latest",
    "@elysiajs/cors": "latest"
  }
}
```

`packages/server/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
```

**Step 2: config/env.ts 생성**

```typescript
export const env = {
  PORT: Number(process.env.PORT) || 3001,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  XAI_API_KEY: process.env.XAI_API_KEY || "",
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
};
```

**Step 3: ElysiaJS 엔트리 생성**

```typescript
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { env } from "./config/env";

const app = new Elysia()
  .use(cors({ origin: env.CORS_ORIGIN }))
  .get("/health", () => ({ status: "ok" }))
  .listen(env.PORT);

console.log(`Server running on http://localhost:${env.PORT}`);

export type App = typeof app;
```

**Step 4: 서버 실행 확인**

Run: `cd packages/server && bun run dev`
Expected: `Server running on http://localhost:3001`

**Step 5: Commit**

```bash
git add packages/server
git commit -m "feat: add ElysiaJS server with health endpoint"
```

---

### Task 3: Vite + React + Tailwind 클라이언트 설정

**Files:**
- Create: `packages/client/package.json`
- Create: `packages/client/tsconfig.json`
- Create: `packages/client/vite.config.ts`
- Create: `packages/client/index.html`
- Create: `packages/client/src/main.tsx`
- Create: `packages/client/src/App.tsx`
- Create: `packages/client/src/styles/global.css`
- Create: `packages/client/tailwind.config.ts`
- Create: `packages/client/postcss.config.js`

**Step 1: client package.json 생성**

```json
{
  "name": "@genie-cv/client",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@genie-cv/shared": "workspace:*",
    "react": "^19",
    "react-dom": "^19",
    "react-router": "^7"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^4",
    "autoprefixer": "^10",
    "postcss": "^8",
    "tailwindcss": "^4",
    "@tailwindcss/vite": "^4",
    "typescript": "^5",
    "vite": "^6"
  }
}
```

**Step 2: Vite + Tailwind 설정 파일 생성**

`packages/client/vite.config.ts`:
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
});
```

`packages/client/src/styles/global.css`:
```css
@import "tailwindcss";
```

**Step 3: React 엔트리 생성**

`packages/client/index.html`:
```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Genie CV</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`packages/client/src/main.tsx`:
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

`packages/client/src/App.tsx`:
```tsx
import { Routes, Route } from "react-router";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path="/projects/:slug" element={<div>Project Detail</div>} />
    </Routes>
  );
}
```

`packages/client/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "outDir": "dist"
  },
  "include": ["src"]
}
```

**Step 4: bun install & 실행 확인**

Run: `bun install && cd packages/client && bun run dev`
Expected: Vite dev server on http://localhost:5173

**Step 5: Commit**

```bash
git add packages/client
git commit -m "feat: add Vite + React + Tailwind client"
```

---

### Task 4: 프론트엔드 레이아웃 + 메인 페이지 섹션

**Files:**
- Create: `packages/client/src/components/layout/Header.tsx`
- Create: `packages/client/src/components/layout/Footer.tsx`
- Create: `packages/client/src/sections/Hero.tsx`
- Create: `packages/client/src/sections/About.tsx`
- Create: `packages/client/src/sections/Skills.tsx`
- Create: `packages/client/src/sections/Experience.tsx`
- Create: `packages/client/src/sections/Projects.tsx`
- Create: `packages/client/src/sections/Education.tsx`
- Create: `packages/client/src/pages/Home.tsx`
- Modify: `packages/client/src/App.tsx`

**Step 1: Header, Footer 레이아웃 생성**

미니멀 스타일. Header는 이름 + 네비게이션 링크(각 섹션 앵커). Footer는 저작권 + 소셜 링크.

**Step 2: 6개 섹션 컴포넌트 생성**

각 섹션은 플레이스홀더 콘텐츠로 시작. 실제 데이터는 나중에 채움.
- Hero: 이름, 한 줄 소개, 프로필 이미지 영역
- About: 자기소개 텍스트
- Skills: 기술 스택 태그/그리드
- Experience: 경력 타임라인
- Projects: 프로젝트 카드 그리드 (클릭 시 `/projects/:slug`로 이동)
- Education: 학력 정보

**Step 3: Home 페이지에 섹션 조합**

**Step 4: App.tsx에 레이아웃 적용**

**Step 5: 브라우저에서 확인**

Run: `cd packages/client && bun run dev`
Expected: 모든 섹션이 순서대로 렌더링

**Step 6: Commit**

```bash
git add packages/client/src
git commit -m "feat: add layout and main page sections"
```

---

### Task 5: 프로젝트 상세 페이지

**Files:**
- Create: `packages/client/src/pages/ProjectDetail.tsx`
- Modify: `packages/client/src/sections/Projects.tsx`

**Step 1: ProjectDetail 페이지 생성**

URL 파라미터 `slug`로 프로젝트 식별. 프로젝트 제목, 기간, 기술 스택 태그, 상세 설명, 스크린샷 영역 포함. 뒤로가기 링크.

**Step 2: Projects 섹션에서 카드 클릭 시 라우팅 연결**

`react-router`의 `Link` 컴포넌트로 `/projects/:slug` 이동.

**Step 3: 브라우저에서 확인**

프로젝트 카드 클릭 → 상세 페이지 이동 → 뒤로가기 동작 확인.

**Step 4: Commit**

```bash
git add packages/client/src
git commit -m "feat: add project detail page with routing"
```

---

### Task 6: 백엔드 knowledge 레이어 (RAG)

**Files:**
- Create: `packages/server/src/knowledge/loader.ts`
- Create: `packages/server/src/knowledge/retriever.ts`
- Create: `packages/server/src/knowledge/citations.ts`

**Step 1: LanceDB 의존성 추가**

`packages/server/package.json`에 추가:
```
"@lancedb/lancedb": "latest"
```

Run: `cd packages/server && bun install`

**Step 2: loader.ts 생성**

LanceDB 테이블 연결. `packages/server/db/` 경로에서 임베딩된 데이터 로드.

```typescript
import * as lancedb from "@lancedb/lancedb";

let db: lancedb.Connection | null = null;

export async function getDb() {
  if (!db) {
    db = await lancedb.connect("./db");
  }
  return db;
}

export async function getContentTable() {
  const database = await getDb();
  return database.openTable("content");
}
```

**Step 3: retriever.ts 생성**

Gemini Embedding으로 쿼리 벡터화 → LanceDB 유사도 검색 → top-k 결과 반환.

```typescript
import { getContentTable } from "./loader";
import { env } from "../config/env";

async function embedQuery(query: string): Promise<number[]> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-exp-03-07:embedContent?key=${env.GOOGLE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: { parts: [{ text: query }] },
        taskType: "RETRIEVAL_QUERY",
      }),
    }
  );
  const data = await response.json();
  return data.embedding.values;
}

export async function retrieve(query: string, topK = 5) {
  const table = await getContentTable();
  const queryVector = await embedQuery(query);
  const results = await table.vectorSearch(queryVector).limit(topK).toArray();
  return results;
}
```

**Step 4: citations.ts 생성**

검색 결과의 메타데이터(source 파일명)를 프론트 라우트로 매핑.

```typescript
import type { Citation } from "@genie-cv/shared";

const ROUTE_MAP: Record<string, string> = {
  "about.md": "/#about",
  "experience.md": "/#experience",
  "skills.md": "/#skills",
  "education.md": "/#education",
};

export function mapCitations(
  results: Array<{ text: string; source: string }>
): Citation[] {
  return results.map((r) => ({
    text: r.text.slice(0, 100),
    source: r.source,
    route:
      ROUTE_MAP[r.source] ||
      `/projects/${r.source.replace(".md", "")}`,
  }));
}
```

**Step 5: Commit**

```bash
git add packages/server/src/knowledge
git commit -m "feat: add knowledge layer with LanceDB retriever and citations"
```

---

### Task 7: 백엔드 agent 레이어 (LangChain + Grok)

**Files:**
- Create: `packages/server/src/agent/graph.ts`
- Create: `packages/server/src/agent/prompts/system.prompt.ts`
- Create: `packages/server/src/agent/tools/rag-search.tool.ts`

**Step 1: LangChain 의존성 추가**

`packages/server/package.json`에 추가:
```
"langchain": "latest",
"@langchain/core": "latest",
"@langchain/langgraph": "latest",
"@langchain/xai": "latest"
```

Run: `cd packages/server && bun install`

**Step 2: system.prompt.ts 생성**

```typescript
export const SYSTEM_PROMPT = `당신은 [이름]의 개인 AI 어시스턴트입니다.
방문자의 질문에 제공된 컨텍스트를 기반으로 답변합니다.

규칙:
- 컨텍스트에 없는 정보는 추측하지 마세요.
- 답변 시 관련 소스를 인용하세요.
- 한국어로 답변하되, 기술 용어는 원문 유지.
- 친절하고 전문적인 톤을 유지하세요.`;
```

**Step 3: rag-search.tool.ts 생성**

LangChain Tool로 래핑. retrieve() 호출 후 결과를 포맷팅.

```typescript
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { retrieve } from "../../knowledge/retriever";

export const ragSearchTool = tool(
  async ({ query }) => {
    const results = await retrieve(query);
    return results
      .map((r, i) => `[${i + 1}] (source: ${r.source})\n${r.text}`)
      .join("\n\n");
  },
  {
    name: "rag_search",
    description: "이력서, 프로젝트, 경력 관련 정보를 검색합니다.",
    schema: z.object({
      query: z.string().describe("검색 쿼리"),
    }),
  }
);
```

**Step 4: graph.ts 생성**

LangGraph로 에이전트 그래프 정의. Grok 4.1 모델 + ragSearchTool 바인딩.

```typescript
import { ChatXAI } from "@langchain/xai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { SYSTEM_PROMPT } from "./prompts/system.prompt";
import { ragSearchTool } from "./tools/rag-search.tool";
import { env } from "../config/env";

const llm = new ChatXAI({
  model: "grok-4.1",
  apiKey: env.XAI_API_KEY,
});

export const agent = createReactAgent({
  llm,
  tools: [ragSearchTool],
  prompt: SYSTEM_PROMPT,
});
```

**Step 5: Commit**

```bash
git add packages/server/src/agent
git commit -m "feat: add LangChain agent with Grok 4.1 and RAG tool"
```

---

### Task 8: 백엔드 chat 레이어 (SSE 라우트)

**Files:**
- Create: `packages/server/src/chat/dto/chat.dto.ts`
- Create: `packages/server/src/chat/routes/chat.route.ts`
- Modify: `packages/server/src/index.ts`

**Step 1: chat.dto.ts 생성**

Elysia 요청 검증용 스키마 정의.

```typescript
import { t } from "elysia";

export const chatRequestSchema = t.Object({
  message: t.String(),
  history: t.Array(
    t.Object({
      role: t.Union([t.Literal("user"), t.Literal("assistant")]),
      content: t.String(),
    })
  ),
});
```

**Step 2: chat.route.ts 생성**

SSE 스트리밍 응답. agent를 호출하고 토큰 단위로 스트리밍. 마지막에 인용 정보 전송.

```typescript
import { Elysia } from "elysia";
import { chatRequestSchema } from "../dto/chat.dto";
import { agent } from "../../agent/graph";
import { mapCitations } from "../../knowledge/citations";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

export const chatRoute = new Elysia({ prefix: "/api" }).post(
  "/chat",
  async function* ({ body }) {
    const messages = body.history.map((m) =>
      m.role === "user"
        ? new HumanMessage(m.content)
        : new AIMessage(m.content)
    );
    messages.push(new HumanMessage(body.message));

    const stream = agent.streamEvents(
      { messages },
      { version: "v2" }
    );

    for await (const event of stream) {
      if (
        event.event === "on_chat_model_stream" &&
        event.data.chunk?.content
      ) {
        yield JSON.stringify({
          type: "token",
          data: event.data.chunk.content,
        }) + "\n";
      }
    }

    yield JSON.stringify({ type: "done", data: null }) + "\n";
  },
  { body: chatRequestSchema }
);
```

**Step 3: index.ts에 chat 라우트 연결**

```typescript
import { chatRoute } from "./chat/routes/chat.route";

const app = new Elysia()
  .use(cors({ origin: env.CORS_ORIGIN }))
  .use(chatRoute)
  .get("/health", () => ({ status: "ok" }))
  .listen(env.PORT);
```

**Step 4: Commit**

```bash
git add packages/server/src
git commit -m "feat: add chat SSE route with streaming response"
```

---

### Task 9: 임베딩 스크립트

**Files:**
- Create: `scripts/embed.ts`
- Create: `data/content/about.md` (샘플)
- Create: `data/content/experience.md` (샘플)

**Step 1: 샘플 MD 콘텐츠 파일 생성**

플레이스홀더 콘텐츠로 `data/content/`에 MD 파일 생성.

**Step 2: embed.ts 생성**

MD 파일 읽기 → 청크 분할 → Gemini Embedding → LanceDB 저장.

```typescript
import * as lancedb from "@lancedb/lancedb";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

const CONTENT_DIR = join(import.meta.dir, "../data/content");
const DB_PATH = join(import.meta.dir, "../packages/server/db");
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;

async function embedText(text: string): Promise<number[]> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-exp-03-07:embedContent?key=${GOOGLE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: { parts: [{ text }] },
        taskType: "RETRIEVAL_DOCUMENT",
      }),
    }
  );
  const data = await res.json();
  return data.embedding.values;
}

function chunkText(text: string, chunkSize = 500): string[] {
  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let current = "";

  for (const p of paragraphs) {
    if ((current + p).length > chunkSize && current) {
      chunks.push(current.trim());
      current = "";
    }
    current += p + "\n\n";
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function main() {
  const files = await readdir(CONTENT_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));

  const records: Array<{
    text: string;
    source: string;
    vector: number[];
  }> = [];

  for (const file of mdFiles) {
    const content = await readFile(join(CONTENT_DIR, file), "utf-8");
    const chunks = chunkText(content);

    for (const chunk of chunks) {
      const vector = await embedText(chunk);
      records.push({ text: chunk, source: file, vector });
    }
    console.log(`Embedded ${file}: ${chunks.length} chunks`);
  }

  const db = await lancedb.connect(DB_PATH);
  await db.createTable("content", records, { mode: "overwrite" });
  console.log(`Saved ${records.length} records to LanceDB`);
}

main();
```

**Step 3: 실행 확인**

Run: `GOOGLE_API_KEY=<key> bun run scripts/embed.ts`
Expected: 각 파일별 청크 수 출력, LanceDB 저장 완료 메시지

**Step 4: Commit**

```bash
git add scripts data/content
git commit -m "feat: add embedding script and sample content"
```

---

### Task 10: 프론트엔드 AI 챗 위젯

**Files:**
- Create: `packages/client/src/lib/api.ts`
- Create: `packages/client/src/hooks/useChat.ts`
- Create: `packages/client/src/components/chat/ChatInput.tsx`
- Create: `packages/client/src/components/chat/ChatMessage.tsx`
- Create: `packages/client/src/components/chat/ChatWidget.tsx`
- Modify: `packages/client/src/App.tsx`

**Step 1: api.ts 생성**

SSE fetch 스트리밍 유틸리티.

```typescript
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function* streamChat(message: string, history: Array<{ role: string; content: string }>) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop()!;
    for (const line of lines) {
      if (line.trim()) yield JSON.parse(line);
    }
  }
}
```

**Step 2: useChat.ts 훅 생성**

메시지 상태 관리, 스트리밍 수신, 인용 데이터 파싱.

**Step 3: ChatInput, ChatMessage, ChatWidget 컴포넌트 생성**

- ChatWidget: 우하단 플로팅 버튼 → 클릭 시 채팅 패널 토글
- ChatMessage: 메시지 버블, 인용 링크 클릭 시 `react-router`로 이동
- ChatInput: 텍스트 입력 + 전송 버튼

**Step 4: App.tsx에 ChatWidget 추가**

Routes 바깥에 ChatWidget 배치 (모든 페이지에 표시).

**Step 5: 브라우저에서 확인**

플로팅 버튼 클릭 → 채팅창 열림 → 메시지 전송 → 스트리밍 응답 확인.

**Step 6: Commit**

```bash
git add packages/client/src
git commit -m "feat: add AI chat floating widget with SSE streaming"
```

---

### Task 11: Pencil 디자인

**Step 1: Pencil 도구로 메인 페이지 UI 디자인**

미니멀/모던 스타일로 다음 화면 디자인:
- 메인 페이지 (Hero ~ Education 섹션)
- 프로젝트 상세 페이지
- AI 챗 위젯 (접힌 상태 / 펼친 상태)

**Step 2: 디자인 검토 및 프론트엔드에 반영**

Pencil 디자인을 기준으로 Tailwind 클래스 적용.

**Step 3: Commit**

```bash
git add packages/client/src
git commit -m "style: apply minimal/modern design from Pencil mockup"
```

---

### Task 12: Railway 배포 설정

**Files:**
- Create: `packages/client/Dockerfile`
- Create: `packages/server/Dockerfile`
- Create: `railway.toml` (또는 각 서비스별 설정)

**Step 1: server Dockerfile 생성**

```dockerfile
FROM oven/bun:latest
WORKDIR /app
COPY package.json bun.lock ./
COPY packages/shared ./packages/shared
COPY packages/server ./packages/server
RUN bun install --frozen-lockfile
COPY packages/server/db ./packages/server/db
EXPOSE 3001
CMD ["bun", "run", "--filter", "server", "start"]
```

**Step 2: client Dockerfile 생성**

Vite 빌드 후 정적 파일을 serve.

```dockerfile
FROM oven/bun:latest AS build
WORKDIR /app
COPY package.json bun.lock ./
COPY packages/shared ./packages/shared
COPY packages/client ./packages/client
RUN bun install --frozen-lockfile
RUN bun run --filter client build

FROM nginx:alpine
COPY --from=build /app/packages/client/dist /usr/share/nginx/html
COPY packages/client/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

**Step 3: nginx.conf 생성 (SPA 라우팅)**

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Step 4: Railway에서 두 서비스 생성 및 배포 확인**

**Step 5: Commit**

```bash
git add Dockerfile* railway.toml packages/client/nginx.conf
git commit -m "chore: add Railway deployment configuration"
```

---

## 태스크 의존성

```
Task 1 (모노레포) → Task 2 (서버) → Task 6 (knowledge) → Task 7 (agent) → Task 8 (chat route)
Task 1 (모노레포) → Task 3 (클라이언트) → Task 4 (레이아웃/섹션) → Task 5 (프로젝트 상세)
Task 1 (모노레포) → Task 9 (임베딩)
Task 4 + Task 8 → Task 10 (챗 위젯)
Task 5 + Task 10 → Task 11 (Pencil 디자인)
Task 11 → Task 12 (배포)
```

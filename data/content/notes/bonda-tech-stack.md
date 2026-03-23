# 왜 Python과 Node.js를 같이 쓰는가

Bonda는 문화재 발굴보고서를 AI로 검색 가능하게 만드는 시스템입니다. 프로젝트 초기에 가장 먼저 결정해야 했던 것은 "하나의 언어로 통일할 것인가, 역할별로 나눌 것인가"였습니다.

## 하이브리드 아키텍처를 선택한 이유

결론부터 말하면, AI 백엔드는 Python(FastAPI), 프론트엔드는 Node.js(Next.js)로 분리했습니다. 모노레포 안에서 `apps/ai`와 `apps/frontend`가 각각 독립된 앱으로 존재합니다.

```
bonda/
├── apps/
│   ├── ai/          # Python · FastAPI · LangChain
│   └── frontend/    # Node.js · Next.js 16 · Drizzle ORM
├── preprocessing/
│   ├── archie-pipeline/   # PDF 크롤링·파싱·벡터화
│   ├── ocr/               # Modal 서버리스 GPU OCR
│   └── clip/              # Modal 서버리스 GPU 이미지 임베딩
└── infrastructure/
    └── docker-compose.yml
```

Python을 선택한 이유는 단순합니다. LangChain, qdrant-client, Google GenAI 같은 AI/ML 라이브러리의 1st-class 지원이 Python에 집중되어 있기 때문입니다. 에이전트의 도구 바인딩, 프롬프트 체이닝, 스트리밍 모두 LangChain Python SDK 기준으로 먼저 나오고, JS SDK는 뒤따라옵니다. 검증되지 않은 JS SDK를 쓰면서 삽질할 시간에, Python으로 안정적으로 구현하는 것이 합리적이었습니다.

반면 프론트엔드는 Next.js가 압도적입니다. App Router, Server Actions, Turbopack 등 프론트엔드 개발 생산성에서 Node.js 생태계를 대체할 수 없었습니다. React 19 + assistant-ui로 채팅 UI를 빠르게 구현할 수 있었던 것도 Node.js 생태계 덕분입니다.

## Qdrant — 벡터 DB 선택

벡터 DB 후보는 Pinecone, Weaviate, Chroma, Qdrant가 있었습니다. Qdrant를 선택한 결정적 이유는 **Named Vector** 기능입니다.

하나의 컬렉션에 여러 벡터를 이름으로 구분해서 저장할 수 있습니다. `archie_reports` 컬렉션에는 `metadata`(1536차원)와 `summary`(1536차원) 두 벡터가 공존합니다. `archie_images`에는 `image`(1024차원, CLIP)와 `description`(1536차원, Gemini) 두 벡터가 있습니다. 검색 시 어떤 벡터를 쿼리할지 선택할 수 있어, "메타데이터로 찾기"와 "요약으로 찾기"를 같은 컬렉션에서 처리합니다.

```python
# 같은 컬렉션, 다른 벡터로 검색
qdrant.query_points(collection_name="archie_reports", query=vector, using="metadata")
qdrant.query_points(collection_name="archie_reports", query=vector, using="summary")
```

Pinecone은 포인트당 벡터 하나만 허용해서 컬렉션을 2배로 늘려야 했고, Chroma는 Named Vector 자체를 지원하지 않습니다. 셀프호스팅이 가능하다는 점도 중요했습니다. docker-compose로 Qdrant를 로컬에 띄워 개발하고, 프로덕션에서는 Qdrant Cloud를 사용합니다.

## Drizzle ORM — Prisma 대신 선택한 이유

프론트엔드의 관계형 데이터(사용자, 채팅 세션 등)는 PostgreSQL + Drizzle ORM으로 관리합니다. Prisma가 아닌 Drizzle을 선택한 이유는 두 가지입니다.

첫째, **SQL에 가까운 API**. Prisma는 자체 쿼리 언어를 학습해야 하지만, Drizzle은 SQL을 그대로 TypeScript로 옮겨놓은 형태입니다. 복잡한 JOIN이나 서브쿼리가 필요할 때 SQL을 아는 사람이면 바로 쓸 수 있습니다.

둘째, **번들 크기와 Cold Start**. Prisma는 Rust로 작성된 Query Engine 바이너리를 포함하여 서버리스 환경(Vercel)에서 Cold Start가 느립니다. Drizzle은 순수 TypeScript라 번들이 가볍고, Vercel Edge Runtime과도 호환됩니다.

```typescript
// drizzle.config.ts — PostgreSQL 연결
export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
});
```

## Docker Compose로 통합

두 언어가 공존하는 만큼, 로컬 개발 환경 통합이 중요합니다. `infrastructure/docker-compose.yml`이 AI 서버, 프론트엔드, Qdrant 세 컨테이너를 한 번에 올립니다.

```yaml
services:
  ai:        # Python FastAPI — 포트 8000
  frontend:  # Next.js — 포트 3000, depends_on: qdrant
  qdrant:    # 벡터 DB — REST 6333, gRPC 6334
```

프론트엔드가 AI 서버를 호출할 때는 `NEXT_PUBLIC_AI_API_URL` 환경변수로 연결합니다. 프론트엔드에서 Qdrant를 직접 조회하는 경우도 있는데(이미지 검색 등), 이때는 `@qdrant/js-client-rest` SDK를 사용합니다.

## 배운 점

- **"최적의 언어"보다 "최적의 생태계"**: 언어를 하나로 통일하면 DX가 좋아질 것 같지만, AI 도구 체인은 Python 생태계가 6개월~1년 앞서 있음. 생산성 차이가 통일의 편의를 압도함
- **Named Vector가 아키텍처를 결정**: 벡터 DB의 기능 하나가 전체 컬렉션 설계를 바꿈. 기술 선택 시 "지금 필요한 기능"뿐 아니라 "데이터 모델에 미치는 영향"까지 고려해야 함
- **Docker Compose는 다국어 모노레포의 접착제**: Python과 Node.js가 공존할 때, 로컬 환경을 일관되게 유지하는 가장 실용적인 방법

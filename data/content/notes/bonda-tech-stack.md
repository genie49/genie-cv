# 왜 이 스택인가 — FastAPI + Next.js + Qdrant

Bonda는 문화재 발굴보고서를 AI로 검색 가능하게 만드는 시스템이다. 프로젝트 초기에 가장 먼저 결정해야 했던 것은 "하나의 언어로 통일할 것인가, 역할별로 나눌 것인가"였다.

## Python과 Node.js를 나눈 이유

AI 백엔드는 Python(FastAPI), 프론트엔드는 Node.js(Next.js)로 분리했다. LangChain, qdrant-client, Google GenAI 같은 AI/ML 라이브러리의 1st-class 지원이 Python에 집중되어 있기 때문이다. 에이전트의 도구 바인딩, 프롬프트 체이닝, 스트리밍 모두 Python SDK 기준으로 먼저 나오고, JS SDK는 뒤따라온다. 검증되지 않은 JS SDK로 삽질할 시간에 Python으로 안정적으로 구현하는 것이 합리적이었다.

반면 프론트엔드는 Next.js가 압도적이다. App Router, Server Actions, Turbopack — React 생태계의 프론트엔드 생산성을 대체할 수 없었다.

## Qdrant를 선택한 결정적 이유

벡터 DB 후보는 Pinecone, Weaviate, Chroma, Qdrant가 있었다. Qdrant를 선택한 결정적 이유는 **Named Vector** 기능이다.

하나의 컬렉션에 여러 벡터를 이름으로 구분해서 저장할 수 있다. 보고서 컬렉션에는 메타데이터 벡터와 요약 벡터가 공존하고, 이미지 컬렉션에는 이미지 벡터와 설명 텍스트 벡터가 공존한다. 검색 시 어떤 벡터를 쿼리할지 선택할 수 있어, 같은 데이터를 다른 관점으로 검색할 수 있다.

Pinecone은 포인트당 벡터 하나만 허용해서 컬렉션을 두 배로 늘려야 했고, Chroma는 Named Vector 자체를 지원하지 않았다. 셀프호스팅이 가능하다는 점도 중요했다. Docker Compose로 로컬에 띄워 개발하고, 프로덕션에서는 Qdrant Cloud를 사용한다.

## Prisma 대신 Drizzle ORM

프론트엔드의 관계형 데이터는 PostgreSQL + Drizzle ORM으로 관리한다. Prisma가 아닌 Drizzle을 선택한 이유는 두 가지다.

첫째, **SQL에 가까운 API**. Prisma는 자체 쿼리 언어를 학습해야 하지만, Drizzle은 SQL을 그대로 TypeScript로 옮겨놓은 형태다. 복잡한 JOIN이나 서브쿼리가 필요할 때 SQL을 아는 사람이면 바로 쓸 수 있다.

둘째, **번들 크기와 Cold Start**. Prisma는 Rust Query Engine 바이너리를 포함해서 서버리스 환경에서 Cold Start가 느리다. Drizzle은 순수 TypeScript라 가볍고 Edge Runtime과도 호환된다.

## 돌이켜보면

**"최적의 언어"보다 "최적의 생태계"**가 기준이었다. 언어를 하나로 통일하면 DX가 좋아질 것 같지만, AI 도구 체인에서 Python 생태계가 6개월~1년 앞서 있다. 이 생산성 차이가 통일의 편의를 압도했다. 그리고 Named Vector 하나가 전체 벡터 DB 선택을 결정했다 — 기술 선택 시 "지금 필요한 기능"뿐 아니라 "데이터 모델에 미치는 영향"까지 고려해야 한다.

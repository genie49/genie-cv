# llms.txt 및 AI 크롤링 최적화 설계

## 목표

AI(ChatGPT, Claude 등)에 사이트 URL(`https://genie-cv.com`)을 주면, AI가 프로필·프로젝트·기술 스택·Q&A를 정확히 파악할 수 있도록 `llms.txt` 기반 구조화된 마크다운을 제공한다.

## 배경

- 현재 사이트는 **React SPA**(Vite + React Router)로, AI가 URL을 방문해도 빈 HTML만 보인다.
- `llms.txt`는 AI가 사이트 콘텐츠를 구조적으로 읽을 수 있게 하는 표준 포맷이다.
- 기존 `data/content/` 에 마크다운 파일들이 이미 존재하므로 활용한다.

## 접근 방식

**빌드 시 자동 생성** — `scripts/generate-llms.ts`가 JSON + 기존 마크다운을 읽어서 `apps/client/public/`에 출력. Vite가 빌드 시 `dist/`로 복사하고 Railway RAILPACK이 정적 서빙한다.

## 생성 파일 구조

```
apps/client/public/
├── llms.txt                          # 목차 (사이트 소개 + 개별 문서 링크)
├── robots.txt                        # 수동 작성 (정적 파일)
└── llms/
    ├── profile.md                    # profile.json → 프로필/기술스택/경력/학력
    ├── projects.md                   # projects.json → 전체 프로젝트 요약
    ├── projects/
    │   ├── kimpro.md                 # JSON 정보 + content/projects/kimpro.md 병합
    │   ├── fingoo.md
    │   ├── bonda.md
    │   ├── vocatoktok.md
    │   ├── hey-bara.md
    │   └── ai-portfolio-chatbot.md
    ├── qna.md                        # qna.json → Q&A 전체
    └── notes/
        └── *.md                      # data/content/notes/*.md 그대로 복사
```

## llms.txt 포맷

```markdown
# 김형진 | AI Engineer

> AI 엔지니어 김형진의 포트폴리오. 프로필, 프로젝트, 기술 노트, Q&A를 담고 있다.

## Profile
- [프로필](https://genie-cv.com/llms/profile.md): 소개, 기술 스택, 경력, 학력

## Projects
- [프로젝트 목록](https://genie-cv.com/llms/projects.md): 전체 프로젝트 요약
- [Kimpro](https://genie-cv.com/llms/projects/kimpro.md): AI 인플루언서 마케팅 자동화
- [Fingoo](https://genie-cv.com/llms/projects/fingoo.md): 주식 투자 결정 보조 AI
- ...

## Q&A
- [Q&A](https://genie-cv.com/llms/qna.md): 자기소개, 개발 스타일, 협업 방식 등

## Technical Notes
- [에이전트 평가 파이프라인](https://genie-cv.com/llms/notes/kimpro-agent-evaluation.md)
- ...
```

## 생성 스크립트: scripts/generate-llms.ts

### 입력
- `data/profile.json`
- `data/projects.json`
- `data/qna.json`
- `data/content/projects/*.md`
- `data/content/notes/*.md`

> `data/content/about.md`, `experience.md`, `education.md`는 사용하지 않는다. `profile.json`에 동일한 구조화된 데이터가 이미 있으므로 JSON을 단일 소스로 사용한다.

### 동작
1. `apps/client/public/llms/` 디렉터리 초기화 (기존 파일 삭제 후 재생성)
2. `profile.json` → `llms/profile.md` 변환 (이름, 역할, about, 기술스택, 경력, 학력)
3. `projects.json` → `llms/projects.md` 요약 + `llms/projects/{slug}.md` 상세 변환
   - 상세 파일은 JSON 정보 + `content/projects/{slug}.md` 내용 병합
   - 관련 노트 링크 목록 포함
4. `qna.json` → `llms/qna.md` 변환
5. `data/content/notes/*.md` → `llms/notes/*.md` 복사 (프로젝트에 연결되지 않은 노트도 포함)
6. 위 모든 파일을 참조하는 `llms.txt` 목차 생성

### 의존성
- Bun 표준 API만 사용 (`fs`, `path`). 외부 패키지 불필요.

### 베이스 URL
- `https://genie-cv.com`을 스크립트 상단 상수로 정의. 변경 시 한 곳만 수정.

### 마크다운 변환 규칙

**profile.md**:
```markdown
# 김형진 | AI Engineer

## 소개
{about 텍스트}

## 기술 스택
### AI/ML
- LangChain, RAG, Gemini, ...
### BACKEND
- ElysiaJS, Fastify, ...
...

## 경력
### {company} — {title} ({period})
{description}
...

## 학력
### 한양대학교 — 데이터사이언스학과
...
```

**projects/{slug}.md**:
```markdown
# {title}

> {description}

- 기간: {period}
- 태그: {tags}

## 주요 기능
- **{feature.title}**: {feature.description}
...

## 상세
{content/projects/{slug}.md 내용}

## 관련 기술 노트
- [{note.title}](https://genie-cv.com/llms/notes/{note.id}.md)
...
```

**qna.md**:
```markdown
# Q&A

## Q: {question}
{answer}

## Q: {question}
{answer}
...
```

## robots.txt (수동 작성)

```
User-agent: *
Allow: /
```

> `Sitemap` 디렉티브는 XML sitemap 전용이므로 사용하지 않는다. AI 크롤러는 well-known 경로(`/llms.txt`)로 자동 탐색한다.

## 빌드 통합

### package.json 수정

```json
// apps/client/package.json
"build:docker": "bun run ../../scripts/generate-llms.ts && vite build"
```

### .gitignore 추가

```
# Generated LLM files
apps/client/public/llms.txt
apps/client/public/llms/
```

## 작업 목록

1. `scripts/generate-llms.ts` 작성
2. `apps/client/public/robots.txt` 작성
3. `apps/client/package.json`의 `build:docker` 스크립트 수정
4. `.gitignore` 업데이트

## 변경하지 않는 것

- nginx.conf — 실배포에서 미사용
- Dockerfile — 실배포에서 미사용
- Railway `railway.toml` — 기존 `buildCommand` 흐름 유지
- 서버 코드 — 정적 파일만으로 해결
- 기존 SPA 코드 — 변경 없음

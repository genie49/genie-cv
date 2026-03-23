# 보카톡톡 포트폴리오 프로젝트 추가 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 영어 단어 학습 플랫폼 보카톡톡을 포트폴리오 사이트에 추가한다.

**Architecture:** 기존 프로젝트 추가 패턴을 따른다. projects.json 등록 → 프로젝트 마크다운 → 기술 노트 4개 → profile.json 업데이트 → 임베딩 재실행.

**Tech Stack:** Markdown, JSON (기존 데이터 구조)

**Spec:** `docs/superpowers/specs/2026-03-19-vocatoktok-portfolio-addition-design.md`

---

## File Structure

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `data/projects.json` | vocatoktok 프로젝트 엔트리 추가 (bonda 뒤, hey-bara 앞) |
| Create | `data/content/projects/vocatoktok.md` | 프로젝트 상세 설명 |
| Create | `data/content/notes/vocatoktok-migration.md` | 기술 노트 1: 레거시 마이그레이션 |
| Create | `data/content/notes/vocatoktok-db-encoding.md` | 기술 노트 2: DB 인코딩 전환 |
| Create | `data/content/notes/vocatoktok-tts-pipeline.md` | 기술 노트 3: TTS 파이프라인 |
| Create | `data/content/notes/vocatoktok-data-encryption.md` | 기술 노트 4: 데이터 암호화 |
| Modify | `data/profile.json` | techStack에 Prisma, MySQL 추가 |

---

### Task 1: projects.json에 vocatoktok 등록

**Files:**
- Modify: `data/projects.json` (bonda 뒤, hey-bara 앞에 삽입)

- [ ] **Step 1: projects.json에 vocatoktok 엔트리 추가**

스펙의 JSON 구조를 그대로 사용. bonda 엔트리 뒤, hey-bara 엔트리 앞에 삽입한다.

- [ ] **Step 2: JSON 유효성 확인**

Run: `cat data/projects.json | python3 -m json.tool > /dev/null`

- [ ] **Step 3: 커밋**

```bash
git add data/projects.json
git commit -m "feat: add vocatoktok project entry to projects.json"
```

---

### Task 2: 프로젝트 설명 마크다운 작성

**Files:**
- Create: `data/content/projects/vocatoktok.md`

- [ ] **Step 1: vocatoktok.md 작성**

보카톡톡 소스 코드(`/Users/genie/temp/dmgo-next`)를 참고하여 작성. 기존 프로젝트(`data/content/projects/bonda.md`)의 톤/깊이를 따른다.

구조:
- `# 보카톡톡` — 인트로
- `## 프로젝트 개요` — PHP 레거시 한계 → Next.js 리빌드
- `## 기술 스택` — 카테고리별
- `## 주요 기능` — 5개 기능 (마이그레이션, DB 인코딩, TTS, 암호화, 학원 관리)
- `## 담당 영역` — 1인 풀스택

- [ ] **Step 2: 커밋**

```bash
git add data/content/projects/vocatoktok.md
git commit -m "feat: add vocatoktok project description markdown"
```

---

### Task 3: 기술 노트 1 — 레거시 마이그레이션

**Files:**
- Create: `data/content/notes/vocatoktok-migration.md`

- [ ] **Step 1: 노트 작성**

소스 코드 참고하여 작성. 구조:
- 도입: PHP+Vanilla JS의 한계
- 왜 Next.js인가: SSR, App Router, TypeScript
- 마이그레이션 전략: 점진적 vs 전면 리빌드 결정
- 코드 비교: PHP → Next.js 변환 예시
- 결과: 개발 생산성, 성능, DX 개선

- [ ] **Step 2: 커밋**

```bash
git add data/content/notes/vocatoktok-migration.md
git commit -m "feat: add vocatoktok legacy migration technical note"
```

---

### Task 4: 기술 노트 2 — DB 인코딩 전환

**Files:**
- Create: `data/content/notes/vocatoktok-db-encoding.md`

- [ ] **Step 1: 노트 작성**

구조:
- 도입: EUC-KR DB에서 한글 깨짐 문제
- 마이그레이션 계획: 구버전 → 신버전 MySQL
- EUC-KR → UTF-8 전환 과정과 함정 (iconv, charset 변환)
- 데이터 검증: 변환 후 무결성 확인
- 배운 점

- [ ] **Step 2: 커밋**

```bash
git add data/content/notes/vocatoktok-db-encoding.md
git commit -m "feat: add vocatoktok DB encoding migration technical note"
```

---

### Task 5: 기술 노트 3 — TTS 파이프라인

**Files:**
- Create: `data/content/notes/vocatoktok-tts-pipeline.md`

- [ ] **Step 1: 노트 작성**

소스 코드(`/Users/genie/temp/dmgo-next/src/modules/client/tts/`)를 참고. 구조:
- 도입: 영어 학습에서 발음의 중요성
- Google Cloud TTS 연동
- 다국어 지원 (언어별 음성 선택)
- RDT/RET 모드별 TTS 파이프라인 설계
- 성능 최적화 (캐싱, 프리로딩 등)

- [ ] **Step 2: 커밋**

```bash
git add data/content/notes/vocatoktok-tts-pipeline.md
git commit -m "feat: add vocatoktok TTS pipeline technical note"
```

---

### Task 6: 기술 노트 4 — 데이터 암호화

**Files:**
- Create: `data/content/notes/vocatoktok-data-encryption.md`

- [ ] **Step 1: 노트 작성**

소스 코드에서 암호화 관련 모듈을 참고. 구조:
- 도입: 학습 콘텐츠 보호 필요성
- 암호화 설계 (어떤 데이터를, 어떤 방식으로)
- 구현 (클라이언트/서버 사이드 처리)
- 성능 영향과 트레이드오프
- 보안 고려 사항

- [ ] **Step 2: 커밋**

```bash
git add data/content/notes/vocatoktok-data-encryption.md
git commit -m "feat: add vocatoktok data encryption technical note"
```

---

### Task 7: profile.json 업데이트

**Files:**
- Modify: `data/profile.json`

- [ ] **Step 1: techStack 업데이트**

- `BACKEND` 배열에 `"Prisma"` 추가
- `DB/MESSAGE` 배열에 `"MySQL"` 추가

- [ ] **Step 2: 커밋**

```bash
git add data/profile.json
git commit -m "feat: add Prisma and MySQL to profile techStack"
```

---

### Task 8: 임베딩 재실행

- [ ] **Step 1: 임베딩 스크립트 실행**

Run: `bun run embed`

- [ ] **Step 2: 결과 확인**

vocatoktok 관련 청크가 포함되었는지 확인.

# 보카톡톡 포트폴리오 프로젝트 추가 설계

## 개요

영어 단어 학습 플랫폼 보카톡톡(dmgo-next)을 포트폴리오 사이트에 추가한다. 풀스택 1인 프로덕션 서비스 실행력, 레거시 마이그레이션, DB 인코딩 전환 경험에 초점을 맞춘다.

## 프로젝트 정보

- **이름**: 보카톡톡 — 영어 단어 학습 플랫폼
- **기간**: 2021.02 ~ 2025.08
- **팀 규모**: 1인 풀스택 (설계·구현·배포·운영)
- **experience 추가**: 하지 않음 (이미 스톰스터디로 등록)

## 데이터 구조

### projects.json 등록

```json
{
  "slug": "vocatoktok",
  "title": "보카톡톡 — 영어 단어 학습 플랫폼",
  "description": "학원용 영어 단어·문장 학습 플랫폼. PHP/Vanilla JS 레거시를 Next.js로 전면 리빌드하고, EUC-KR DB를 UTF-8로 마이그레이션했다. Google Cloud TTS 발음 학습, 학원 관리 시스템, PWA 오프라인 지원을 제공한다.",
  "tags": ["Next.js", "Prisma", "MySQL", "Google TTS", "Zustand", "Vercel AI SDK", "AWS", "PWA"],
  "period": "2021.02 ~ 2025.08",
  "features": [
    { "title": "레거시 → Next.js 마이그레이션", "description": "PHP/Vanilla JS → Next.js 14 App Router 전면 리빌드. TypeScript 전면 도입" },
    { "title": "DB 마이그레이션 + 인코딩 전환", "description": "구버전 MySQL → 신버전 마이그레이션 + EUC-KR → UTF-8 인코딩 전환" },
    { "title": "TTS 발음 학습", "description": "Google Cloud TTS 기반 다국어 발음 학습. RDT/RET 모드별 학습 파이프라인" },
    { "title": "학습 데이터 암호화", "description": "학습 콘텐츠 데이터 암호화로 무단 접근 방지" },
    { "title": "학원 관리 시스템", "description": "학교·반·학생·강사 계층 관리, 권한 기반 접근 제어, 학습 진도 추적" }
  ],
  "notes": [
    {
      "id": "vocatoktok-migration",
      "projectSlug": "vocatoktok",
      "title": "PHP에서 Next.js로, 레거시를 버리는 용기",
      "date": "2025-03-01",
      "tags": ["Next.js", "Migration", "TypeScript", "Legacy"],
      "summary": "PHP/Vanilla JS 레거시를 Next.js 14로 전면 리빌드한 이유, 과정, 결과"
    },
    {
      "id": "vocatoktok-db-encoding",
      "projectSlug": "vocatoktok",
      "title": "EUC-KR 데이터베이스와의 사투",
      "date": "2025-03-15",
      "tags": ["MySQL", "Migration", "EUC-KR", "UTF-8"],
      "summary": "구버전 MySQL DB 마이그레이션과 EUC-KR → UTF-8 인코딩 전환 과정의 함정과 해결"
    },
    {
      "id": "vocatoktok-tts-pipeline",
      "projectSlug": "vocatoktok",
      "title": "원어민 발음을 코드로 만들다",
      "date": "2025-04-01",
      "tags": ["Google TTS", "Pipeline", "Multilingual"],
      "summary": "Google Cloud TTS 기반 다국어 발음 학습 파이프라인과 RDT/RET 모드 설계"
    },
    {
      "id": "vocatoktok-data-encryption",
      "projectSlug": "vocatoktok",
      "title": "학습 데이터를 지키는 방법",
      "date": "2025-04-15",
      "tags": ["Encryption", "Security", "Data Protection"],
      "summary": "학습 콘텐츠 데이터 암호화 설계와 구현"
    }
  ]
}
```

### 프로젝트 순서

aimers → fingoo → bonda → **vocatoktok** → hey-bara → portfolio

## 콘텐츠 파일

### 프로젝트 설명: `data/content/projects/vocatoktok.md`

구조:
- `# 보카톡톡` — 2~3문장 인트로
- `## 프로젝트 개요` — 레거시 한계 → Next.js 리빌드
- `## 기술 스택` — 카테고리별 정리
- `## 주요 기능` — 5개 기능 상세
- `## 담당 영역` — 1인 풀스택

### 기술 노트 4개: `data/content/notes/`

| 파일 | 제목 | 핵심 |
|------|------|------|
| `vocatoktok-migration.md` | PHP에서 Next.js로, 레거시를 버리는 용기 | PHP+Vanilla JS → Next.js 14 전환 이유·과정·결과 |
| `vocatoktok-db-encoding.md` | EUC-KR 데이터베이스와의 사투 | 구버전 DB 마이그레이션 + EUC-KR → UTF-8 전환의 함정 |
| `vocatoktok-tts-pipeline.md` | 원어민 발음을 코드로 만들다 | Google Cloud TTS 다국어 파이프라인, RDT/RET 모드 |
| `vocatoktok-data-encryption.md` | 학습 데이터를 지키는 방법 | 학습 콘텐츠 암호화 설계·구현 |

## profile.json 업데이트

| 카테고리 | 추가 항목 |
|---------|----------|
| BACKEND | Prisma |
| DB/MESSAGE | MySQL |

## 임베딩 재실행

모든 콘텐츠 추가 완료 후 `bun run embed` 실행.

## 변경하지 않는 것

- experience 섹션
- 커스텀 Hero 컴포넌트 (기존 공통 컴포넌트 활용)
- 프론트엔드 라우팅

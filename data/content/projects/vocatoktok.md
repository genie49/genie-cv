# 보카톡톡 — 영어 단어 학습 플랫폼

학원용 영어 단어 학습 플랫폼으로, PHP/Vanilla JS 레거시 시스템을 Next.js 14로 전면 리빌드한 프로젝트입니다. EUC-KR 인코딩의 MySQL DB를 UTF-8로 마이그레이션하고, Google Cloud TTS 기반 발음 학습, AES-256 데이터 암호화, PWA 지원까지 구현하여 실제 학원에서 프로덕션 운영 중입니다. 655커밋에 걸쳐 약 11.5개월간 1인 풀스택으로 설계·구현·배포·운영을 수행했습니다.

## 프로젝트 개요

기존 시스템은 PHP와 Vanilla JS로 구축되어 있었고, MySQL은 EUC-KR 인코딩으로 운영되고 있었습니다. 코드 유지보수가 어렵고, 모바일 대응이 불가능하며, 새로운 학습 기능 추가에 과도한 공수가 드는 상황이었습니다. 이를 해결하기 위해 Next.js 14 기반으로 전면 리빌드를 결정했습니다. 점진적 마이그레이션이 아닌 완전한 재작성(full rewrite) 방식을 택했고, DB 인코딩을 EUC-KR에서 UTF-8로 전환하면서 기존 데이터를 무손실 마이그레이션했습니다.

## 기술 스택

- **프론트엔드**: Next.js 14, React 18, Tailwind CSS, Mantine 7, Framer Motion, Zustand, SWR
- **백엔드**: Next.js API Routes (Route Handlers), Prisma, MySQL (AWS RDS)
- **AI/학습**: Google Cloud TTS, Vercel AI SDK, OpenAI
- **인프라**: Vercel, AWS S3/Lambda, Sentry, PWA (next-pwa)
- **기타**: Socket.IO (실시간 통신), Ably (리얼타임 채널), AG Grid, Recharts, xlsx

## 주요 기능

### 레거시 → Next.js 전면 리빌드

PHP/Vanilla JS로 구성된 기존 시스템을 Next.js 14 App Router 기반으로 완전히 재작성했습니다. 학습자용 앱(study)과 관리자용 앱(admin)을 하나의 Next.js 프로젝트 내에서 라우트 그룹으로 분리하고, Prisma ORM으로 기존 MySQL 스키마를 그대로 활용하면서 타입 안전성을 확보했습니다. `prisma db pull`로 레거시 스키마를 인트로스펙션하여 759줄 규모의 스키마 파일을 자동 생성하고, 이를 기반으로 빌드 파이프라인을 구성했습니다.

### DB 마이그레이션 + EUC-KR → UTF-8 인코딩 전환

레거시 MySQL DB의 EUC-KR 인코딩을 UTF-8로 전환했습니다. `iconv-lite`와 `jschardet`를 활용해 인코딩을 자동 감지하고, 데이터 손실 없이 변환하는 파이프라인을 구축했습니다. 학원 데이터, 회원 정보, 단어 데이터 등 전체 테이블을 대상으로 무손실 마이그레이션을 완료했습니다.

### TTS 발음 학습 파이프라인

Google Cloud Text-to-Speech API를 활용한 발음 학습 시스템을 구현했습니다. 단어(word), 문장(sentence), 다국어(multilingual), 자체 제작 데이터(createData) 등 4개 학습 모듈별로 TTS API 라우트를 분리 구성했습니다. 클라이언트에서는 SWR 기반 커스텀 훅(`useTTS`, `useSpeechTTS`, `useMultilingualTTS` 등)으로 TTS 요청을 캐싱하고, 대량 단어는 10개 단위 청크로 분할해 병렬 요청합니다. 음성 성별(gender)과 언어(lang) 설정을 지원하며, 프리페치 훅으로 학습 시작 전 음성 데이터를 미리 로드합니다.

### 학습 데이터 AES-256 암호화

학원의 핵심 자산인 단어·문장 데이터를 보호하기 위해 AES-256-CBC 암호화를 적용했습니다. 서버 사이드에서 `crypto` 모듈로 암호화/복호화를 처리하고, 클라이언트에 전송되는 학습 데이터는 암호화된 상태로 전달한 뒤 학습 시점에 복호화합니다. 랜덤 IV(Initialization Vector)를 매번 생성하여 동일한 평문도 다른 암호문을 생성하도록 했습니다.

### 학원 관리 시스템

관리자 전용 대시보드에서 학원(academy) 관리, 학생(user) 관리, 학습 데이터(data) 관리, 학습 진도(progress) 추적, 통계(stat) 조회, 권한(permission) 관리를 수행할 수 있습니다. 단어/문장/다국어 데이터를 직접 생성·편집할 수 있으며, 엑셀(xlsx) 파일로 대량 임포트를 지원합니다. 학원 간 데이터 공유(shareCreateData) 기능도 구현했습니다. AG Grid 기반 테이블과 Recharts 기반 차트로 학습 현황을 시각화합니다.

## 담당 영역

1인 풀스택으로 설계·구현·배포·운영 전체를 담당했습니다:

- **풀스택 개발**: Next.js 14 App Router 기반 학습자 앱 + 관리자 앱 구현
- **DB 마이그레이션**: EUC-KR → UTF-8 인코딩 전환, Prisma 인트로스펙션 기반 스키마 관리
- **AI 통합**: Google Cloud TTS 파이프라인, OpenAI/Vercel AI SDK 연동
- **인프라**: Vercel 배포, AWS RDS/S3/Lambda 연동, Sentry 에러 모니터링, PWA 설정
- **기간**: 2024.11 ~ 2025.10 (655커밋, 약 11.5개월)

# VocaTokTok Hero + Description 재설계

**Date:** 2026-03-23
**Scope:** `VocaTokTokHero.tsx` SVG 재설계 + `projects.json` description 교체

## 변경 파일

| 파일 | 변경 내용 |
|------|----------|
| `apps/client/src/components/VocaTokTokHero.tsx` | SVG 전면 재설계. Node에 violet+orange+fontSize, Arrow에 stroke 추가 |
| `data/projects.json` | vocatoktok description 교체 |

---

## 1. Hero — 시스템 아키텍처 + 반복 학습 루프 강조

### 레이아웃 (viewBox 640×280)

**Col 1** — Client (Next.js 14, blue)
**Col 2** — API Routes (emerald)
**Col 3** — 학습 시스템 큰 박스 (blue 계열):
- 4개 학습 모드: RDT, RET, Selection, 다국어
- **반복 학습 루프** (violet 박스): 연습 → 테스트 → 오답 → 재시험, 순환 화살표
- 아는/모르는 단어 판별 (corr-inco ≥ 임계값) 텍스트
**우측** — Google TTS (amber), AES-256 (rose), 레벨 시스템 (violet)
**하단** — 학원 관리 시스템 (amber) + Prisma → MySQL UTF-8 (cyan) + PWA (zinc)
**최하단** — Vercel · AWS S3 · Lambda · Sentry 인프라 바

### 색상
기존 VocaTokTok 색상: emerald, blue, amber, zinc, cyan, rose. 추가: violet, orange + fontSize prop.

---

## 2. Description

```
학원에서 영어 단어를 가르칠 때, 학생마다 아는 단어와 모르는 단어가 다른데 같은 교재로 같은 진도를 나가야 했습니다.

학생 개개인의 이해도를 실시간으로 판별하고, 모르는 단어만 골라 반복 학습시키는 맞춤형 학습 플랫폼을 만들었습니다. 정답·오답 횟수를 추적하여 아는 단어와 모르는 단어를 자동 분류하고, 오답 단어는 연습 → 테스트 → 재연습 루프를 거쳐 완전히 익힐 때까지 반복합니다. 성적에 따라 난이도가 자동 조절되어 학생마다 자기 수준에 맞는 학습이 이루어집니다.

학원 운영에 필요한 기능도 함께 제공합니다. Google Cloud TTS로 원어민 발음을 들으며 학습하고, 학원 관리 시스템에서 학교·반·학생별 학습 진도를 추적합니다. 학원의 핵심 자산인 학습 데이터는 AES-256 암호화로 위변조를 방지하며, PWA로 모바일에서도 학습할 수 있습니다.
```

---

## 3. 변경하지 않는 것
- ProjectDetailPage, features, notes, 다른 프로젝트

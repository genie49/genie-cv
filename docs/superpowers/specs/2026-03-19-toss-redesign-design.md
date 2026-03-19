# 토스 스타일 리디자인 설계

## 개요

포트폴리오 사이트(genie-cv)의 전체 페이지를 토스 디자인 시스템 스타일로 리디자인한다. 사이드바 구조는 유지하되, 컬러·카드·타이포·모션을 토스 앱과 유사하게 변경한다.

## 결정 사항

- **스타일 강도**: 토스 전면 적용 (흰 배경 + shadow 카드 + Toss Blue 강조)
- **네비게이션**: 현재 사이드바 유지 + 토스 스타일 적용
- **범위**: 전체 페이지 (대시보드, Projects, 프로젝트 상세, 블로그 노트, QnA, Chat)
- **접근 방식**: 디자인 토큰 먼저 정의 → 페이지별 순차 적용

## 디자인 토큰

### 컬러 팔레트 (토스 기반)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `toss-blue` | `#0064ff` | 강조, active 상태, AI/ML 태그 |
| `toss-heading` | `#191f28` | 제목, 강조 텍스트 |
| `toss-body` | `#4e5968` | 본문 텍스트 |
| `toss-sub` | `#8b95a1` | 보조 텍스트, 라벨 |
| `toss-border` | `#e5e8eb` | 구분선 |
| `toss-card` | `#ffffff` | 카드 배경 |
| `toss-bg` | `#f2f4f6` | 페이지 배경 |
| `toss-tag` | `#f2f4f6` | 태그 배경 |

### 카드 스타일

```
기존: bg-zinc-50 border border-zinc-100 rounded-xl
변경: bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)]
```

### 호버 효과

```
기존: hover:border-zinc-200
변경: hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]
```

### 라운드

```
기존: rounded-xl (12px)
변경: rounded-2xl (16px)
```

## 페이지별 변경 사항

### 사이드바 (Sidebar.tsx)

- 배경: `bg-zinc-50` → `bg-white`
- 구분선: `border-zinc-200` → `border-[#e5e8eb]`
- 프로필 이름: `text-black` → `text-[#191f28]`
- 프로필 역할: `text-zinc-500` → `text-[#8b95a1]`
- 프로필 설명: `text-zinc-400` → `text-[#8b95a1]`
- Active NavLink: `bg-black text-white` → `bg-[#0064ff] text-white rounded-lg`
- Inactive NavLink: `text-zinc-500 hover:bg-zinc-100` → `text-[#8b95a1] hover:bg-[#f2f4f6]`
- 하단 링크: `text-zinc-400 hover:text-zinc-600` → `text-[#8b95a1] hover:text-[#191f28]`
- 구분선: `bg-zinc-200` → `bg-[#e5e8eb]`

### 대시보드 (DashboardPage.tsx)

- 콘텐츠 영역 배경: `bg-toss-bg` 적용 (부모 레이아웃에서)

### AboutPanel

- 카드: `bg-zinc-50 border border-zinc-100 rounded-xl` → `bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)]`
- 제목: `text-black` → `text-[#191f28]`
- 본문: `text-zinc-500` → `text-[#4e5968]`
- Bold: `text-zinc-700` → `text-[#191f28]`
- ChevronDown: `text-zinc-400 hover:text-zinc-600` → `text-[#8b95a1] hover:text-[#191f28]`

### TechStackPanel

- 카드: 동일 변경
- 카테고리 라벨: `text-zinc-400` → `text-[#8b95a1]`
- AI/ML 태그: `bg-black text-white` → `bg-[#0064ff] text-white`
- 일반 태그: `border border-zinc-200 bg-white text-zinc-500` → `bg-[#f2f4f6] text-[#4e5968]` (border 제거)

### EducationPanel

- 카드: 동일 변경
- 제목: `text-black` → `text-[#191f28]`
- 본문: `text-zinc-500` → `text-[#4e5968]`
- 기간: `text-zinc-400` → `text-[#8b95a1]`

### ExperiencePanel

- 카드: 동일 변경
- 간트 차트 배경: `bg-zinc-100` → `bg-[#f2f4f6]`
- 눈금선: `bg-zinc-200` → `bg-[#e5e8eb]`
- 기본 바 색상: `bg-zinc-800` → `bg-[#191f28]`

### ProjectCard

- 카드: `bg-zinc-50 border border-zinc-100 rounded-xl` → `bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)]`
- 호버: `hover:border-zinc-200` → `hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]`
- 제목: `text-black` → `text-[#191f28]`
- 설명: `text-zinc-500` → `text-[#4e5968]`
- 태그: `bg-zinc-100 text-zinc-500` → `bg-[#f2f4f6] text-[#4e5968]`
- 기간: `text-zinc-400` → `text-[#8b95a1]`

### ProjectsPage

- 제목: `text-black` → `text-[#191f28]`
- 설명: `text-zinc-400` → `text-[#8b95a1]`

### ProjectDetailPage

- 제목/본문 컬러 토스 팔레트로 변경
- Feature 카드: 동일 카드 스타일 적용
- 노트 목록: 동일 카드 스타일

### BlogPostPage

- 마크다운 영역 텍스트: 토스 컬러 팔레트 적용
- 코드 블록 배경: 유지 또는 `#f2f4f6`으로 통일

### QnAPage

- 카드: 동일 변경
- 질문 텍스트: `text-black` → `text-[#191f28]`
- 답변 텍스트: `text-zinc-600` → `text-[#4e5968]`
- 아이콘: `text-zinc-400` → `text-[#8b95a1]`
- 구분선: `bg-zinc-200` → `bg-[#e5e8eb]`

### ChatPage

- 입력창/메시지 버블: 토스 팔레트 적용
- 전송 버튼: `bg-black` → `bg-[#0064ff]`

## 레이아웃 배경

콘텐츠 영역(사이드바 오른쪽)의 배경을 `bg-[#f2f4f6]`로 설정한다. 사이드바는 `bg-white`로 유지하여 자연스러운 구분을 만든다.

## 변경하지 않는 것

- 사이드바 구조/레이아웃 (좌측 260px 고정)
- Hero 컴포넌트 내부 SVG 다이어그램
- 모바일 네비게이션 구조
- 프로젝트 데이터 (projects.json, profile.json 등)
- 모션/애니메이션 로직 (motion 라이브러리 사용 유지)

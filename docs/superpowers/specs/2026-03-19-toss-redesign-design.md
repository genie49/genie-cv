# 토스 스타일 리디자인 설계

## 개요

포트폴리오 사이트(genie-cv)의 전체 페이지를 토스 디자인 시스템 스타일로 리디자인한다. 사이드바 구조는 유지하되, 컬러·카드·타이포·모션을 토스 앱과 유사하게 변경한다.

## 결정 사항

- **스타일 강도**: 토스 전면 적용 (흰 배경 + shadow 카드 + Toss Blue 강조)
- **네비게이션**: 현재 사이드바 유지 + 토스 스타일 적용
- **범위**: 전체 페이지 (대시보드, Projects, 프로젝트 상세, 블로그 노트, QnA, Chat)
- **접근 방식**: Tailwind config에 토큰 정의 → 페이지별 순차 적용

## 디자인 토큰

### Tailwind 설정

`tailwind.config`에 다음 커스텀 컬러를 추가한다. 모든 컴포넌트에서 `text-toss-heading`, `bg-toss-blue` 등으로 참조한다.

| 토큰 | 값 | 용도 |
|------|-----|------|
| `toss-blue` | `#0064ff` | 강조, active 상태, AI/ML 태그, 버튼 |
| `toss-heading` | `#191f28` | 제목, 강조 텍스트 |
| `toss-body` | `#4e5968` | 본문 텍스트 |
| `toss-sub` | `#8b95a1` | 보조 텍스트, 라벨 |
| `toss-border` | `#e5e8eb` | 구분선 |
| `toss-card` | `#ffffff` | 카드 배경 |
| `toss-bg` | `#f2f4f6` | 페이지 배경, 태그 배경 |

### 카드 스타일

```
기존: bg-zinc-50 border border-zinc-100 rounded-xl
변경: bg-toss-card rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)]
```

### 호버 효과

```
기존: hover:border-zinc-200
변경: hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]
```

### 라운드

```
기존: rounded-xl (12px) 또는 rounded-[10px]
변경: rounded-2xl (16px) 통일
```

## 레이아웃 배경

**파일: `apps/client/src/App.tsx`**

`<main>` 태그의 `bg-white` → `bg-toss-bg` 변경. 사이드바는 `bg-white`를 유지하여 자연스러운 구분.

## 페이지별 변경 사항

### 사이드바 (`components/layout/Sidebar.tsx`)

- 배경: `bg-zinc-50` → `bg-white`
- border: `border-zinc-200` → `border-toss-border`
- 프로필 이름: `text-black` → `text-toss-heading`
- 프로필 역할: `text-zinc-500` → `text-toss-sub`
- 프로필 설명: `text-zinc-400` → `text-toss-sub`
- Active NavLink: `bg-black text-white` → `bg-toss-blue text-white rounded-lg`
- Inactive NavLink: `text-zinc-500 hover:bg-zinc-100` → `text-toss-sub hover:bg-toss-bg`
- 구분선: `bg-zinc-200` → `bg-toss-border`
- 하단 링크: `text-zinc-400 hover:text-zinc-600` → `text-toss-sub hover:text-toss-heading`

### 모바일 탭바 (`components/layout/MobileTabBar.tsx`)

- Active 상태: `bg-zinc-900 text-white` → `bg-toss-blue text-white`
- Inactive: `text-zinc-400` → `text-toss-sub`
- 컨테이너 pill: `border-zinc-200 bg-zinc-50` → `border-toss-border bg-toss-bg`

### AboutPanel (`components/dashboard/AboutPanel.tsx`)

- 카드: 표준 카드 스타일 적용
- 제목 `<h2>`: `text-black` → `text-toss-heading`
- 본문: `text-zinc-500` → `text-toss-body`
- Bold `<strong>`: `text-zinc-700` → `text-toss-heading`
- ChevronDown: `text-zinc-400 hover:text-zinc-600` → `text-toss-sub hover:text-toss-heading`

### TechStackPanel (`components/dashboard/TechStackPanel.tsx`)

- 카드: 표준 카드 스타일 적용
- 제목 `<h2>`: `text-black` → `text-toss-heading`
- 카테고리 라벨: `text-zinc-400` → `text-toss-sub`
- AI/ML 태그: `bg-black text-white` → `bg-toss-blue text-white`
- 일반 태그: `border border-zinc-200 bg-white text-zinc-500` → `bg-toss-bg text-toss-body` (border 제거)
- ChevronDown: `text-zinc-400 hover:text-zinc-600` → `text-toss-sub hover:text-toss-heading`

### EducationPanel (`components/dashboard/EducationPanel.tsx`)

- 카드: 표준 카드 스타일 적용
- 제목 `<h2>`: `text-black` → `text-toss-heading`
- 학교명: `text-black` → `text-toss-heading`
- 전공: `text-zinc-500` → `text-toss-body`
- 기간: `text-zinc-400` → `text-toss-sub`

### ExperiencePanel (`components/dashboard/ExperiencePanel.tsx`)

- 카드 (앞/뒤): 표준 카드 스타일 적용
- 제목 `<h2>`: `text-black` → `text-toss-heading`
- 플립 배지 ("클릭하여 타임라인 보기"): `bg-zinc-200 text-zinc-500` → `bg-toss-bg text-toss-sub`
- 직함: `text-black` → `text-toss-heading`
- 회사: `text-zinc-500` → `text-toss-body`
- 기간: `text-zinc-400` → `text-toss-sub`
- 근무 유형 배지: `bg-zinc-100 text-zinc-500` → `bg-toss-bg text-toss-sub`
- 간트 차트 배경: `bg-zinc-100` → `bg-toss-bg`
- 간트 눈금선: `bg-zinc-200` → `bg-toss-border`
- 간트 바 기본색: `bg-zinc-800` → `bg-toss-heading`
- 간트 행 라벨: `text-zinc-800` → `text-toss-heading`
- 연도 라벨: `text-zinc-400` → `text-toss-sub`

### ProjectCard (`components/dashboard/ProjectCard.tsx`)

- 카드: 표준 카드 스타일 적용
- 호버: 표준 호버 효과 적용
- 제목: `text-black` → `text-toss-heading`
- 설명: `text-zinc-500` → `text-toss-body`
- 태그: `bg-zinc-100 text-zinc-500` → `bg-toss-bg text-toss-body`
- 기간: `text-zinc-400` → `text-toss-sub`
- fallback: `bg-zinc-200` → `bg-toss-bg`

### DashboardPage (`pages/DashboardPage.tsx`)

- 모바일 캐러셀 화살표: `text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600` → `text-toss-sub hover:bg-toss-bg hover:text-toss-heading`
- 활성 dot: `bg-zinc-700` → `bg-toss-heading`
- 비활성 dot: `bg-zinc-300` → `bg-toss-border`

### ProjectsPage (`pages/ProjectsPage.tsx`)

- 제목: `text-black` → `text-toss-heading`
- 부제: `text-zinc-400` → `text-toss-sub`

### ProjectDetailPage (`pages/ProjectDetailPage.tsx`)

- 뒤로가기 링크: `text-zinc-500 hover:text-zinc-700` → `text-toss-sub hover:text-toss-heading`
- 프로젝트 제목: `text-black` → `text-toss-heading`
- 프로젝트 설명: `text-zinc-500` → `text-toss-body`
- 기간: `text-zinc-400` → `text-toss-sub`
- GitHub 버튼: `bg-black text-white hover:bg-zinc-800` → `bg-toss-blue text-white hover:bg-blue-700`
- Demo 버튼: `border-zinc-200 text-black hover:bg-zinc-50` → `border-toss-border text-toss-heading hover:bg-toss-bg`
- 주요 태그 (앞 4개): `bg-black text-white` → `bg-toss-blue text-white`
- 일반 태그: `bg-zinc-100 text-zinc-500` → `bg-toss-bg text-toss-body`
- Feature 카드: 표준 카드 스타일 (rounded-2xl 통일)
- Feature 제목: `text-black` → `text-toss-heading`
- Feature 설명: `text-zinc-500` → `text-toss-body`
- 노트 카드: 표준 카드 스타일 적용
- 노트 제목: `text-black` → `text-toss-heading`
- 노트 요약: `text-zinc-500` → `text-toss-body`
- 노트 태그: `bg-zinc-100 text-zinc-500` → `bg-toss-bg text-toss-body`
- 노트 날짜: `text-zinc-400` → `text-toss-sub`

### BlogPostPage (`pages/BlogPostPage.tsx`)

- 브레드크럼 링크: `text-zinc-400 hover:text-zinc-600` → `text-toss-sub hover:text-toss-heading`
- 제목: `text-black` → `text-toss-heading`
- 태그: `bg-zinc-100 text-zinc-500` → `bg-toss-bg text-toss-body`
- 구분선: `bg-zinc-100` → `bg-toss-border`
- prose 영역: `prose-zinc` → `prose-gray` 유지, `prose-p:text-zinc-700` → `prose-p:text-toss-body`
- 코드 블록: `prose-pre:bg-zinc-900` → 다크 유지 (하이라이트.js 호환)
- 복사 버튼: `border-zinc-200 text-zinc-600 hover:bg-zinc-50` → `border-toss-border text-toss-body hover:bg-toss-bg`

### QnAPage (`pages/QnAPage.tsx`)

- 제목: `text-black` → `text-toss-heading`
- 부제: `text-zinc-400` → `text-toss-sub`
- 카드: 표준 카드 스타일 적용
- 질문 텍스트: `text-black` → `text-toss-heading`
- 답변 텍스트: `text-zinc-600` → `text-toss-body`
- 아이콘: `text-zinc-400` → `text-toss-sub`
- 구분선: `bg-zinc-200` → `bg-toss-border`
- ChevronDown: `text-zinc-400` → `text-toss-sub`

### ChatPage (`pages/ChatPage.tsx` + `components/assistant-ui/thread.tsx`)

**ChatPage.tsx (헤더)**:
- 제목: `text-zinc-900` → `text-toss-heading`
- 상태 텍스트: `text-zinc-400` → `text-toss-sub`
- 리셋 버튼: `border-zinc-200 text-zinc-500` → `border-toss-border text-toss-sub`
- 리셋 호버: `hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-600` → `hover:border-toss-blue hover:bg-blue-50 hover:text-toss-blue`

**thread.tsx (채팅 UI)**:
- 전송 버튼: `bg-zinc-900 hover:bg-black` → `bg-toss-blue hover:bg-blue-700`
- 입력창: `bg-zinc-50 border-zinc-200 focus:border-indigo-300` → `bg-toss-bg border-toss-border focus:border-toss-blue`
- 유저 메시지: `bg-zinc-900` → `bg-toss-blue`
- 어시스턴트 메시지: `border-zinc-100 bg-white text-zinc-700` → `border-toss-border bg-toss-card text-toss-body`
- 서제스천 칩: `border-zinc-200 bg-white hover:border-indigo-300` → `border-toss-border bg-toss-card hover:border-toss-blue`

## 변경하지 않는 것

- 사이드바 구조/레이아웃 (좌측 260px 고정)
- Hero 컴포넌트 내부 SVG 다이어그램
- 모바일 레이아웃 구조 (캐러셀, collapsible 등)
- 프로젝트 데이터 (projects.json, profile.json 등)
- 모션/애니메이션 로직 (motion 라이브러리 사용 유지)
- 코드 블록 다크 배경 (highlight.js 호환 유지)

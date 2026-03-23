# 토스 스타일 리디자인 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 포트폴리오 사이트 전체를 토스 디자인 시스템 스타일로 리디자인한다.

**Architecture:** Tailwind v4 CSS `@theme` 블록에 토스 컬러 토큰 정의 → 공통 레이아웃(App.tsx) 배경 변경 → 사이드바/탭바 → 대시보드 패널 5개 → 나머지 페이지 순으로 클래스명 교체.

**Tech Stack:** Tailwind CSS v4, React, motion/react

**Spec:** `docs/superpowers/specs/2026-03-19-toss-redesign-design.md`

---

## File Structure

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `apps/client/src/styles/global.css` | @theme 블록에 토스 컬러 토큰 추가 |
| Modify | `apps/client/src/App.tsx` | main 배경색 변경 |
| Modify | `apps/client/src/components/layout/Sidebar.tsx` | 사이드바 토스 스타일 |
| Modify | `apps/client/src/components/layout/MobileTabBar.tsx` | 모바일 탭바 토스 스타일 |
| Modify | `apps/client/src/components/dashboard/AboutPanel.tsx` | 패널 토스 스타일 |
| Modify | `apps/client/src/components/dashboard/TechStackPanel.tsx` | 패널 토스 스타일 |
| Modify | `apps/client/src/components/dashboard/EducationPanel.tsx` | 패널 토스 스타일 |
| Modify | `apps/client/src/components/dashboard/ExperiencePanel.tsx` | 패널 토스 스타일 |
| Modify | `apps/client/src/components/dashboard/ProjectCard.tsx` | 카드 토스 스타일 |
| Modify | `apps/client/src/pages/DashboardPage.tsx` | 캐러셀 컨트롤 색상 |
| Modify | `apps/client/src/pages/ProjectsPage.tsx` | 제목/부제 색상 |
| Modify | `apps/client/src/pages/ProjectDetailPage.tsx` | 상세 페이지 토스 스타일 |
| Modify | `apps/client/src/pages/BlogPostPage.tsx` | 블로그 토스 스타일 |
| Modify | `apps/client/src/pages/QnAPage.tsx` | Q&A 토스 스타일 |
| Modify | `apps/client/src/pages/ChatPage.tsx` | 채팅 헤더 토스 스타일 |
| Modify | `apps/client/src/components/assistant-ui/thread.tsx` | 채팅 UI 토스 스타일 |

---

### Task 1: 디자인 토큰 정의 + 레이아웃 배경

**Files:**
- Modify: `apps/client/src/styles/global.css`
- Modify: `apps/client/src/App.tsx`

- [ ] **Step 1: global.css에 @theme 블록 추가**

`@import "tailwindcss";` 뒤에 다음을 추가:

```css
@theme {
  --color-toss-blue: #0064ff;
  --color-toss-heading: #191f28;
  --color-toss-body: #4e5968;
  --color-toss-sub: #8b95a1;
  --color-toss-border: #e5e8eb;
  --color-toss-card: #ffffff;
  --color-toss-bg: #f2f4f6;
}
```

이렇게 하면 `bg-toss-bg`, `text-toss-heading` 등으로 사용 가능.

- [ ] **Step 2: App.tsx main 배경 변경**

```
Before: <main className="flex-1 overflow-auto bg-white pb-24 md:pb-0">
After:  <main className="flex-1 overflow-auto bg-toss-bg pb-24 md:pb-0">
```

- [ ] **Step 3: 빌드 확인**

Run: `bun run build`
Expected: 정상 빌드

- [ ] **Step 4: 커밋**

```bash
git add apps/client/src/styles/global.css apps/client/src/App.tsx
git commit -m "feat: add toss design tokens + change layout background"
```

---

### Task 2: 사이드바 + 모바일 탭바

**Files:**
- Modify: `apps/client/src/components/layout/Sidebar.tsx`
- Modify: `apps/client/src/components/layout/MobileTabBar.tsx`

- [ ] **Step 1: Sidebar.tsx 클래스 교체**

스펙의 "사이드바" 섹션에 따라 모든 zinc 클래스를 toss 토큰으로 교체:
- `bg-zinc-50` → `bg-white`
- `border-zinc-200` → `border-toss-border`
- `text-black` → `text-toss-heading`
- `text-zinc-500` → `text-toss-sub`
- `text-zinc-400` → `text-toss-sub`
- `bg-black text-white` (active) → `bg-toss-blue text-white`
- `hover:bg-zinc-100` → `hover:bg-toss-bg`
- `bg-zinc-200` (dividers) → `bg-toss-border`
- `hover:text-zinc-600` → `hover:text-toss-heading`

- [ ] **Step 2: MobileTabBar.tsx 클래스 교체**

스펙의 "모바일 탭바" 섹션에 따라:
- `bg-zinc-900 text-white` (active) → `bg-toss-blue text-white`
- `text-zinc-400` (inactive) → `text-toss-sub`
- `border-zinc-200 bg-zinc-50` (pill) → `border-toss-border bg-toss-bg`

- [ ] **Step 3: 빌드 확인**

Run: `bun run build`

- [ ] **Step 4: 커밋**

```bash
git add apps/client/src/components/layout/Sidebar.tsx apps/client/src/components/layout/MobileTabBar.tsx
git commit -m "feat: restyle sidebar + mobile tab bar to toss design"
```

---

### Task 3: 대시보드 패널 5개

**Files:**
- Modify: `apps/client/src/components/dashboard/AboutPanel.tsx`
- Modify: `apps/client/src/components/dashboard/TechStackPanel.tsx`
- Modify: `apps/client/src/components/dashboard/EducationPanel.tsx`
- Modify: `apps/client/src/components/dashboard/ExperiencePanel.tsx`
- Modify: `apps/client/src/components/dashboard/ProjectCard.tsx`

- [ ] **Step 1: 5개 패널 공통 카드 스타일 교체**

모든 패널에서:
```
Before: rounded-xl border border-zinc-100 bg-zinc-50
After:  rounded-2xl bg-toss-card shadow-[0_1px_3px_rgba(0,0,0,0.06)]
```

- [ ] **Step 2: AboutPanel 색상 교체**

- `text-black` → `text-toss-heading`
- `text-zinc-500` → `text-toss-body`
- `text-zinc-700` (bold) → `text-toss-heading`
- `text-zinc-400 hover:text-zinc-600` → `text-toss-sub hover:text-toss-heading`

- [ ] **Step 3: TechStackPanel 색상 교체**

- `text-black` → `text-toss-heading`
- `text-zinc-400` → `text-toss-sub`
- AI/ML 태그: `bg-black text-white` → `bg-toss-blue text-white`
- 일반 태그: `border border-zinc-200 bg-white text-zinc-500` → `bg-toss-bg text-toss-body` (border 제거)
- `text-zinc-400 hover:text-zinc-600` → `text-toss-sub hover:text-toss-heading`

- [ ] **Step 4: EducationPanel 색상 교체**

- `text-black` → `text-toss-heading`
- `text-zinc-500` → `text-toss-body`
- `text-zinc-400` → `text-toss-sub`

- [ ] **Step 5: ExperiencePanel 색상 교체**

- `text-black` → `text-toss-heading`
- `bg-zinc-200 text-zinc-500` (배지) → `bg-toss-bg text-toss-sub`
- `text-zinc-500` → `text-toss-body`
- `text-zinc-400` → `text-toss-sub`
- `bg-zinc-100 text-zinc-500` (타입 배지) → `bg-toss-bg text-toss-sub`
- `bg-zinc-100` (간트 배경) → `bg-toss-bg`
- `bg-zinc-200` (눈금선) → `bg-toss-border`
- `bg-zinc-800` (간트 바) → `bg-toss-heading`
- `text-zinc-800` (행 라벨) → `text-toss-heading`

- [ ] **Step 6: ProjectCard 색상 교체**

- 카드: 공통 카드 스타일
- 호버: `hover:border-zinc-200` → `hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]`
- `text-black` → `text-toss-heading`
- `text-zinc-500` → `text-toss-body`
- `bg-zinc-100 text-zinc-500` (태그) → `bg-toss-bg text-toss-body`
- `text-zinc-400` → `text-toss-sub`
- `bg-zinc-200` (fallback) → `bg-toss-bg`

- [ ] **Step 7: 빌드 확인**

Run: `bun run build`

- [ ] **Step 8: 커밋**

```bash
git add apps/client/src/components/dashboard/
git commit -m "feat: restyle all dashboard panels to toss design"
```

---

### Task 4: DashboardPage 캐러셀 컨트롤

**Files:**
- Modify: `apps/client/src/pages/DashboardPage.tsx`

- [ ] **Step 1: 캐러셀 컨트롤 색상 교체**

- 화살표: `text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600` → `text-toss-sub hover:bg-toss-bg hover:text-toss-heading`
- 활성 dot: `bg-zinc-700` → `bg-toss-heading`
- 비활성 dot: `bg-zinc-300` → `bg-toss-border`

- [ ] **Step 2: 커밋**

```bash
git add apps/client/src/pages/DashboardPage.tsx
git commit -m "feat: restyle dashboard carousel controls to toss design"
```

---

### Task 5: ProjectsPage + ProjectDetailPage

**Files:**
- Modify: `apps/client/src/pages/ProjectsPage.tsx`
- Modify: `apps/client/src/pages/ProjectDetailPage.tsx`

- [ ] **Step 1: ProjectsPage 색상 교체**

- `text-black` → `text-toss-heading`
- `text-zinc-400` → `text-toss-sub`

- [ ] **Step 2: ProjectDetailPage 색상 교체**

스펙의 상세 매핑에 따라:
- 뒤로가기: `text-zinc-500 hover:text-zinc-700` → `text-toss-sub hover:text-toss-heading`
- 제목: `text-black` → `text-toss-heading`
- 설명: `text-zinc-500` → `text-toss-body`
- 기간: `text-zinc-400` → `text-toss-sub`
- GitHub 버튼: `bg-black text-white hover:bg-zinc-800` → `bg-toss-blue text-white hover:bg-blue-700`
- Demo 버튼: `border-zinc-200 text-black hover:bg-zinc-50` → `border-toss-border text-toss-heading hover:bg-toss-bg`
- 주요 태그: `bg-black text-white` → `bg-toss-blue text-white`
- 일반 태그: `bg-zinc-100 text-zinc-500` → `bg-toss-bg text-toss-body`
- Feature/Note 카드: 표준 카드 스타일 (rounded-2xl 포함, rounded-[10px] 교체)
- Feature 제목/설명: `text-black`/`text-zinc-500` → `text-toss-heading`/`text-toss-body`
- Note 제목/요약/태그/날짜: 동일 패턴

- [ ] **Step 3: 빌드 확인**

Run: `bun run build`

- [ ] **Step 4: 커밋**

```bash
git add apps/client/src/pages/ProjectsPage.tsx apps/client/src/pages/ProjectDetailPage.tsx
git commit -m "feat: restyle projects pages to toss design"
```

---

### Task 6: BlogPostPage

**Files:**
- Modify: `apps/client/src/pages/BlogPostPage.tsx`

- [ ] **Step 1: BlogPostPage 색상 교체**

- 브레드크럼: `text-zinc-400 hover:text-zinc-600` → `text-toss-sub hover:text-toss-heading`
- 제목: `text-black` → `text-toss-heading`
- 태그: `bg-zinc-100 text-zinc-500` → `bg-toss-bg text-toss-body`
- 구분선: `bg-zinc-100` → `bg-toss-border`
- prose: `prose-p:text-zinc-700` → `prose-p:text-toss-body`
- 코드 블록: `prose-pre:bg-zinc-900` → 유지 (다크 테마 호환)
- 복사 버튼: `border-zinc-200 text-zinc-600 hover:bg-zinc-50` → `border-toss-border text-toss-body hover:bg-toss-bg`

- [ ] **Step 2: 커밋**

```bash
git add apps/client/src/pages/BlogPostPage.tsx
git commit -m "feat: restyle blog post page to toss design"
```

---

### Task 7: QnAPage

**Files:**
- Modify: `apps/client/src/pages/QnAPage.tsx`

- [ ] **Step 1: QnAPage 색상 교체**

- 제목: `text-black` → `text-toss-heading`
- 부제: `text-zinc-400` → `text-toss-sub`
- 카드: 표준 카드 스타일
- 질문: `text-black` → `text-toss-heading`
- 답변: `text-zinc-600` → `text-toss-body`
- 아이콘: `text-zinc-400` → `text-toss-sub`
- 구분선: `bg-zinc-200` → `bg-toss-border`

- [ ] **Step 2: 커밋**

```bash
git add apps/client/src/pages/QnAPage.tsx
git commit -m "feat: restyle QnA page to toss design"
```

---

### Task 8: ChatPage + thread.tsx

**Files:**
- Modify: `apps/client/src/pages/ChatPage.tsx`
- Modify: `apps/client/src/components/assistant-ui/thread.tsx`

- [ ] **Step 1: ChatPage 헤더 색상 교체**

- `text-zinc-900` → `text-toss-heading`
- `text-zinc-400` → `text-toss-sub`
- 리셋 버튼: `border-zinc-200 text-zinc-500` → `border-toss-border text-toss-sub`
- 리셋 호버: `hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-600` → `hover:border-toss-blue hover:bg-blue-50 hover:text-toss-blue`

- [ ] **Step 2: thread.tsx 색상 교체**

- 전송 버튼: `bg-zinc-900 hover:bg-black` → `bg-toss-blue hover:bg-blue-700`
- 입력창: `bg-zinc-50 border-zinc-200 focus:border-indigo-300` → `bg-toss-bg border-toss-border focus:border-toss-blue`
- 유저 메시지: `bg-zinc-900` → `bg-toss-blue`
- 어시스턴트 메시지: `border-zinc-100 bg-white text-zinc-700` → `border-toss-border bg-toss-card text-toss-body`
- 서제스천 칩: `border-zinc-200 bg-white hover:border-indigo-300` → `border-toss-border bg-toss-card hover:border-toss-blue`

- [ ] **Step 3: 빌드 확인**

Run: `bun run build`

- [ ] **Step 4: 커밋**

```bash
git add apps/client/src/pages/ChatPage.tsx apps/client/src/components/assistant-ui/thread.tsx
git commit -m "feat: restyle chat page + thread UI to toss design"
```

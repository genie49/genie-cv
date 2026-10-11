# 경력 소개 영상

첫 페이지 타임라인에서 경력 카드를 누르면 오른쪽에 재생되는 세로 영상(1080×1920)의 소스. [Remotion](https://www.remotion.dev)으로 만든다.

```bash
npm i
npm run dev            # Studio 미리보기
npm run render:daangn  # apps/client/public/videos/daangn.mp4
npm run render:aimers  # apps/client/public/videos/aimers.mp4
npm run render:heir    # apps/client/public/videos/heir.mp4
```

렌더 결과물(mp4)은 커밋한다. 사이트 빌드는 이 폴더를 건드리지 않는다.

- `src/ui.tsx` — 색, 폰트, 공통 컴포넌트(`Step`: 문제 → 해결 → 결과 한 장면)
- `src/scenes/` — 당근 영상 장면과 공용 장면(Title, Outro, Ring)
- `src/aimers/`, `src/heir/` — 아이머스, HEIR 영상 장면
- 영상을 경력에 연결하려면 `data/profile.json`의 해당 경력에 `"video": "/videos/<이름>.mp4"`를 넣는다.

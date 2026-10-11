import { C, Step, useProgress } from "../ui";

// 섞여 있던 블록(before 순서)이 고정 → 질문별 순서(after)로 정렬된다
const BLOCKS = [
  { label: "고정 지식", fixed: true, before: 0, after: 0 },
  { label: "질문별 정보", fixed: false, before: 1, after: 3 },
  { label: "고정 지식", fixed: true, before: 2, after: 1 },
  { label: "고정 지식", fixed: true, before: 3, after: 2 },
];
const ROW = 132;

export const Caching = () => {
  const show = useProgress(3.0);
  const sort = useProgress(4.2, 0.9);
  return (
    <Step
      index={1}
      problem={"프롬프트 캐시가\n질문마다 다시 작성되고 있었다"}
      solution="고정 정보 분리 · 순서 고정"
      solutionAt={2.2}
      outcomeLabel="다음 질문"
      outcome={"그런데 이 변경으로\n정말 나아졌는지 어떻게 알지?"}
      outcomeAt={5.8}
    >
      <div style={{ position: "relative", height: ROW * 4, opacity: show }}>
        {BLOCKS.map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: (b.before + (b.after - b.before) * sort) * ROW,
              height: ROW - 22,
              borderRadius: 28,
              display: "flex",
              alignItems: "center",
              padding: "0 44px",
              fontSize: 46,
              fontWeight: 800,
              backgroundColor: b.fixed ? C.card : C.orange,
              color: b.fixed ? C.heading : "white",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            {b.label}
          </div>
        ))}
        {/* 정렬 전: 다시 작성 / 정렬 후: 재사용 */}
        <div
          style={{
            position: "absolute",
            right: 30,
            top: ROW + (ROW - 22) / 2 - 38,
            fontSize: 40,
            fontWeight: 800,
            padding: "14px 30px",
            borderRadius: 999,
            color: "white",
            backgroundColor: sort > 0.5 ? C.blue : C.red,
            scale: 1 - Math.sin(sort * Math.PI) * 0.15,
          }}
        >
          {sort > 0.5 ? "캐시 재사용" : "매번 캐시 다시 작성"}
        </div>
      </div>
    </Step>
  );
};

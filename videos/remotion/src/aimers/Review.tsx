import { C, Rise, Step, useProgress } from "../ui";

const Stage: React.FC<{ name: string; desc: string; on: number; gate?: boolean }> = ({
  name,
  desc,
  on,
  gate,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: on > 0.5 ? (gate ? C.cyan : C.heading) : C.card,
      color: on > 0.5 ? "white" : C.heading,
      borderRadius: 28,
      padding: "28px 40px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      scale: 1 + Math.sin(on * Math.PI) * 0.04,
    }}
  >
    <div>
      <div style={{ fontSize: 48, fontWeight: 800 }}>{name}</div>
      <div style={{ fontSize: 36, fontWeight: 600, opacity: 0.8 }}>{desc}</div>
    </div>
    <div style={{ fontSize: 60, fontWeight: 800, opacity: on }}>✓</div>
  </div>
);

const Arrow = () => (
  <div style={{ textAlign: "center", fontSize: 48, fontWeight: 800, color: C.sub, margin: "10px 0" }}>↓</div>
);

export const Review = () => {
  const made = useProgress(3.6, 0.5);
  const approved = useProgress(4.8, 0.5);
  const done = useProgress(5.8, 0.5);
  return (
    <Step
      index={5}
      problem={"LLM이 만든 콘텐츠를 그대로\n다음 단계로 넘기기엔 불안했다"}
      solution="판단 지점에만 승인 단계"
      solutionAt={2.2}
      outcomeLabel="결과"
      outcomeColor={C.blue}
      outcome={"담당자는 한 페이지에서\n검토·승인·피드백만"}
      outcomeAt={6.8}
    >
      <Rise at={3.0}>
        <Stage name="콘텐츠 생성" desc="트렌드 기반 파이프라인" on={made} />
        <Arrow />
        <Stage name="담당자 승인" desc="적절성은 사람의 직관으로" on={approved} gate />
        <Arrow />
        <Stage name="후속 작업" desc="통과하면 자동 진행" on={done} />
      </Rise>
    </Step>
  );
};

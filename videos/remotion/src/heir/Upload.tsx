import { C, Card, Rise, Step, useProgress } from "../ui";

const Field: React.FC<{ label: string; fill: number }> = ({ label, fill }) => (
  <div style={{ marginTop: 22 }}>
    <div style={{ fontSize: 36, fontWeight: 800, color: C.sub }}>{label}</div>
    <div style={{ height: 26, borderRadius: 13, backgroundColor: C.bg, marginTop: 8 }}>
      <div style={{ height: "100%", width: `${fill * 100}%`, borderRadius: 13, backgroundColor: C.violet }} />
    </div>
  </div>
);

export const Upload = () => {
  const kind = useProgress(3.6, 0.8);
  const desc = useProgress(4.2, 1.0);
  return (
    <Step
      index={1}
      problem={"업무가 많은 학예사가\n유물을 하나하나 등록해야 했다"}
      solution="이미지만 올리면 등록"
      solutionAt={2.2}
      outcomeLabel="다음 문제"
      outcomeColor={C.red}
      outcome={"그런데 이미지만으로는\n전문적인 분류에 지식이 부족했다"}
      outcomeAt={7.2}
    >
      <Rise at={2.9} style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div
          style={{
            width: 270,
            height: 270,
            borderRadius: 32,
            backgroundColor: C.card,
            border: `6px dashed ${C.violet}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            fontWeight: 800,
            color: C.violet,
          }}
        >
          <div style={{ fontSize: 80 }}>↑</div>
          유물 이미지
        </div>
        <div style={{ fontSize: 56, fontWeight: 800, color: C.sub }}>→</div>
        <Card style={{ flex: 1, padding: "30px 36px" }}>
          <div style={{ fontSize: 44, fontWeight: 800 }}>에이전트가 작성</div>
          <Field label="세부 분류" fill={kind} />
          <Field label="설명" fill={desc} />
        </Card>
      </Rise>
      <Rise at={5.4} style={{ marginTop: 28 }}>
        <div
          style={{
            border: `4px solid ${C.violet}`,
            borderRadius: 28,
            padding: "24px 36px",
            fontSize: 44,
            fontWeight: 800,
            backgroundColor: C.card,
          }}
        >
          학예사 피드백 → 다시 라벨링 ↺
        </div>
      </Rise>
      <Rise at={6.1} style={{ marginTop: 20 }}>
        <div style={{ fontSize: 38, fontWeight: 800, color: C.sub }}>현장처럼 ‘상자’ 단위로 묶어 관리</div>
      </Rise>
    </Step>
  );
};

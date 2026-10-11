import { C, Card, Rise, Step, useProgress } from "../ui";

export const Reports = () => {
  const grow = useProgress(5.0, 1.4);
  const count = Math.round(100 + (7000 - 100) * grow);
  return (
    <Step
      index={2}
      problem={"이미지만으로는 전문적인\n분류와 설명에 지식이 부족했다"}
      solution="발굴조사보고서를 근거로"
      solutionAt={2.2}
      outcomeLabel="다음 문제"
      outcomeColor={C.red}
      outcome={"그런데 보고서는 이미지 PDF,\n일반 파서로는 읽을 수 없었다"}
      outcomeAt={7.4}
    >
      <Rise at={3.0}>
        <Card style={{ padding: "44px 48px" }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: C.body }}>에이전트에 연결한 보고서</div>
          <div
            style={{
              fontSize: 190,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {count.toLocaleString("en-US")}
            <span style={{ fontSize: 80 }}>건</span>
          </div>
          <div style={{ height: 32, borderRadius: 16, backgroundColor: C.bg, marginTop: 10 }}>
            <div
              style={{
                height: "100%",
                width: `${(count / 7000) * 100}%`,
                minWidth: 32,
                borderRadius: 16,
                backgroundColor: C.violet,
              }}
            />
          </div>
          <div style={{ fontSize: 42, fontWeight: 800, color: C.sub, marginTop: 26, lineHeight: 1.4 }}>
            {grow < 0.05 ? "먼저 100건으로 실험해 효과 확인" : "학예사·연구자 요청으로 전체로 확대"}
          </div>
        </Card>
      </Rise>
    </Step>
  );
};

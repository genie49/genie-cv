import { AbsoluteFill } from "remotion";
import { C, Card, FONT, Rise, useProgress } from "../ui";

const BARS = [0.45, 0.7, 0.55, 0.9, 0.75];

export const Why = () => {
  const grow = useProgress(1.5, 0.9);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        fontFamily: FONT,
        color: C.heading,
        padding: "150px 80px 170px",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <Rise at={0.1}>
        <div style={{ fontSize: 44, fontWeight: 800, color: C.orange }}>배경</div>
        <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.18, marginTop: 16, letterSpacing: "-0.02em" }}>
          분석가가 아니어도
          <br />
          누구나 직접 데이터를
        </div>
      </Rise>
      <Rise at={0.7} style={{ display: "flex", justifyContent: "flex-end" }}>
        <div
          style={{
            backgroundColor: C.orange,
            color: "white",
            fontSize: 50,
            fontWeight: 600,
            padding: "30px 44px",
            borderRadius: "40px 40px 8px 40px",
          }}
        >
          지난주 지표 어땠어?
        </div>
      </Rise>
      <Rise at={1.2}>
        <Card style={{ width: 720, borderRadius: "40px 40px 40px 8px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 28, height: 340 }}>
            {BARS.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h * grow * 100}%`,
                  borderRadius: 16,
                  backgroundColor: i === 3 ? C.orange : C.border,
                }}
              />
            ))}
          </div>
        </Card>
      </Rise>
      <Rise at={1.8}>
        <div style={{ fontSize: 48, fontWeight: 600, color: C.body }}>
          사내 데이터 분석 에이전트
        </div>
      </Rise>
    </AbsoluteFill>
  );
};

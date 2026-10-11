import { AbsoluteFill } from "remotion";
import { C, Card, Chip, FONT, Rise, useProgress } from "../ui";

const Stat: React.FC<{
  label: string;
  from: number;
  to: number;
  unit: string;
  digits: number;
  max: number;
  delta: string;
  at: number;
}> = ({ label, from, to, unit, digits, max, delta, at }) => {
  const p = useProgress(at + 0.5, 1.2);
  const now = from + (to - from) * p;
  const badge = useProgress(at + 1.6, 0.4);
  return (
    <Rise at={at}>
      <Card style={{ padding: "44px 48px" }}>
        <div style={{ fontSize: 44, fontWeight: 800, color: C.body }}>{label}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 10 }}>
          <div style={{ fontSize: 64, fontWeight: 800, color: C.sub }}>
            {from.toFixed(digits)}
            {unit} →
          </div>
          <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
            {now.toFixed(digits)}
            <span style={{ fontSize: 80 }}>{unit}</span>
          </div>
        </div>
        <div style={{ position: "relative", height: 32, borderRadius: 16, backgroundColor: C.bg, marginTop: 16 }}>
          <div
            style={{
              height: "100%",
              width: `${(now / max) * 100}%`,
              borderRadius: 16,
              backgroundColor: C.orange,
            }}
          />
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 28,
            opacity: badge,
            scale: 0.8 + badge * 0.2,
            backgroundColor: C.blue,
            color: "white",
            fontSize: 52,
            fontWeight: 800,
            padding: "14px 34px",
            borderRadius: 999,
          }}
        >
          {delta}
        </div>
      </Card>
    </Rise>
  );
};

export const Result = () => (
  <AbsoluteFill
    style={{
      backgroundColor: C.bg,
      fontFamily: FONT,
      color: C.heading,
      padding: "110px 80px 120px",
      justifyContent: "space-between",
    }}
  >
    <Rise at={0.1}>
      <Chip color={C.blue}>결과</Chip>
      <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
        기존 에이전트 대비
      </div>
    </Rise>
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <Stat label="답변 평가 통과율" from={60} to={78} unit="%" digits={0} max={100} delta="+18%p" at={0.6} />
      <Stat label="응답 시간 중앙값" from={49.9} to={24.9} unit="초" digits={1} max={60} delta="약 50% 단축" at={2.6} />
    </div>
    <Rise at={5.0}>
      <div style={{ fontSize: 50, fontWeight: 700, lineHeight: 1.35 }}>
        팀이 제품화에 착수하는
        <br />
        의사결정의 근거가 됐다
      </div>
    </Rise>
  </AbsoluteFill>
);

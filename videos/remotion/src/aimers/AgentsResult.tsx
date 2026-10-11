import { AbsoluteFill } from "remotion";
import { C, Card, Chip, FONT, Rise, useProgress } from "../ui";

const Bar: React.FC<{ label: string; width: number; color: string }> = ({ label, width, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 18 }}>
    <div style={{ width: 90, fontSize: 38, fontWeight: 800, color: C.sub }}>{label}</div>
    <div style={{ flex: 1, height: 44, borderRadius: 22, backgroundColor: C.bg }}>
      <div style={{ height: "100%", width: `${width}%`, borderRadius: 22, backgroundColor: color }} />
    </div>
  </div>
);

export const AgentsResult = () => {
  // 막대 길이는 구간의 중간값 비율(100k → 20k, 100 → 70)
  const context = useProgress(1.2, 1.2);
  const cost = useProgress(3.4, 1.2);
  return (
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
          더 가볍게, 더 싸게
        </div>
      </Rise>
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <Rise at={0.6}>
          <Card style={{ padding: "44px 48px" }}>
            <div style={{ fontSize: 44, fontWeight: 800, color: C.body }}>Supervisor 컨텍스트</div>
            <div style={{ fontSize: 64, fontWeight: 800, color: C.sub, marginTop: 10 }}>80~120k →</div>
            <div style={{ fontSize: 130, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              15~25k<span style={{ fontSize: 64 }}> 토큰</span>
            </div>
            <Bar label="전" width={100} color={C.border} />
            <Bar label="후" width={100 - 80 * context} color={C.cyan} />
          </Card>
        </Rise>
        <Rise at={2.8}>
          <Card style={{ padding: "44px 48px" }}>
            <div style={{ fontSize: 44, fontWeight: 800, color: C.body }}>에이전트 루프 실행 비용</div>
            <div style={{ fontSize: 130, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              약 30%<span style={{ fontSize: 64 }}> 절감</span>
            </div>
            <Bar label="전" width={100} color={C.border} />
            <Bar label="후" width={100 - 30 * cost} color={C.cyan} />
          </Card>
        </Rise>
      </div>
      <Rise at={5.2}>
        <div style={{ fontSize: 50, fontWeight: 700, lineHeight: 1.35 }}>
          기획하는 캠페인의 품질도
          <br />
          눈에 띄게 향상됐다
        </div>
      </Rise>
    </AbsoluteFill>
  );
};

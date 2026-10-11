import { AbsoluteFill } from "remotion";
import { Bar } from "../aimers/AgentsResult";
import { Stat } from "../scenes/Result";
import { C, Card, Chip, FONT, Rise, useProgress } from "../ui";

export const PipelineResult = () => {
  // 막대 길이는 한 달(30일) 대 일주일(7일) 비율
  const shrink = useProgress(3.6, 1.2);
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
          한 달 걸릴 일을 일주일에
        </div>
      </Rise>
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <Stat label="OCR 처리량 (추론 설정 조정)" from={1} to={1.62} unit="배" digits={2} max={2} delta="1.62배" at={0.6} />
        <Rise at={3.0}>
          <Card style={{ padding: "44px 48px" }}>
            <div style={{ fontSize: 44, fontWeight: 800, color: C.body }}>보고서 수집·적재</div>
            <div style={{ fontSize: 64, fontWeight: 800, color: C.sub, marginTop: 10 }}>약 한 달 예상 →</div>
            <div style={{ fontSize: 130, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              일주일<span style={{ fontSize: 64 }}> 에 완료</span>
            </div>
            <Bar label="전" width={100} color={C.border} />
            <Bar label="후" width={100 - 77 * shrink} color={C.violet} />
          </Card>
        </Rise>
      </div>
      <Rise at={5.4}>
        <div style={{ fontSize: 50, fontWeight: 700, lineHeight: 1.35 }}>
          보고서가 에이전트의
          <br />
          지식으로 쓰이기 시작했다
        </div>
      </Rise>
    </AbsoluteFill>
  );
};

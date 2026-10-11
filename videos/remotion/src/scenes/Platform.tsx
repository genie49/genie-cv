import { C, Rise, Step, useProgress } from "../ui";

// 자잘한 하위 구현들. 흩어져 있다가 Agent 하나로 뭉친다.
const RAW = [
  { label: "DB 인프라", x: 10, y: 0 },
  { label: "연결 계층", x: 335, y: 24 },
  { label: "지식 저장", x: 640, y: 4 },
  { label: "지식 조회", x: 40, y: 124 },
  { label: "에이전트 실행", x: 600, y: 132 },
  { label: "트레이스", x: 0, y: 248 },
  { label: "평가 연동", x: 320, y: 232 },
  { label: "실행 환경", x: 650, y: 256 },
];
const CHIP_W = 270;
const CHIP_H = 88;
const TARGET = { x: 325, y: 125 };

const RawChip: React.FC<{ label: string; x: number; y: number; at: number; merge: number }> = ({
  label,
  x,
  y,
  at,
  merge,
}) => {
  const show = useProgress(at, 0.4);
  return (
    <div
      style={{
        position: "absolute",
        left: x + (TARGET.x - x) * merge,
        top: y + (TARGET.y - y) * merge,
        width: CHIP_W,
        height: CHIP_H,
        borderRadius: 22,
        backgroundColor: C.card,
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 38,
        fontWeight: 800,
        color: C.body,
        opacity: show * (1 - merge),
        scale: 1 - merge * 0.4,
      }}
    >
      {label}
    </div>
  );
};

export const Platform = () => {
  const merge = useProgress(4.6, 0.9);
  return (
    <Step
      index={4}
      problem={"이 실험을 팀 전체가 이어가려면?\n각자 DB와 실행 환경부터 꾸려야 했다"}
      solution="공통 실험 기반 구축"
      solutionAt={2.2}
      outcomeLabel="결과"
      outcomeColor={C.blue}
      outcome={"하위 구현은 몰라도\n자기 전문성을 살린 실험에 집중"}
      outcomeAt={7.0}
    >
      <div style={{ position: "relative", height: 560 }}>
        <RawChip label={RAW[0].label} x={RAW[0].x} y={RAW[0].y} at={2.9} merge={merge} />
        <RawChip label={RAW[1].label} x={RAW[1].x} y={RAW[1].y} at={3.05} merge={merge} />
        <RawChip label={RAW[2].label} x={RAW[2].x} y={RAW[2].y} at={3.2} merge={merge} />
        <RawChip label={RAW[3].label} x={RAW[3].x} y={RAW[3].y} at={3.35} merge={merge} />
        <RawChip label={RAW[4].label} x={RAW[4].x} y={RAW[4].y} at={3.5} merge={merge} />
        <RawChip label={RAW[5].label} x={RAW[5].x} y={RAW[5].y} at={3.65} merge={merge} />
        <RawChip label={RAW[6].label} x={RAW[6].x} y={RAW[6].y} at={3.8} merge={merge} />
        <RawChip label={RAW[7].label} x={RAW[7].x} y={RAW[7].y} at={3.95} merge={merge} />

        {/* 뭉쳐진 상위 객체 */}
        <div
          style={{
            position: "absolute",
            left: 210,
            top: 70,
            width: 500,
            height: 200,
            borderRadius: 44,
            backgroundColor: C.orange,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 110,
            fontWeight: 800,
            opacity: merge,
            scale: 0.5 + merge * 0.5,
            boxShadow: "0 12px 40px rgba(255,111,15,0.35)",
          }}
        >
          Agent
        </div>

        {/* 팀원은 가져다 쓰기만 */}
        <Rise at={5.7} style={{ position: "absolute", left: 0, right: 0, top: 330 }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: C.sub, marginBottom: 14 }}>
            팀원은 가져다 쓰기만
          </div>
          <div
            style={{
              backgroundColor: C.heading,
              color: "white",
              borderRadius: 28,
              padding: "34px 40px",
              fontFamily: "Menlo, monospace",
              fontSize: 40,
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: C.orange }}>Agent</span>(모델, 도구, 스킬)
          </div>
        </Rise>
      </div>
    </Step>
  );
};

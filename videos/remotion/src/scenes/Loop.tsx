import { useContext } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Accent, C, Rise, Step, useProgress } from "../ui";

const R = 230;
const CX = 460;
const CY = 300;
const point = (deg: number) => ({
  x: CX + R * Math.cos((deg * Math.PI) / 180),
  y: CY + R * Math.sin((deg * Math.PI) / 180),
});

/** 네 단계가 도는 순환 고리. at초에 그려지기 시작하고 점이 3초에 한 바퀴 돈다. */
export const Ring: React.FC<{ labels: string[]; at: number; highlight?: number }> = ({
  labels,
  at,
  highlight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = useContext(Accent);
  const draw = useProgress(at, 1.0);
  const circumference = 2 * Math.PI * R;
  const dot = point(-90 + (Math.max(0, frame - (at + 0.6) * fps) / (3 * fps)) * 360);

  return (
    <div style={{ position: "relative", width: 920, height: 600 }}>
      <svg width={920} height={600} style={{ position: "absolute" }}>
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke={C.border}
          strokeWidth={10}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - draw)}
          transform={`rotate(-90 ${CX} ${CY})`}
        />
        <circle cx={dot.x} cy={dot.y} r={20} fill={accent} opacity={draw} />
      </svg>
      {labels.map((label, i) => {
        const p = point(-90 + i * 90);
        return (
          <Rise
            key={label}
            at={at + 0.1 + i * 0.3}
            style={{ position: "absolute", left: p.x - 165, top: p.y - 46, width: 330 }}
          >
            <div
              style={{
                backgroundColor: i === highlight ? accent : C.card,
                color: i === highlight ? "white" : C.heading,
                borderRadius: 999,
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                textAlign: "center",
                fontSize: 40,
                fontWeight: 800,
                padding: "22px 0",
              }}
            >
              {label}
            </div>
          </Rise>
        );
      })}
    </div>
  );
};

export const Loop = () => (
  <Step
    index={5}
    problem={"업무가 바뀌면\n쌓아둔 지식은 낡는다"}
    solution="지식 갱신 워커"
    outcomeLabel="결과"
    outcomeColor={C.blue}
    outcome={"실행 기록이 다음 갱신의 근거가 되는\n순환 구조"}
    outcomeAt={5.4}
  >
    <Ring labels={["에이전트 실행", "실행·조회 기록", "누락·변경 탐지", "지식 갱신"]} at={2.8} highlight={2} />
  </Step>
);

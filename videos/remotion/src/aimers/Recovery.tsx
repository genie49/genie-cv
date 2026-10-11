import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, Rise, Step, useProgress } from "../ui";

const POD_W = 290;
const GAP = 25;

export const Recovery = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dead = useProgress(4.6, 0.5);
  const move = useProgress(5.6, 0.8);
  const beat = 0.6 + 0.4 * Math.abs(Math.sin((frame / fps) * Math.PI * 1.5));

  return (
    <Step
      index={3}
      problem={"실행 중이던 인스턴스가 죽으면\n그 작업은 누가 이어가지?"}
      solution="heartbeat로 세션 인계"
      solutionAt={2.2}
      outcomeLabel="결과"
      outcomeColor={C.blue}
      outcome={"Workflow가 재시작돼도 연결은 유지,\n작업은 다른 Pod가 이어서"}
      outcomeAt={7.0}
    >
      <Rise at={3.0} style={{ position: "relative", height: 420 }}>
        {[0, 1, 2].map((i) => {
          const isDead = i === 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: i * (POD_W + GAP),
                top: 0,
                width: POD_W,
                height: 300,
                borderRadius: 32,
                backgroundColor: C.card,
                border: `4px solid ${isDead && dead > 0.5 ? C.red : "transparent"}`,
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                padding: 28,
                opacity: isDead ? 1 - dead * 0.5 : 1,
              }}
            >
              <div style={{ fontSize: 44, fontWeight: 800 }}>Pod {i + 1}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: isDead && dead > 0.5 ? C.red : C.cyan,
                    scale: isDead && dead > 0.5 ? 1 : beat,
                  }}
                />
                <div style={{ fontSize: 32, fontWeight: 800, color: isDead && dead > 0.5 ? C.red : C.sub }}>
                  {isDead && dead > 0.5 ? "만료" : "heartbeat"}
                </div>
              </div>
            </div>
          );
        })}
        {/* 세션이 Pod 1에서 Pod 2로 넘어간다 */}
        <div
          style={{
            position: "absolute",
            left: 28 + move * (POD_W + GAP),
            top: 180,
            width: POD_W - 56,
            borderRadius: 22,
            backgroundColor: C.cyan,
            color: "white",
            textAlign: "center",
            fontSize: 40,
            fontWeight: 800,
            padding: "20px 0",
          }}
        >
          세션
        </div>
        <div style={{ position: "absolute", left: 0, top: 330, fontSize: 38, fontWeight: 800, color: C.sub }}>
          Redis에 세션별 heartbeat를 주기적으로 기록
        </div>
      </Rise>
    </Step>
  );
};

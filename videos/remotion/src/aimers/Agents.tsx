import { C, Step, useProgress } from "../ui";

const TOOLS = ["기획 도구", "매칭 도구", "가이드 도구", "계약 도구", "실행 기록", "실행 기록", "실행 기록", "지식", "지식"];
const SUBS = ["기획", "매칭", "가이드", "계약"];

export const Agents = () => {
  const single = useProgress(2.9);
  const split = useProgress(4.8, 0.9);
  return (
    <Step
      index={1}
      problem={"업무가 늘자 한 에이전트에\n도구와 기록이 쌓여 판단이 흐려졌다"}
      solution="Supervisor + 서브에이전트"
      solutionAt={2.2}
      outcomeLabel="구조"
      outcome={"서브에이전트는 독립된 컨텍스트에서\n실행하고 최종 결과만 반환"}
      outcomeAt={6.6}
    >
      <div style={{ position: "relative", height: 520 }}>
        {/* 전: 에이전트 하나에 전부 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: single * (1 - split),
            scale: 1 - split * 0.1,
            backgroundColor: C.card,
            borderRadius: 36,
            border: `4px solid ${C.red}`,
            padding: 36,
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 800 }}>에이전트 하나</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 24 }}>
            {TOOLS.map((t, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: C.bg,
                  borderRadius: 18,
                  padding: "16px 26px",
                  fontSize: 38,
                  fontWeight: 800,
                  color: C.body,
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* 후: Supervisor가 업무별 서브에이전트를 호출 */}
        <div style={{ position: "absolute", inset: 0, opacity: split, translate: `0px ${(1 - split) * 30}px` }}>
          <div
            style={{
              margin: "0 auto",
              width: 520,
              backgroundColor: C.cyan,
              color: "white",
              borderRadius: 32,
              padding: "30px 0",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 60, fontWeight: 800 }}>Supervisor</div>
            <div style={{ fontSize: 36, fontWeight: 600 }}>의도 파악 · 작업 배분</div>
          </div>
          <div style={{ textAlign: "center", fontSize: 40, fontWeight: 800, color: C.sub, margin: "20px 0" }}>
            Tool Calling ↓
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {SUBS.map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  backgroundColor: C.card,
                  borderRadius: 28,
                  padding: "28px 0",
                  textAlign: "center",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ fontSize: 46, fontWeight: 800 }}>{s}</div>
                <div style={{ fontSize: 32, fontWeight: 600, color: C.sub, marginTop: 6 }}>Skill</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Step>
  );
};

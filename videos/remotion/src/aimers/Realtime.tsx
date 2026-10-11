import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, Rise, Step, useProgress } from "../ui";

const Box: React.FC<{ name: string; desc: string; color: string; dim?: number }> = ({
  name,
  desc,
  color,
  dim = 0,
}) => (
  <div
    style={{
      backgroundColor: color,
      color: color === C.card ? C.heading : "white",
      borderRadius: 28,
      padding: "26px 40px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      opacity: 1 - dim * 0.65,
    }}
  >
    <div style={{ fontSize: 48, fontWeight: 800 }}>{name}</div>
    <div style={{ fontSize: 36, fontWeight: 600, opacity: 0.85 }}>{desc}</div>
  </div>
);

/** 아래에서 위로 흐르는 메시지 점. active가 0이면 멈춘 것처럼 흐려진다. */
const Flow: React.FC<{ label: string; active?: number }> = ({ label, active = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame / fps) % 1;
  return (
    <div style={{ position: "relative", height: 96, opacity: 0.25 + active * 0.75 }}>
      <div style={{ position: "absolute", left: 80, top: 0, bottom: 0, width: 6, backgroundColor: C.border }} />
      <div
        style={{
          position: "absolute",
          left: 69,
          top: 70 - t * 70,
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: C.cyan,
        }}
      />
      <div style={{ position: "absolute", left: 130, top: 24, fontSize: 38, fontWeight: 800, color: C.sub }}>
        {label}
      </div>
    </div>
  );
};

export const Realtime = () => {
  const left = useProgress(5.6, 0.6);
  return (
    <Step
      index={2}
      problem={"사용자가 접속을 끊어도\nAI 작업은 계속돼야 했다"}
      solution="실행과 연결을 분리"
      solutionAt={2.2}
      outcomeLabel="결과"
      outcomeColor={C.blue}
      outcome={"나가도 작업은 계속,\n접속 중엔 진행 상황을 실시간으로"}
      outcomeAt={7.0}
    >
      <Rise at={4.0}>
        <Box name={left > 0.5 ? "사용자 · 접속 종료" : "사용자"} desc="시간 날 때 잠깐 접속" color={C.card} dim={left} />
        <Flow label="WebSocket" active={1 - left} />
      </Rise>
      <Rise at={3.5}>
        <Box name="Chat 서비스" desc="사용자 연결 중계" color={C.heading} />
        <Flow label="Pub/Sub · 응답 청크, 도구 상태" />
      </Rise>
      <Rise at={3.0}>
        <Box name="Workflow 서비스" desc="에이전트 실행" color={C.cyan} />
      </Rise>
    </Step>
  );
};

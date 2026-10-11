import { AbsoluteFill } from "remotion";
import { C, FONT, Rise, useProgress } from "../ui";

export const Title: React.FC<{
  color?: string;
  period?: string;
  company?: string;
  companySize?: number;
  role?: string;
  summary?: string;
}> = ({
  color = C.orange,
  period = "2026.08 — 현재",
  company = "당근",
  companySize = 260,
  role = "AI Engineer 인턴",
  summary = "팀의 AI 실험과 개발을\n지원하는 백엔드 구축",
}) => {
  const line = useProgress(0.9, 0.8);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        color: "white",
        fontFamily: FONT,
        padding: "150px 90px 170px",
        justifyContent: "center",
      }}
    >
      <Rise at={0.1}>
        <div style={{ fontSize: 48, fontWeight: 600, opacity: 0.85 }}>{period}</div>
      </Rise>
      <Rise at={0.25}>
        <div style={{ fontSize: companySize, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
          {company}
        </div>
      </Rise>
      <Rise at={0.45}>
        <div style={{ fontSize: 64, fontWeight: 800 }}>{role}</div>
      </Rise>
      <div
        style={{
          height: 6,
          width: `${line * 100}%`,
          backgroundColor: "white",
          borderRadius: 3,
          margin: "70px 0",
        }}
      />
      <Rise at={1.2}>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
            whiteSpace: "pre-line",
          }}
        >
          {summary}
        </div>
      </Rise>
    </AbsoluteFill>
  );
};

import { createContext, useContext } from "react";
import type React from "react";
import { loadFont } from "@remotion/google-fonts/Outfit";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily: outfit } = loadFont("normal", {
  weights: ["600", "800"],
  subsets: ["latin"],
});

// ponytail: 한글은 시스템 폰트(Apple SD Gothic Neo)에 기댄다. 맥 밖에서 렌더링하게 되면 Pretendard를 로컬 폰트로 넣기.
export const FONT = `${outfit}, "Apple SD Gothic Neo", sans-serif`;

// 사이트(apps/client/src/styles/global.css)의 토큰과 같은 값
export const C = {
  bg: "#f2f4f6",
  card: "#ffffff",
  heading: "#191f28",
  body: "#4e5968",
  sub: "#8b95a1",
  border: "#e5e8eb",
  blue: "#0064ff",
  orange: "#FF6F0F",
  red: "#f04452",
  cyan: "#0891b2",
  violet: "#7c3aed",
};

/** 영상별 강조색. 사이트 타임라인의 회사 점 색과 맞춘다. */
export const Accent = createContext(C.orange);

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

/** startSec부터 0 → 1 */
export const useProgress = (startSec: number, durSec = 0.6) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [startSec * fps, (startSec + durSec) * fps], [0, 1], {
    ...CLAMP,
    easing: EASE,
  });
};

export const Rise: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at, children, style }) => {
  const p = useProgress(at);
  return (
    <div style={{ opacity: p, translate: `0px ${(1 - p) * 40}px`, ...style }}>
      {children}
    </div>
  );
};

export const Chip: React.FC<{ color: string; children: React.ReactNode }> = ({
  color,
  children,
}) => (
  <div
    style={{
      display: "inline-block",
      backgroundColor: color,
      color: "white",
      fontSize: 36,
      fontWeight: 800,
      padding: "10px 26px",
      borderRadius: 999,
      marginBottom: 18,
    }}
  >
    {children}
  </div>
);

export const TOTAL_STEPS = 5;

/** 한 단계 = 문제 → 해결 → 결과(또는 다음 문제). 아래 칸의 문장이 다음 장면의 문제로 이어진다. */
export const Step: React.FC<{
  index: number;
  problem: string;
  solution: string;
  outcomeLabel: string;
  outcomeColor?: string;
  outcome: React.ReactNode;
  solutionAt?: number;
  outcomeAt: number;
  children: React.ReactNode;
}> = ({
  index,
  problem,
  solution,
  outcomeLabel,
  outcomeColor = C.heading,
  outcome,
  solutionAt = 2.0,
  outcomeAt,
  children,
}) => {
  const accent = useContext(Accent);
  return (
  <AbsoluteFill
    style={{
      backgroundColor: C.bg,
      fontFamily: FONT,
      padding: "100px 80px 120px",
      color: C.heading,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 10,
            borderRadius: 5,
            backgroundColor: i < index ? accent : C.border,
          }}
        />
      ))}
      <div style={{ fontSize: 36, fontWeight: 800, color: C.sub, marginLeft: 12 }}>
        {index} / {TOTAL_STEPS}
      </div>
    </div>

    <Rise at={0.15} style={{ marginTop: 56 }}>
      <Chip color={C.sub}>문제</Chip>
      <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.35, whiteSpace: "pre-line" }}>
        {problem}
      </div>
    </Rise>

    <Rise at={solutionAt} style={{ marginTop: 56 }}>
      <Chip color={accent}>해결</Chip>
      <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
        {solution}
      </div>
    </Rise>

    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {children}
    </div>

    <Rise at={outcomeAt}>
      <Chip color={outcomeColor}>{outcomeLabel}</Chip>
      <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.35, whiteSpace: "pre-line" }}>
        {outcome}
      </div>
    </Rise>
  </AbsoluteFill>
  );
};

export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      backgroundColor: C.card,
      borderRadius: 40,
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      padding: 44,
      ...style,
    }}
  >
    {children}
  </div>
);

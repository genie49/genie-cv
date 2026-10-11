import { useContext } from "react";
import { AbsoluteFill } from "remotion";
import { Accent, C, FONT, Rise } from "../ui";

type OutroStep = { name: string; gain?: string };

const DAANGN: OutroStep[] = [
  { name: "프롬프트 캐싱 최적화" },
  { name: "평가 하네스" },
  { name: "도메인 지식 연결", gain: "통과율 +18%p · 응답 시간 약 50% 단축" },
  { name: "공통 실험 기반" },
  { name: "지식 갱신 워커" },
];

export const Outro: React.FC<{ title?: string; steps?: OutroStep[] }> = ({
  title = "발견한 문제가\n다음 과제가 됐다",
  steps = DAANGN,
}) => {
  const accent = useContext(Accent);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.heading,
        color: "white",
        fontFamily: FONT,
        padding: "130px 80px 140px",
        justifyContent: "center",
      }}
    >
      <Rise at={0.1}>
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            whiteSpace: "pre-line",
          }}
        >
          {title}
        </div>
      </Rise>
      <div style={{ marginTop: 70, display: "flex", flexDirection: "column", gap: 34 }}>
        {steps.map((s, i) => (
          <Rise key={s.name} at={0.8 + i * 0.5} style={{ display: "flex", gap: 30, alignItems: "center" }}>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 38,
                backgroundColor: accent,
                fontSize: 42,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div>
              <div style={{ fontSize: 54, fontWeight: 800 }}>{s.name}</div>
              {s.gain && (
                <div style={{ fontSize: 40, fontWeight: 600, color: "#b0b8c1", marginTop: 4 }}>{s.gain}</div>
              )}
            </div>
          </Rise>
        ))}
      </div>
    </AbsoluteFill>
  );
};

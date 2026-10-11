import { AbsoluteFill } from "remotion";
import { C, FONT, Rise } from "../ui";

const SOURCES = ["웹사이트", "인스타그램", "유튜브", "틱톡"];

export const Why = () => (
  <AbsoluteFill
    style={{
      backgroundColor: C.bg,
      fontFamily: FONT,
      color: C.heading,
      padding: "150px 80px 170px",
      justifyContent: "center",
      gap: 50,
    }}
  >
    <Rise at={0.1}>
      <div style={{ fontSize: 44, fontWeight: 800, color: C.cyan }}>배경</div>
      <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.2, marginTop: 16, letterSpacing: "-0.02em" }}>
        영세 사업자도
        <br />
        전문 지식 없이 캠페인을
      </div>
    </Rise>
    <Rise at={1.0} style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
      {SOURCES.map((s) => (
        <div
          key={s}
          style={{
            backgroundColor: C.card,
            borderRadius: 24,
            padding: "22px 36px",
            fontSize: 46,
            fontWeight: 800,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          {s}
        </div>
      ))}
    </Rise>
    <Rise at={1.7}>
      <div style={{ fontSize: 64, fontWeight: 800, color: C.sub }}>↓</div>
      <div
        style={{
          marginTop: 20,
          backgroundColor: C.cyan,
          color: "white",
          borderRadius: 32,
          padding: "36px 44px",
          fontSize: 54,
          fontWeight: 800,
          lineHeight: 1.35,
        }}
      >
        계정 정보만으로
        <br />
        기획부터 실행까지
      </div>
    </Rise>
  </AbsoluteFill>
);

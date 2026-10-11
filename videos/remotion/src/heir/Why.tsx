import { AbsoluteFill } from "remotion";
import { C, FONT, Rise } from "../ui";

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
      <div style={{ fontSize: 44, fontWeight: 800, color: C.violet }}>배경</div>
      <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.2, marginTop: 16, letterSpacing: "-0.02em" }}>
        발굴한 유물을
        <br />
        데이터베이스로
      </div>
    </Rise>
    <Rise at={1.0}>
      <div
        style={{
          backgroundColor: C.card,
          borderRadius: 32,
          padding: "36px 44px",
          fontSize: 50,
          fontWeight: 800,
          lineHeight: 1.4,
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        학예사는 이미 업무가 많다
      </div>
    </Rise>
    <Rise at={1.8}>
      <div style={{ fontSize: 64, fontWeight: 800, color: C.sub }}>↓</div>
      <div
        style={{
          marginTop: 20,
          backgroundColor: C.violet,
          color: "white",
          borderRadius: 32,
          padding: "36px 44px",
          fontSize: 54,
          fontWeight: 800,
          lineHeight: 1.35,
        }}
      >
        적은 수고로
        <br />
        등록하고 관리할 수 있게
      </div>
    </Rise>
  </AbsoluteFill>
);

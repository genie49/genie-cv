import { C, Step, useProgress } from "../ui";

const Problem: React.FC<{ children: string }> = ({ children }) => (
  <div
    style={{
      flex: 1,
      border: `4px solid ${C.red}`,
      borderRadius: 24,
      padding: "22px 0",
      textAlign: "center",
      fontSize: 42,
      fontWeight: 800,
      backgroundColor: C.card,
    }}
  >
    {children}
  </div>
);

export const Knowledge = () => {
  const problems = useProgress(2.8);
  const answer = useProgress(3.5);
  return (
    <Step
      index={3}
      problem={"① 탐색을 반복하고\n② 분석 기준이 매번 달랐다"}
      solution="도메인 지식 연결"
      solutionAt={2.0}
      outcomeLabel="가설 검증"
      outcome={"일부 질문과 데이터로\nPoC를 돌려 비교했다"}
      outcomeAt={4.8}
    >
      {/* 두 문제가 하나의 해결로 모인다 */}
      <div style={{ display: "flex", gap: 20, opacity: problems }}>
        <Problem>① 탐색 반복</Problem>
        <Problem>② 기준 차이</Problem>
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: 64,
          fontWeight: 800,
          color: C.sub,
          margin: "14px 0",
          opacity: answer,
        }}
      >
        ↓
      </div>
      <div
        style={{
          opacity: answer,
          scale: 0.9 + answer * 0.1,
          backgroundColor: C.orange,
          color: "white",
          borderRadius: 32,
          padding: "40px 0",
          textAlign: "center",
          fontSize: 54,
          fontWeight: 800,
          lineHeight: 1.35,
        }}
      >
        분석에 필요한 도메인 지식을
        <br />
        에이전트에 연결
      </div>
    </Step>
  );
};

import { C, Card, Rise, Step } from "../ui";

const Finding: React.FC<{ children: string }> = ({ children }) => (
  <div
    style={{
      border: `4px solid ${C.red}`,
      borderRadius: 28,
      padding: "22px 34px",
      fontSize: 46,
      fontWeight: 800,
      backgroundColor: C.card,
    }}
  >
    {children}
  </div>
);

export const Harness = () => (
  <Step
    index={2}
    problem={"답변 몇 개, 로그 일부만으로는\n변경 효과를 판단할 수 없었다"}
    solution="평가 하네스 구축"
    outcomeLabel="기록에서 드러난 문제"
    outcomeColor={C.red}
    outcomeAt={5.0}
    outcome={
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Finding>① 데이터를 못 찾아 탐색을 반복</Finding>
        <Finding>② 같은 질문에도 분석 기준이 다름</Finding>
      </div>
    }
  >
    <Rise at={3.0}>
      <Card style={{ padding: "36px 40px" }}>
        <div style={{ fontSize: 46, fontWeight: 800 }}>실제 사용자 질문 × 반복 실행</div>
        <div style={{ display: "flex", gap: 16, marginTop: 26 }}>
          <Pill>답변 품질</Pill>
          <Pill>응답 시간</Pill>
          <Pill>토큰</Pill>
        </div>
      </Card>
    </Rise>
  </Step>
);

const Pill: React.FC<{ children: string }> = ({ children }) => (
  <div
    style={{
      flex: 1,
      textAlign: "center",
      backgroundColor: C.bg,
      borderRadius: 20,
      padding: "20px 0",
      fontSize: 40,
      fontWeight: 800,
    }}
  >
    {children}
  </div>
);

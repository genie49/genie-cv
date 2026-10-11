import { Stat } from "../scenes/Result";
import { C, Rise, Step } from "../ui";

const Method: React.FC<{ children: string }> = ({ children }) => (
  <div
    style={{
      flex: 1,
      backgroundColor: C.card,
      borderRadius: 24,
      padding: "24px 0",
      textAlign: "center",
      fontSize: 44,
      fontWeight: 800,
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    }}
  >
    {children}
  </div>
);

export const Search = () => (
  <Step
    index={5}
    problem={"이 탐색이 정말\n필요한 자료를 찾아주고 있을까?"}
    solution="평가 + 하이브리드 검색"
    solutionAt={2.2}
    outcomeLabel="결과"
    outcomeColor={C.blue}
    outcome={"전문 용어나 보고서 번호처럼\n정확한 일치가 필요한 질문까지"}
    outcomeAt={7.6}
  >
    <Rise at={3.0} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
      <Method>의미 검색</Method>
      <div style={{ fontSize: 50, fontWeight: 800, color: C.sub }}>+</div>
      <Method>BM25</Method>
    </Rise>
    <Stat label="첫 번째 검색 결과 정답률" from={50} to={67} unit="%" digits={0} max={100} delta="+17%p" at={4.0} />
  </Step>
);

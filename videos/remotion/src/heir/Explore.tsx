import { C, Card, Rise, Step } from "../ui";

const Tile: React.FC<{ at: number; children: string }> = ({ at, children }) => (
  <Rise at={at} style={{ width: "calc(50% - 9px)" }}>
    <div
      style={{
        backgroundColor: C.bg,
        borderRadius: 22,
        padding: "34px 0",
        textAlign: "center",
        fontSize: 42,
        fontWeight: 800,
      }}
    >
      {children}
    </div>
  </Rise>
);

export const Explore = () => (
  <Step
    index={4}
    problem={"데이터가 생겨도 연구자가\n직접 찾고 검토할 수 있어야 했다"}
    solution="출처·이미지·지도를 함께"
    solutionAt={2.2}
    outcomeLabel="다음 질문"
    outcome={"이 탐색이 정말\n필요한 자료를 찾아주고 있을까?"}
    outcomeAt={7.2}
  >
    <Rise at={3.0}>
      <Card style={{ padding: 36 }}>
        <div style={{ fontSize: 44, fontWeight: 800 }}>에이전트의 답변</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 24 }}>
          <Tile at={3.5}>원문 출처</Tile>
          <Tile at={3.9}>유물 이미지</Tile>
          <Tile at={4.3}>유사 이미지 검색</Tile>
          <Tile at={4.7}>발굴지 지도</Tile>
        </div>
      </Card>
    </Rise>
    <Rise at={5.6} style={{ marginTop: 26 }}>
      <div
        style={{
          backgroundColor: C.violet,
          color: "white",
          borderRadius: 28,
          padding: "26px 36px",
          fontSize: 44,
          fontWeight: 800,
        }}
      >
        보고 있는 지도 영역 → 검색 조건
      </div>
    </Rise>
  </Step>
);

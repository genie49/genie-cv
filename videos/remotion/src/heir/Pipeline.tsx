import { C, Rise, Step, useProgress } from "../ui";

const Worker: React.FC<{ name: string; desc: string; hot?: boolean; children?: React.ReactNode }> = ({
  name,
  desc,
  hot,
  children,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: hot ? C.violet : C.card,
      color: hot ? "white" : C.heading,
      borderRadius: 28,
      padding: "26px 40px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    }}
  >
    <div>
      <div style={{ fontSize: 48, fontWeight: 800 }}>{name}</div>
      <div style={{ fontSize: 36, fontWeight: 600, opacity: 0.8 }}>{desc}</div>
    </div>
    {children}
  </div>
);

const Queue = () => (
  <div style={{ textAlign: "center", fontSize: 38, fontWeight: 800, color: C.sub, margin: "10px 0" }}>↓ 큐</div>
);

const Replica: React.FC<{ at: number }> = ({ at }) => {
  const p = useProgress(at, 0.4);
  return (
    <div
      style={{
        width: 70,
        height: 70,
        borderRadius: 18,
        backgroundColor: "white",
        opacity: p,
        scale: 0.6 + p * 0.4,
      }}
    />
  );
};

export const Pipeline = () => (
  <Step
    index={3}
    problem={"보고서 7,000건이 이미지 PDF,\nAI가 읽을 수 없었다"}
    solution="파이프라인 + OCR 서빙"
    solutionAt={2.2}
    outcomeLabel="운영"
    outcome={"중단돼도 재개 지점부터,\n실패는 재시도하고 중복 적재는 방지"}
    outcomeAt={7.2}
  >
    <Rise at={3.0}>
      <Worker name="수집" desc="보고서 PDF" />
      <Queue />
    </Rise>
    <Rise at={3.5}>
      <Worker name="OCR" desc="GPU 서버 · vLLM 수평 확장" hot>
        <div style={{ display: "flex", gap: 12 }}>
          <Replica at={3.6} />
          <Replica at={5.2} />
          <Replica at={5.5} />
        </div>
      </Worker>
      <Queue />
    </Rise>
    <Rise at={4.0}>
      <Worker name="벡터화" desc="청크 분할 · 임베딩 · 검색 DB 적재" />
    </Rise>
  </Step>
);

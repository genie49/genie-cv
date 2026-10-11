import { useContext } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Accent, Box, C, Card, Down, Rise, Step, useProgress } from "../ui";

const Event: React.FC<{ at: number; children: string }> = ({ at, children }) => {
  const accent = useContext(Accent);
  const p = useProgress(at, 0.5);
  return (
    <div
      style={{
        opacity: p,
        translate: `${(1 - p) * -60}px 0px`,
        borderLeft: `10px solid ${accent}`,
        backgroundColor: C.bg,
        borderRadius: 16,
        padding: "20px 30px",
        fontSize: 42,
        fontWeight: 800,
        marginTop: 16,
      }}
    >
      {children}
    </div>
  );
};

export const Streaming = () => (
  <Step
    index={1}
    problem={"응답이 완성될 때까지\n사용자가 기다려야 했다"}
    solution="SSE 스트리밍 규약"
    solutionAt={2.2}
    outcomeLabel="결과"
    outcomeColor={C.blue}
    outcome={"에이전트가 지금 무엇을 하는지\n화면에 실시간으로 보인다"}
    outcomeAt={7.0}
  >
    <Rise at={3.0}>
      <Card style={{ padding: 36 }}>
        <div style={{ fontSize: 44, fontWeight: 800 }}>AI 백엔드 → 프론트엔드</div>
        <Event at={3.6}>생성 중인 텍스트</Event>
        <Event at={4.2}>도구 실행 상태</Event>
        <Event at={4.8}>인용 출처</Event>
      </Card>
    </Rise>
    <Rise at={5.6} style={{ marginTop: 24 }}>
      <div style={{ fontSize: 40, fontWeight: 800, color: C.sub }}>대기와 실행 상태를 구분해 표시</div>
    </Rise>
  </Step>
);

export const KnowledgeFirst = () => {
  const web = useProgress(5.4, 0.5);
  return (
    <Step
      index={2}
      problem={"최신 정보가 필요하지만\n외부 호출 비용은 제한돼 있었다"}
      solution="저장된 지식 먼저"
      solutionAt={2.2}
      outcomeLabel="결과"
      outcomeColor={C.blue}
      outcome={"최신 정보를 주면서\n반복적인 외부 검색을 줄였다"}
      outcomeAt={7.0}
    >
      <Rise at={3.0}>
        <Box name="매일 수집" desc="경제 뉴스 · 시장 데이터 → 검색 가능한 지식" />
        <Down />
      </Rise>
      <Rise at={3.8}>
        <Box name="지식으로 답할 수 있나?" desc="먼저 판단" tone="accent" />
        <Down>부족할 때만</Down>
      </Rise>
      <Rise at={4.8}>
        <Box name="웹 검색" desc="보완용" tone="dark" style={{ opacity: 0.45 + web * 0.55 }} />
      </Rise>
    </Step>
  );
};

const PRICE = [300, 250, 270, 190, 220, 140, 170, 90, 120, 60];
const path = (ys: number[]) => ys.map((y, i) => `${i === 0 ? "M" : "L"} ${40 + i * 88} ${y}`).join(" ");

export const Chart = () => {
  const accent = useContext(Accent);
  const price = useProgress(3.2, 1.2);
  const indicator = useProgress(5.0, 1.0);
  return (
    <Step
      index={3}
      problem={"긴 글만으로는 초보자가\n분석을 이해하기 어려웠다"}
      solution="에이전트가 차트를 조작"
      solutionAt={2.2}
      outcomeLabel="다음 문제"
      outcomeColor={C.red}
      outcome={"그래도 지표의 개념 자체가\n낯설 수 있었다"}
      outcomeAt={7.2}
    >
      <Rise at={3.0}>
        <Card style={{ padding: 30 }}>
          <svg width={860} height={360}>
            <path
              d={path(PRICE)}
              fill="none"
              stroke={C.heading}
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - price}
            />
            {/* 에이전트가 추가한 지표 */}
            <path
              d={path(PRICE.map((y, i) => 290 - i * 20 + (y - 180) * 0.15))}
              fill="none"
              stroke={accent}
              strokeWidth={8}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - indicator}
            />
          </svg>
          <div
            style={{
              display: "inline-block",
              opacity: indicator,
              backgroundColor: accent,
              color: "white",
              borderRadius: 999,
              padding: "12px 30px",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            + 지표 추가
          </div>
        </Card>
      </Rise>
      <Rise at={6.2} style={{ marginTop: 22 }}>
        <div style={{ fontSize: 40, fontWeight: 800, color: C.sub }}>명령은 완성된 시점에 한 번에 반영</div>
      </Rise>
    </Step>
  );
};

export const Learn = () => {
  const accent = useContext(Accent);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 채팅과 교육 사이를 2초에 한 번 오간다
  const t = (1 - Math.cos((Math.max(0, frame - 4 * fps) / fps) * Math.PI)) / 2;
  return (
    <Step
      index={4}
      problem={"차트를 봐도 지표의 개념 자체가\n낯설 수 있었다"}
      solution="채팅 ↔ 교육 연결"
      solutionAt={2.2}
      outcomeLabel="결과"
      outcomeColor={C.blue}
      outcome={"배운 내용을 실제 투자 정보에\n바로 적용"}
      outcomeAt={7.0}
    >
      <Rise at={3.0} style={{ position: "relative", height: 420 }}>
        <Box name="AI 채팅" desc="분석 중 모르는 개념" tone="dark" style={{ position: "absolute", left: 0, right: 0, top: 0 }} />
        <Box name="투자 교육" desc="배우고 다시 질문" style={{ position: "absolute", left: 0, right: 0, bottom: 0 }} />
        <div style={{ position: "absolute", left: 100, top: 150, bottom: 150, width: 6, backgroundColor: C.border }} />
        <div
          style={{
            position: "absolute",
            left: 81,
            top: 150 + t * 76,
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: accent,
          }}
        />
      </Rise>
    </Step>
  );
};

export const Ops = () => (
  <Step
    index={5}
    problem={"무료 티어에서는 5초 넘는\n요청이 끊겼다"}
    solution="중계 서버 분리 · 배포 표준화"
    solutionAt={2.2}
    outcomeLabel="결과"
    outcomeColor={C.blue}
    outcome={"환경을 여러 번 옮겨도\n같은 절차로 배포"}
    outcomeAt={7.2}
  >
    <Rise at={3.0}>
      <Box name="프론트엔드" desc="5초 이상 요청은 끊김" style={{ border: `4px solid ${C.red}` }} />
      <Down>SSE</Down>
    </Rise>
    <Rise at={3.8}>
      <Box name="AI 응답 중계 서버" desc="FastAPI로 분리" tone="accent" />
    </Rise>
    <Rise at={5.2} style={{ marginTop: 30 }}>
      <Box name="Docker/Compose · SSM" desc="GitHub Actions가 같은 절차로 배포" tone="dark" />
    </Rise>
  </Step>
);

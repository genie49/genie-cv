import { useContext } from "react";
import { Accent, Box, C, Card, Down, Rise, Step, useProgress } from "../ui";

const Chip: React.FC<{ children: string; tone?: string }> = ({ children, tone = C.bg }) => (
  <div
    style={{
      backgroundColor: tone,
      color: tone === C.bg ? C.body : "white",
      borderRadius: 18,
      padding: "18px 28px",
      fontSize: 40,
      fontWeight: 800,
    }}
  >
    {children}
  </div>
);

export const Migration = () => {
  const accent = useContext(Accent);
  const split = useProgress(4.8, 0.9);
  return (
    <Step
      index={1}
      problem={"PHP 파일에 SQL·HTML·JS가 섞여\n오류 추적과 변경이 어려웠다"}
      solution="Next.js 마이그레이션"
      solutionAt={2.2}
      outcomeLabel="다음 문제"
      outcomeColor={C.red}
      outcome={"코드는 옮겼지만\n기존 학습 기록도 이어가야 했다"}
      outcomeAt={7.0}
    >
      <Rise at={3.0} style={{ position: "relative", height: 380 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 1 - split,
            scale: 1 - split * 0.1,
            backgroundColor: C.card,
            border: `4px solid ${C.red}`,
            borderRadius: 36,
            padding: 36,
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 800 }}>PHP 파일 하나</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 24 }}>
            <Chip>SQL</Chip>
            <Chip>HTML</Chip>
            <Chip>JavaScript</Chip>
            <Chip>전역 상태</Chip>
            <Chip>직접 DOM 조작</Chip>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: split,
            translate: `0px ${(1 - split) * 30}px`,
            display: "flex",
            flexWrap: "wrap",
            gap: 18,
            alignContent: "center",
          }}
        >
          {["컴포넌트", "컴포넌트", "컴포넌트", "컴포넌트"].map((c, i) => (
            <div
              key={i}
              style={{
                width: "calc(50% - 9px)",
                backgroundColor: i === 0 ? accent : C.card,
                color: i === 0 ? "white" : C.heading,
                borderRadius: 28,
                padding: "44px 0",
                textAlign: "center",
                fontSize: 46,
                fontWeight: 800,
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </Rise>
    </Step>
  );
};

const ORGS = ["A 기관", "B 기관", "C 기관"];

export const Schema = () => {
  const accent = useContext(Accent);
  const merge = useProgress(4.6, 0.9);
  return (
    <Step
      index={2}
      problem={"같은 데이터가 기관별 테이블로\n나뉘어 있었다"}
      solution="공통 테이블로 통합"
      solutionAt={2.2}
      outcomeLabel="결과"
      outcomeColor={C.blue}
      outcome={"기관이 늘어도 별도 처리 없이\n통합 조회, 학습 기록도 그대로"}
      outcomeAt={7.2}
    >
      <Rise at={3.0} style={{ position: "relative", height: 420 }}>
        {ORGS.map((org, i) => (
          <div
            key={org}
            style={{
              position: "absolute",
              left: i * 310 + (310 - i * 310) * merge,
              top: 0 + 130 * merge,
              width: 290,
              opacity: 1 - merge,
              backgroundColor: C.card,
              borderRadius: 24,
              padding: "26px 0",
              textAlign: "center",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 42, fontWeight: 800 }}>{org}</div>
            <div style={{ fontSize: 34, fontWeight: 600, color: C.sub }}>전용 테이블</div>
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 60,
            opacity: merge,
            scale: 0.85 + merge * 0.15,
            backgroundColor: accent,
            color: "white",
            borderRadius: 32,
            padding: "40px 44px",
          }}
        >
          <div style={{ fontSize: 56, fontWeight: 800 }}>공통 테이블</div>
          <div style={{ fontSize: 40, fontWeight: 600, marginTop: 6 }}>기관 식별자를 컬럼으로</div>
        </div>
        <div style={{ position: "absolute", left: 0, top: 330, fontSize: 38, fontWeight: 800, color: C.sub }}>
          EUC-KR 데이터를 변환해 MySQL 8.x로 이전
        </div>
      </Rise>
    </Step>
  );
};

const WORDS = ["apple", "journey", "curious", "harvest"];

export const Tts = () => {
  const accent = useContext(Accent);
  const on = useProgress(4.8, 0.8);
  return (
    <Step
      index={3}
      problem={"성우가 녹음한 일부 단어만\n발음을 들을 수 있었다"}
      solution="Google Cloud TTS 도입"
      solutionAt={2.2}
      outcomeLabel="다음 문제"
      outcomeColor={C.red}
      outcome={"그런데 재생할 때마다 합성하면\n대기 시간과 비용이 든다"}
      outcomeAt={7.0}
    >
      <Rise at={3.0}>
        <Card style={{ padding: "20px 40px" }}>
          {WORDS.map((w, i) => {
            const lit = i === 0 ? 1 : on;
            return (
              <div
                key={w}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 0",
                  borderTop: i ? `2px solid ${C.border}` : undefined,
                  fontSize: 48,
                  fontWeight: 800,
                }}
              >
                {w}
                <div
                  style={{
                    backgroundColor: lit > 0.5 ? accent : C.bg,
                    color: lit > 0.5 ? "white" : C.sub,
                    borderRadius: 999,
                    padding: "10px 28px",
                    fontSize: 36,
                  }}
                >
                  {lit > 0.5 ? "발음 듣기" : "음성 없음"}
                </div>
              </div>
            );
          })}
        </Card>
      </Rise>
    </Step>
  );
};

export const Cache = () => {
  const first = useProgress(3.8, 0.4);
  const second = useProgress(4.6, 0.4);
  const third = useProgress(5.4, 0.4);
  return (
    <Step
      index={4}
      problem={"재생할 때마다 합성하면\n대기 시간과 비용이 든다"}
      solution="3단계 음성 캐시"
      solutionAt={2.2}
      outcomeLabel="결과"
      outcomeColor={C.blue}
      outcome={"단어장이 달라도 같은 단어는\n기존 음성을 재사용"}
      outcomeAt={7.2}
    >
      <Rise at={3.0}>
        <Box name="① 브라우저 IndexedDB" desc="먼저 찾는다" tone="accent" style={{ opacity: 0.4 + first * 0.6 }} />
        <Down>없으면</Down>
        <Box name="② S3" desc="저장된 음성 조회" style={{ opacity: 0.4 + second * 0.6 }} />
        <Down>둘 다 없을 때만</Down>
        <Box name="③ 합성 후 저장" desc="Google Cloud TTS" tone="dark" style={{ opacity: 0.4 + third * 0.6 }} />
      </Rise>
      <Rise at={6.2} style={{ marginTop: 22 }}>
        <div style={{ fontSize: 38, fontWeight: 800, color: C.sub }}>캐시 키 = 텍스트 · 언어 · 음성 유형</div>
      </Rise>
    </Step>
  );
};

export const Teachers = () => {
  const flag = useProgress(4.8, 0.6);
  return (
    <Step
      index={5}
      problem={"선생님이 학생별 학습 기록을\n일일이 확인해야 했다"}
      solution="이상 징후 학생을 먼저"
      solutionAt={2.2}
      outcomeLabel="성과"
      outcomeColor={C.blue}
      outcome={"학원·지역아동센터·학교 등 10여 곳 납품,\n학교 수행평가에도 활용"}
      outcomeAt={7.4}
    >
      <Rise at={3.0}>
        <Card style={{ padding: 36 }}>
          <div style={{ fontSize: 44, fontWeight: 800 }}>학생 학습 현황</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 26 }}>
            {Array.from({ length: 12 }, (_, i) => {
              const hot = i === 4 || i === 9;
              return (
                <div
                  key={i}
                  style={{
                    width: 114,
                    height: 114,
                    borderRadius: 57,
                    backgroundColor: hot && flag > 0.5 ? C.red : C.bg,
                    scale: hot ? 1 + Math.sin(flag * Math.PI) * 0.15 : 1,
                  }}
                />
              );
            })}
          </div>
        </Card>
      </Rise>
      <Rise at={6.0} style={{ marginTop: 24 }}>
        <Box name="LLM 학습 콘텐츠 생성" desc="콘텐츠 제작 부담도 줄임" tone="accent" />
      </Rise>
    </Step>
  );
};

import { Outro } from "../scenes/Outro";
import { Title } from "../scenes/Title";
import { Background, C, Short } from "../ui";
import { Chart, KnowledgeFirst, Learn, Ops, Streaming } from "./scenes";

// 전체 1767프레임. 장면 길이를 바꾸면 Root.tsx의 durationInFrames도 같이 바꾼다.
export const FingooShort = () => (
  <Short
    accent={C.rose}
    scenes={[
      {
        name: "Title",
        frames: 105,
        node: (
          <Title
            color={C.rose}
            period="2024.12 — 2026.03"
            company="핀구"
            role="AI/프론트엔드 개발"
            summary={"투자 학습과 AI 분석을\n연결하는 실시간 서비스"}
          />
        ),
      },
      {
        name: "Why",
        frames: 130,
        node: (
          <Background
            title={"투자 초보자도\n전문 지식 없이"}
            situation="제한된 운영비, 무료 티어"
            goal={"탐색하고, 이해하고,\n배울 수 있게"}
          />
        ),
      },
      { name: "Streaming", frames: 290, node: <Streaming /> },
      { name: "KnowledgeFirst", frames: 290, node: <KnowledgeFirst /> },
      { name: "Chart", frames: 290, node: <Chart /> },
      { name: "Learn", frames: 290, node: <Learn /> },
      { name: "Ops", frames: 290, node: <Ops /> },
      {
        name: "Outro",
        frames: 180,
        node: (
          <Outro
            title={"초보자도 이해하는\n투자 분석"}
            steps={[
              { name: "SSE 스트리밍 규약" },
              { name: "저장된 지식 우선 검색" },
              { name: "에이전트의 차트 조작" },
              { name: "채팅 ↔ 교육 연결" },
              { name: "중계 서버 · 배포 표준화" },
            ]}
          />
        ),
      },
    ]}
  />
);

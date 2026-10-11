import { Outro } from "../scenes/Outro";
import { Title } from "../scenes/Title";
import { Background, C, Short } from "../ui";
import { Cache, Migration, Schema, Teachers, Tts } from "./scenes";

// 전체 1767프레임. 장면 길이를 바꾸면 Root.tsx의 durationInFrames도 같이 바꾼다.
export const KkumdamgilShort = () => (
  <Short
    accent={C.emerald}
    scenes={[
      {
        name: "Title",
        frames: 105,
        node: (
          <Title
            color={C.emerald}
            period="2021.02 — 2023.04 · 2024.11 — 2025.08"
            company="꿈담길"
            role="풀스택 개발 · 보카톡톡"
            summary={"레거시 학습 플랫폼 개편과\n교육 현장 사용성 개선"}
          />
        ),
      },
      {
        name: "Why",
        frames: 130,
        node: (
          <Background
            title={"학원과 학교가 쓰는\n영어 학습 서비스"}
            situation="오래된 PHP, 기관별로 나뉜 DB"
            goal={"기존 학습 기록은\n그대로 이어서"}
          />
        ),
      },
      { name: "Migration", frames: 290, node: <Migration /> },
      { name: "Schema", frames: 290, node: <Schema /> },
      { name: "Tts", frames: 290, node: <Tts /> },
      { name: "Cache", frames: 290, node: <Cache /> },
      { name: "Teachers", frames: 290, node: <Teachers /> },
      {
        name: "Outro",
        frames: 180,
        node: (
          <Outro
            title={"현장의 불편을\n기능으로"}
            steps={[
              { name: "Next.js 마이그레이션" },
              { name: "공통 테이블 통합" },
              { name: "Google Cloud TTS 도입" },
              { name: "3단계 음성 캐시" },
              { name: "교사 관리 화면 · LLM 콘텐츠", gain: "10여 곳 납품 · 학교 수행평가 활용" },
            ]}
          />
        ),
      },
    ]}
  />
);

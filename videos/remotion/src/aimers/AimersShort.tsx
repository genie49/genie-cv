import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { Easing, useVideoConfig } from "remotion";
import { Outro } from "../scenes/Outro";
import { Title } from "../scenes/Title";
import { Accent, C } from "../ui";
import { Agents } from "./Agents";
import { AgentsResult } from "./AgentsResult";
import { Realtime } from "./Realtime";
import { Recovery } from "./Recovery";
import { Review } from "./Review";
import { Trend } from "./Trend";
import { Why } from "./Why";

export const AimersShort = () => {
  const { fps } = useVideoConfig();
  return (
    <Accent.Provider value={C.cyan}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Title" durationInFrames={105} premountFor={fps}>
          <Title color={C.cyan} period="2025.09 — 2026.07" company="아이머스" companySize={200} role="백엔드/AI 엔지니어" summary={"캠페인 기획과 실행을\n자동화하는 AI 플랫폼"} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
        <TransitionSeries.Sequence name="Why" durationInFrames={130} premountFor={fps}>
          <Why />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
        <TransitionSeries.Sequence name="Agents" durationInFrames={290} premountFor={fps}>
          <Agents />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
        <TransitionSeries.Sequence name="AgentsResult" durationInFrames={250} premountFor={fps}>
          <AgentsResult />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
        <TransitionSeries.Sequence name="Realtime" durationInFrames={300} premountFor={fps}>
          <Realtime />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
        <TransitionSeries.Sequence name="Recovery" durationInFrames={300} premountFor={fps}>
          <Recovery />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
        <TransitionSeries.Sequence name="Trend" durationInFrames={280} premountFor={fps}>
          <Trend />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
        <TransitionSeries.Sequence name="Review" durationInFrames={290} premountFor={fps}>
          <Review />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
        <TransitionSeries.Sequence name="Outro" durationInFrames={180} premountFor={fps}>
          <Outro
          title={"기획부터 실행까지\n자동으로"}
          steps={[
            { name: "Supervisor + 서브에이전트", gain: "컨텍스트 15~25k · 비용 약 30% 절감" },
            { name: "실행과 연결 분리" },
            { name: "heartbeat 세션 인계" },
            { name: "실험 기반 트렌드 탐지", gain: "하루 만에 목표 재현율 상회" },
            { name: "승인 단계가 있는 콘텐츠 생성" },
          ]}
        />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </Accent.Provider>
  );
};

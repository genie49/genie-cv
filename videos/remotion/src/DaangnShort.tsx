import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { Easing, useVideoConfig } from "remotion";
import { Title } from "./scenes/Title";
import { Why } from "./scenes/Why";
import { Caching } from "./scenes/Caching";
import { Harness } from "./scenes/Harness";
import { Knowledge } from "./scenes/Knowledge";
import { Result } from "./scenes/Result";
import { Platform } from "./scenes/Platform";
import { Loop } from "./scenes/Loop";
import { Outro } from "./scenes/Outro";

// 아래에서 위로 밀어 올려, 앞 장면 맨 아래의 문장이 다음 장면의 문제로 이어지게 한다
export const DaangnShort = () => {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Title" durationInFrames={105} premountFor={fps}>
        <Title />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
      <TransitionSeries.Sequence name="Why" durationInFrames={120} premountFor={fps}>
        <Why />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
      <TransitionSeries.Sequence name="Caching" durationInFrames={260} premountFor={fps}>
        <Caching />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
      <TransitionSeries.Sequence name="Harness" durationInFrames={250} premountFor={fps}>
        <Harness />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
      <TransitionSeries.Sequence name="Knowledge" durationInFrames={230} premountFor={fps}>
        <Knowledge />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
      <TransitionSeries.Sequence name="Result" durationInFrames={230} premountFor={fps}>
        <Result />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
      <TransitionSeries.Sequence name="Platform" durationInFrames={300} premountFor={fps}>
        <Platform />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
      <TransitionSeries.Sequence name="Loop" durationInFrames={250} premountFor={fps}>
        <Loop />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
      <TransitionSeries.Sequence name="Outro" durationInFrames={170} premountFor={fps}>
        <Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

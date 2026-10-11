import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { Easing, useVideoConfig } from "remotion";
import { Outro } from "../scenes/Outro";
import { Title } from "../scenes/Title";
import { Accent, C } from "../ui";
import { Explore } from "./Explore";
import { Pipeline } from "./Pipeline";
import { PipelineResult } from "./PipelineResult";
import { Reports } from "./Reports";
import { Search } from "./Search";
import { Upload } from "./Upload";
import { Why } from "./Why";

export const HeirShort = () => {
  const { fps } = useVideoConfig();
  return (
    <Accent.Provider value={C.violet}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Title" durationInFrames={105} premountFor={fps}>
          <Title color={C.violet} period="2026.01 — 현재" company="HEIR" role="개발 리드 · 한양대 박물관 협력" summary={"학예 업무와 고고학 연구를\n지원하는 AI 서비스"} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
        <TransitionSeries.Sequence name="Why" durationInFrames={130} premountFor={fps}>
          <Why />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
        <TransitionSeries.Sequence name="Upload" durationInFrames={300} premountFor={fps}>
          <Upload />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
        <TransitionSeries.Sequence name="Reports" durationInFrames={300} premountFor={fps}>
          <Reports />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
        <TransitionSeries.Sequence name="Pipeline" durationInFrames={300} premountFor={fps}>
          <Pipeline />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
        <TransitionSeries.Sequence name="PipelineResult" durationInFrames={250} premountFor={fps}>
          <PipelineResult />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
        <TransitionSeries.Sequence name="Explore" durationInFrames={300} premountFor={fps}>
          <Explore />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
        <TransitionSeries.Sequence name="Search" durationInFrames={310} premountFor={fps}>
          <Search />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 14, easing: Easing.bezier(0.65, 0, 0.35, 1) })} />
        <TransitionSeries.Sequence name="Outro" durationInFrames={180} premountFor={fps}>
          <Outro
          steps={[
            { name: "이미지 업로드로 유물 등록" },
            { name: "보고서를 에이전트의 지식으로", gain: "100건 실험 → 7,000건으로 확대" },
            { name: "파이프라인 · OCR 서빙", gain: "처리량 1.62배 · 한 달 → 일주일" },
            { name: "출처·이미지·지도 탐색" },
            { name: "평가 · 하이브리드 검색", gain: "첫 결과 정답률 50% → 67%" },
          ]}
        />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </Accent.Provider>
  );
};

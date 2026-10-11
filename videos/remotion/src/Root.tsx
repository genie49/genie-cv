import { Composition, Folder } from "remotion";
import { AimersShort } from "./aimers/AimersShort";
import { DaangnShort } from "./DaangnShort";
import { HeirShort } from "./heir/HeirShort";
import { Title } from "./scenes/Title";
import { Why } from "./scenes/Why";
import { Caching } from "./scenes/Caching";
import { Harness } from "./scenes/Harness";
import { Knowledge } from "./scenes/Knowledge";
import { Result } from "./scenes/Result";
import { Platform } from "./scenes/Platform";
import { Loop } from "./scenes/Loop";
import { Outro } from "./scenes/Outro";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Scenes">
        <Composition id="Title" component={Title} width={1080} height={1920} fps={30} durationInFrames={105} />
        <Composition id="Why" component={Why} width={1080} height={1920} fps={30} durationInFrames={120} />
        <Composition id="Caching" component={Caching} width={1080} height={1920} fps={30} durationInFrames={260} />
        <Composition id="Harness" component={Harness} width={1080} height={1920} fps={30} durationInFrames={250} />
        <Composition id="Knowledge" component={Knowledge} width={1080} height={1920} fps={30} durationInFrames={230} />
        <Composition id="Result" component={Result} width={1080} height={1920} fps={30} durationInFrames={230} />
        <Composition id="Platform" component={Platform} width={1080} height={1920} fps={30} durationInFrames={300} />
        <Composition id="Loop" component={Loop} width={1080} height={1920} fps={30} durationInFrames={250} />
        <Composition id="Outro" component={Outro} width={1080} height={1920} fps={30} durationInFrames={170} />
      </Folder>
      {/* 장면 합 1915프레임 - 전환 14프레임 × 8 */}
      <Composition id="DaangnShort" component={DaangnShort} width={1080} height={1920} fps={30} durationInFrames={1803} />
      {/* 장면 합 2125프레임 - 전환 14프레임 × 8 */}
      <Composition id="AimersShort" component={AimersShort} width={1080} height={1920} fps={30} durationInFrames={2013} />
      {/* 장면 합 2175프레임 - 전환 14프레임 × 8 */}
      <Composition id="HeirShort" component={HeirShort} width={1080} height={1920} fps={30} durationInFrames={2063} />
    </>
  );
};

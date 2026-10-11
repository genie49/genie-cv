import { C, Step } from "../ui";
import { Ring } from "../scenes/Loop";

export const Trend = () => (
  <Step
    index={4}
    problem={"트렌드 탐지 방법, 아이디어는 많은데\n고를 근거가 없었다"}
    solution="먼저 구현하고 실험"
    solutionAt={2.2}
    outcomeLabel="결과"
    outcomeColor={C.blue}
    outcome={"하루 만에 목표 재현율을\n넘는 방식을 찾았다"}
    outcomeAt={6.4}
  >
    <Ring labels={["구현", "평가셋으로 평가", "지표·실패 기록", "다음 가설"]} at={3.0} highlight={1} />
  </Step>
);

import { useState } from "react";
import { motion } from "motion/react";
import profileData from "@data/profile.json";

const profile = {
  ...profileData,
  experience: profileData.experience as Array<{
    title: string;
    company: string;
    period: string;
    type: string;
    description: string;
  }>,
};

const BAR_COLORS: Record<string, string> = {
  아이머스: "bg-cyan-600",
  핀구: "bg-violet-600",
  스톰스터디: "bg-emerald-600",
  헬프터: "bg-amber-600",
  "대한민국 육군": "bg-zinc-500",
};
const DEFAULT_BAR_COLOR = "bg-toss-heading";

// 간트 차트에서 같은 행에 표시할 회사 그룹 (key: 행 라벨, values: 포함할 회사들)
const ROW_GROUPS: Record<string, string[]> = {
  "스톰스터디/헬프터": ["스톰스터디", "헬프터"],
};

function monthIndex(ym: string) {
  const [y, m] = ym.split(".").map(Number);
  return (y - 2021) * 12 + (m - 1);
}

function parseBar(period: string) {
  const [start, end] = period.split(" ~ ");
  const s = monthIndex(start);
  const e = monthIndex(end);
  return { left: (s / 72) * 100, width: ((e - s + 1) / 72) * 100 };
}

const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];

export default function ExperiencePanel({ bare }: { bare?: boolean }) {
  const [flipped, setFlipped] = useState(false);

  if (bare) {
    return (
      <div className="flex flex-col gap-3">
        {profile.experience.map((exp) => (
          <div key={`${exp.company}-${exp.period}`} className="flex items-start justify-between">
            <div>
              <p className="text-[13px] font-medium text-toss-heading">{exp.title}</p>
              <p className="text-xs text-toss-body">{exp.company}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-xs text-toss-sub">{exp.period}</span>
              <span className="rounded bg-toss-bg px-1.5 py-0.5 text-[10px] text-toss-sub">{exp.type}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="cursor-pointer"
      style={{ perspective: 1200 }}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front — List */}
        <div
          className="rounded-2xl bg-toss-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-['Outfit'] text-base font-bold text-toss-heading">
              Experience
            </h2>
            <span className="rounded-md bg-toss-bg px-2.5 py-0.5 text-[10px] font-medium text-toss-sub">
              클릭하여 타임라인 보기
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {profile.experience.map((exp) => (
              <div
                key={`${exp.company}-${exp.period}`}
                className="flex items-start justify-between"
              >
                <div>
                  <p className="text-[13px] font-medium text-toss-heading">
                    {exp.title}
                  </p>
                  <p className="text-xs text-toss-body">{exp.company}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-xs text-toss-sub">{exp.period}</span>
                  <span className="rounded bg-toss-bg px-1.5 py-0.5 text-[10px] text-toss-sub">
                    {exp.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back — Gantt */}
        <div
          className="absolute inset-0 rounded-2xl bg-toss-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-['Outfit'] text-base font-bold text-toss-heading">
              Experience
            </h2>
            <span className="rounded-md bg-toss-bg px-2.5 py-0.5 text-[10px] font-medium text-toss-sub">
              클릭하여 목록 보기
            </span>
          </div>

          {/* Year axis */}
          <div className="mb-1 ml-[100px]">
            <div className="flex">
              {YEARS.map((y) => (
                <span
                  key={y}
                  className="flex-1 text-[10px] font-medium text-toss-sub"
                >
                  {y}
                </span>
              ))}
            </div>
          </div>

          {/* Bars — 같은 회사/그룹은 한 행에 합침 */}
          <div className="flex flex-col gap-2">
            {(() => {
              const grouped = new Map<string, { company: string; period: string }[]>();
              const assigned = new Set<string>();
              for (const exp of profile.experience) {
                // 이미 다른 그룹에 할당된 회사는 스킵
                if (assigned.has(exp.company)) {
                  grouped.get(
                    [...grouped.keys()].find((k) =>
                      ROW_GROUPS[k]?.includes(exp.company) || k === exp.company,
                    )!,
                  )!.push({ company: exp.company, period: exp.period });
                  continue;
                }
                // 그룹의 대표 회사인지 확인
                const groupLabel = Object.keys(ROW_GROUPS).find((k) =>
                  ROW_GROUPS[k].includes(exp.company),
                );
                if (groupLabel && !grouped.has(groupLabel)) {
                  grouped.set(groupLabel, [{ company: exp.company, period: exp.period }]);
                  for (const c of ROW_GROUPS[groupLabel]) assigned.add(c);
                } else if (!groupLabel) {
                  grouped.set(exp.company, [{ company: exp.company, period: exp.period }]);
                  assigned.add(exp.company);
                } else {
                  grouped.get(groupLabel)!.push({ company: exp.company, period: exp.period });
                }
              }
              return [...grouped.entries()].map(([label, entries]) => (
                <div key={label} className="flex items-center">
                  <span className="w-[100px] shrink-0 truncate text-[11px] font-semibold text-toss-heading">
                    {label}
                  </span>
                  <div className="relative h-5 flex-1 rounded bg-toss-bg">
                    {YEARS.map((y) => (
                      <div
                        key={y}
                        className="absolute top-0 h-full w-px bg-toss-border"
                        style={{
                          left: `${(((y - 2021) * 12) / 72) * 100}%`,
                        }}
                      />
                    ))}
                    {flipped &&
                      entries.map(({ company, period }) => {
                        const bar = parseBar(period);
                        const color = BAR_COLORS[company] ?? DEFAULT_BAR_COLOR;
                        return (
                          <motion.div
                            key={period}
                            initial={{ width: 0 }}
                            animate={{ width: `${bar.width}%` }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className={`absolute top-0 h-full rounded ${color}`}
                            style={{ left: `${bar.left}%` }}
                          />
                        );
                      })}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

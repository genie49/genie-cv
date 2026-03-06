import { useState } from "react";
import { motion } from "motion/react";
import profile from "@data/profile.json";

const BAR_COLORS: Record<string, string> = {
  아이머스: "bg-cyan-600",
  핀구: "bg-violet-600",
  "대한민국 육군": "bg-zinc-500",
};
const DEFAULT_BAR_COLOR = "bg-zinc-800";

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

export default function ExperiencePanel() {
  const [flipped, setFlipped] = useState(false);

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
          className="rounded-xl border border-zinc-100 bg-zinc-50 p-6"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-['Outfit'] text-base font-bold text-black">
              Experience
            </h2>
            <span className="rounded-md bg-zinc-200 px-2.5 py-0.5 text-[10px] font-medium text-zinc-500">
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
                  <p className="text-[13px] font-medium text-black">
                    {exp.title}
                  </p>
                  <p className="text-xs text-zinc-500">{exp.company}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-xs text-zinc-400">{exp.period}</span>
                  <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500">
                    {exp.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back — Gantt */}
        <div
          className="absolute inset-0 rounded-xl border border-zinc-100 bg-zinc-50 p-6"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-['Outfit'] text-base font-bold text-black">
              Experience
            </h2>
            <span className="rounded-md bg-zinc-200 px-2.5 py-0.5 text-[10px] font-medium text-zinc-500">
              클릭하여 목록 보기
            </span>
          </div>

          {/* Year axis */}
          <div className="mb-1 ml-[100px]">
            <div className="flex">
              {YEARS.map((y) => (
                <span
                  key={y}
                  className="flex-1 text-[10px] font-medium text-zinc-400"
                >
                  {y}
                </span>
              ))}
            </div>
          </div>

          {/* Bars */}
          <div className="flex flex-col gap-2">
            {profile.experience.map((exp) => {
              const bar = parseBar(exp.period);
              const color = BAR_COLORS[exp.company] ?? DEFAULT_BAR_COLOR;
              return (
                <div
                  key={`${exp.company}-${exp.period}`}
                  className="flex items-center"
                >
                  <span className="w-[100px] shrink-0 truncate text-[11px] font-semibold text-zinc-800">
                    {exp.company}
                  </span>
                  <div className="relative h-5 flex-1 rounded bg-zinc-100">
                    {YEARS.map((y) => (
                      <div
                        key={y}
                        className="absolute top-0 h-full w-px bg-zinc-200"
                        style={{
                          left: `${(((y - 2021) * 12) / 72) * 100}%`,
                        }}
                      />
                    ))}
                    {flipped && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${bar.width}%` }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className={`absolute top-0 h-full rounded ${color}`}
                        style={{ left: `${bar.left}%` }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import { motion } from "motion/react";
import { Bot, LineChart, Trophy, Sparkles, TrendingUp } from "lucide-react";

const cell = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] as const },
});

export function FingooHero() {
  return (
    <div className="grid h-[320px] w-full grid-cols-1 gap-2 overflow-hidden rounded-xl md:grid-cols-5 md:grid-rows-2">
      {/* AI Chat — left column, spans 2 rows */}
      <motion.div
        {...cell(0.1)}
        className="relative col-span-1 row-span-1 flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-5 md:col-span-2 md:row-span-2"
      >
        {/* Subtle grid texture */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/15">
            <Bot size={13} className="text-emerald-400" />
          </div>
          <span className="font-['Outfit'] text-[12px] font-semibold tracking-wide text-zinc-300">
            AI 투자 분석
          </span>
        </div>

        <div className="relative mt-4 flex flex-1 flex-col gap-2.5">
          {/* User message */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="self-start rounded-xl rounded-tl-sm bg-zinc-800 px-3.5 py-2"
          >
            <span className="text-[11px] leading-relaxed text-zinc-300">
              삼성전자 주가 분석해줘
            </span>
          </motion.div>

          {/* AI response */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="self-end rounded-xl rounded-tr-sm border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2"
          >
            <span className="text-[11px] leading-relaxed text-emerald-300">
              PER 12.3x · 목표가 ▲ 15%
            </span>
          </motion.div>

          {/* Tool execution indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="self-start"
          >
            <div className="flex items-center gap-1.5 rounded-lg bg-zinc-800/60 px-2.5 py-1.5">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[10px] text-zinc-500">차트 생성 중...</span>
            </div>
          </motion.div>

          {/* User follow-up */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.4 }}
            className="self-start rounded-xl rounded-tl-sm bg-zinc-800 px-3.5 py-2"
          >
            <span className="text-[11px] leading-relaxed text-zinc-300">
              경쟁사 비교도 해줘
            </span>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="relative mt-3 flex items-center gap-1.5 border-t border-zinc-800/80 pt-3"
        >
          <Sparkles size={10} className="text-emerald-500/60" />
          <span className="text-[10px] text-zinc-600">
            7개 전문 에이전트 협업
          </span>
        </motion.div>
      </motion.div>

      {/* Financial Chart — right top */}
      <motion.div
        {...cell(0.2)}
        className="relative col-span-1 row-span-1 flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-950/40 p-5 md:col-span-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/15">
              <LineChart size={13} className="text-blue-400" />
            </div>
            <span className="font-['Outfit'] text-[12px] font-semibold tracking-wide text-zinc-300">
              금융 차트
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp size={11} className="text-emerald-400" />
            <span className="text-[10px] font-medium text-emerald-400">
              +2.4%
            </span>
          </div>
        </div>

        {/* Chart SVG */}
        <div className="mt-3 flex-1">
          <svg
            className="h-full w-full"
            viewBox="0 0 300 80"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(59,130,246)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="rgb(59,130,246)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            {[20, 40, 60].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="300"
                y2={y}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
            ))}
            {/* Area fill */}
            <motion.polygon
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              points="0,65 20,60 45,58 70,50 95,52 120,42 145,44 170,35 195,30 220,32 245,22 270,18 300,12 300,80 0,80"
              fill="url(#chartGrad)"
            />
            {/* Line */}
            <motion.polyline
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
              points="0,65 20,60 45,58 70,50 95,52 120,42 145,44 170,35 195,30 220,32 245,22 270,18 300,12"
              fill="none"
              stroke="rgb(96,165,250)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Dot at end */}
            <motion.circle
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.3 }}
              cx="300"
              cy="12"
              r="3"
              fill="rgb(96,165,250)"
            />
          </svg>
        </div>

        {/* Bottom labels */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-1 flex gap-3 text-[10px] text-zinc-600"
        >
          <span>분할 뷰</span>
          <span className="text-zinc-700">·</span>
          <span>다중 Y축</span>
          <span className="text-zinc-700">·</span>
          <span>AI 예측</span>
          <span className="text-zinc-700">·</span>
          <span>CSV</span>
        </motion.div>
      </motion.div>

      {/* Tech Stack + Education — right bottom */}
      <motion.div
        {...cell(0.3)}
        className="relative col-span-1 row-span-1 flex items-center gap-6 overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-5 md:col-span-3"
      >
        {/* Tech Stack */}
        <div className="flex flex-1 flex-col gap-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            Stack
          </span>
          <div className="flex flex-wrap gap-1.5">
            {["Next.js", "LangGraph", "NestJS", "FastAPI", "Docker", "AWS"].map(
              (t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  className="rounded-md border border-zinc-700/60 bg-zinc-800/80 px-2 py-1 text-[10px] font-medium text-zinc-400"
                >
                  {t}
                </motion.span>
              ),
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-zinc-800" />

        {/* Gamification */}
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col gap-2"
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            교육
          </span>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Trophy size={13} className="text-amber-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-zinc-300">
                게이미피케이션
              </span>
              <span className="text-[9px] text-zinc-600">
                XP · 랭킹 · 퀴즈
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

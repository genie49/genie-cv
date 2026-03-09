import { motion } from "motion/react";
import {
  Bot,
  LineChart,
  MessageSquare,
  BarChart3,
  Database,
  Globe,
} from "lucide-react";

export function FingooHero() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative h-[300px] w-full overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950"
    >
      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="flex h-full">
        {/* Left: Chat Panel */}
        <div className="flex w-[38%] flex-col border-r border-zinc-800/60 p-4">
          {/* Chat header */}
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <div className="h-2 w-16 rounded-full bg-zinc-700" />
          </div>

          {/* Chat bubbles */}
          <div className="flex flex-1 flex-col gap-2">
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="self-start rounded-lg rounded-tl-sm bg-zinc-800 px-3 py-1.5"
            >
              <span className="text-[10px] text-zinc-400">삼성전자 분석해줘</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="self-end rounded-lg rounded-tr-sm border border-emerald-500/20 bg-emerald-950/40 px-3 py-1.5"
            >
              <span className="text-[10px] text-emerald-400/80">PER 12.3x, 목표가 ▲15%</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-1 self-start rounded-md bg-zinc-800/50 px-2 py-1"
            >
              <div className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[9px] text-zinc-600">차트 생성 중</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="self-start rounded-lg rounded-tl-sm bg-zinc-800 px-3 py-1.5"
            >
              <span className="text-[10px] text-zinc-400">경쟁사 비교도</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="self-end rounded-lg rounded-tr-sm border border-emerald-500/20 bg-emerald-950/40 px-3 py-1.5"
            >
              <span className="text-[10px] text-emerald-400/80">SK하이닉스 대비 저평가</span>
            </motion.div>
          </div>

          {/* Input bar */}
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5">
            <div className="h-1.5 w-24 rounded-full bg-zinc-800" />
            <MessageSquare size={10} className="ml-auto text-zinc-700" />
          </div>
        </div>

        {/* Right: Chart + Info */}
        <div className="flex flex-1 flex-col">
          {/* Chart area */}
          <div className="flex flex-1 flex-col p-4 pb-2">
            {/* Chart header */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-20 rounded-full bg-zinc-700" />
                <div className="h-2 w-12 rounded-full bg-zinc-800" />
              </div>
              <div className="flex gap-1">
                {["1Y", "5Y", "MAX"].map((label) => (
                  <span
                    key={label}
                    className={`rounded px-1.5 py-0.5 text-[8px] ${
                      label === "5Y"
                        ? "bg-blue-500/15 text-blue-400"
                        : "text-zinc-600"
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Chart SVG */}
            <svg
              className="flex-1 w-full"
              viewBox="0 0 300 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="heroChartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(59,130,246)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="rgb(59,130,246)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[25, 50, 75].map((y) => (
                <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.03)" />
              ))}
              <motion.polygon
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                points="0,78 25,72 50,70 75,58 100,62 125,48 150,52 175,38 200,35 225,40 250,28 275,22 300,15 300,100 0,100"
                fill="url(#heroChartFill)"
              />
              <motion.polyline
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                points="0,78 25,72 50,70 75,58 100,62 125,48 150,52 175,38 200,35 225,40 250,28 275,22 300,15"
                fill="none"
                stroke="rgb(96,165,250)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <motion.circle
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                cx="300" cy="15" r="2.5"
                fill="rgb(96,165,250)"
              />
            </svg>
          </div>

          {/* Bottom bar: agents + tools */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-3 border-t border-zinc-800/60 px-4 py-3"
          >
            <div className="flex -space-x-1">
              {[Bot, LineChart, BarChart3, Database, Globe].map((Icon, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0 + i * 0.08 }}
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900"
                >
                  <Icon size={10} className="text-zinc-500" />
                </motion.div>
              ))}
            </div>
            <span className="text-[9px] text-zinc-600">7 agents connected</span>
            <div className="ml-auto flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] text-zinc-600">Live</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

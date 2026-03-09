import { motion } from "motion/react";
import {
  Bot,
  LineChart,
  Trophy,
  BarChart3,
  MessageSquare,
  Brain,
} from "lucide-react";

const floatingIcons = [
  { Icon: MessageSquare, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", x: "left-[8%]", y: "top-[18%]", delay: 0, duration: 3.5, range: 10 },
  { Icon: BarChart3, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", x: "right-[12%]", y: "top-[12%]", delay: 0.8, duration: 4, range: 8 },
  { Icon: Bot, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", x: "left-[25%]", y: "bottom-[18%]", delay: 1.2, duration: 3.8, range: 12 },
  { Icon: LineChart, color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20", x: "right-[28%]", y: "bottom-[22%]", delay: 0.4, duration: 4.2, range: 9 },
  { Icon: Trophy, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", x: "left-[52%]", y: "top-[10%]", delay: 1.6, duration: 3.2, range: 7 },
  { Icon: Brain, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20", x: "right-[48%]", y: "bottom-[12%]", delay: 0.6, duration: 3.6, range: 11 },
];

export function FingooHero() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative h-[300px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950"
    >
      {/* Radial glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_40%,rgba(16,185,129,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_30%,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(139,92,246,0.06),transparent_45%)]" />

      {/* Grid texture */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Connecting lines */}
      <svg className="absolute inset-0 h-full w-full">
        <motion.line
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.06 }}
          transition={{ delay: 1 }}
          x1="15%" y1="30%" x2="50%" y2="50%"
          stroke="white" strokeWidth="1"
        />
        <motion.line
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.06 }}
          transition={{ delay: 1.2 }}
          x1="85%" y1="25%" x2="50%" y2="50%"
          stroke="white" strokeWidth="1"
        />
        <motion.line
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.06 }}
          transition={{ delay: 1.4 }}
          x1="30%" y1="75%" x2="50%" y2="50%"
          stroke="white" strokeWidth="1"
        />
        <motion.line
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.06 }}
          transition={{ delay: 1.6 }}
          x1="70%" y1="78%" x2="50%" y2="50%"
          stroke="white" strokeWidth="1"
        />
      </svg>

      {/* Floating icons */}
      {floatingIcons.map(({ Icon, color, bg, x, y, delay, duration, range }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -range, 0],
          }}
          transition={{
            opacity: { delay: 0.3 + delay * 0.5, duration: 0.5 },
            scale: { delay: 0.3 + delay * 0.5, duration: 0.5 },
            y: { delay: 0.3 + delay * 0.5, duration, repeat: Infinity, ease: "easeInOut" },
          }}
          className={`absolute ${x} ${y}`}
        >
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border backdrop-blur-sm ${bg}`}>
            <Icon size={18} className={color} />
          </div>
        </motion.div>
      ))}

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-400/70"
        >
          AI Investment Platform
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="font-['Outfit'] text-3xl font-extrabold tracking-tight text-white/90"
        >
          핀구
        </motion.span>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-2 text-[11px] text-zinc-500"
        >
          <span>멀티 에이전트</span>
          <span className="text-zinc-700">·</span>
          <span>금융 차트</span>
          <span className="text-zinc-700">·</span>
          <span>투자 교육</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

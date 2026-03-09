import { motion } from "motion/react";

const FLOW_DELAY = 0.15;

function Node({
  x,
  y,
  w,
  h,
  label,
  sub,
  color,
  delay,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  color: "violet" | "emerald" | "blue" | "amber" | "zinc";
  delay: number;
}) {
  const colors = {
    violet: {
      fill: "#ede9fe",
      stroke: "#c4b5fd",
      text: "#5b21b6",
      sub: "#7c3aed",
    },
    emerald: {
      fill: "#d1fae5",
      stroke: "#6ee7b7",
      text: "#065f46",
      sub: "#059669",
    },
    blue: {
      fill: "#dbeafe",
      stroke: "#93c5fd",
      text: "#1e40af",
      sub: "#2563eb",
    },
    amber: {
      fill: "#fef3c7",
      stroke: "#fcd34d",
      text: "#92400e",
      sub: "#d97706",
    },
    zinc: {
      fill: "#f4f4f5",
      stroke: "#d4d4d8",
      text: "#27272a",
      sub: "#71717a",
    },
  };
  const c = colors[color];

  return (
    <motion.g
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        fill={c.fill}
        stroke={c.stroke}
        strokeWidth={1.2}
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 4 : y + h / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={c.text}
        fontSize={9}
        fontWeight={600}
        fontFamily="'Outfit', sans-serif"
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={c.sub}
          fontSize={6.5}
          fontFamily="sans-serif"
          opacity={0.8}
        >
          {sub}
        </text>
      )}
    </motion.g>
  );
}

function Arrow({
  points,
  delay,
  dashed,
}: {
  points: string;
  delay: number;
  dashed?: boolean;
}) {
  return (
    <motion.polyline
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.25 }}
      points={points}
      fill="none"
      stroke="#a1a1aa"
      strokeWidth={1}
      strokeDasharray={dashed ? "3,2" : undefined}
      markerEnd="url(#arrowhead)"
    />
  );
}

export function FingooHero({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`relative w-full overflow-hidden border border-zinc-200 bg-gradient-to-br from-slate-50 via-violet-50/30 to-blue-50/20 ${className ?? "h-[300px] rounded-xl"}`}
    >
      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d4d4d8_0.8px,transparent_0.8px)] bg-[size:16px_16px] opacity-40" />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute left-5 top-4 flex items-center gap-2"
      >
        <span className="font-['Outfit'] text-[11px] font-bold tracking-wide text-zinc-800">
          FINGOO AI PIPELINE
        </span>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[8px] font-medium text-emerald-700">
          Production
        </span>
      </motion.div>

      {/* Architecture Diagram */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 640 280"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="6"
            markerHeight="4"
            refX="5"
            refY="2"
            orient="auto"
          >
            <polygon points="0,0 6,2 0,4" fill="#a1a1aa" />
          </marker>
        </defs>

        {/* ── Layer 1: Input ── */}
        <Node
          x={30}
          y={100}
          w={90}
          h={36}
          label="사용자 질문"
          sub="자연어 입력"
          color="zinc"
          delay={FLOW_DELAY}
        />

        {/* Arrow: Input → Supervisor */}
        <Arrow points="120,118 155,118" delay={FLOW_DELAY * 2} />

        {/* ── Layer 2: Supervisor ── */}
        <Node
          x={160}
          y={90}
          w={100}
          h={56}
          label="Supervisor"
          sub="질문 분류 · 라우팅"
          color="violet"
          delay={FLOW_DELAY * 3}
        />

        {/* Arrows: Supervisor → Agents */}
        <Arrow
          points="260,102 295,72"
          delay={FLOW_DELAY * 4}
        />
        <Arrow
          points="260,112 295,112"
          delay={FLOW_DELAY * 4}
        />
        <Arrow
          points="260,118 290,118 295,148"
          delay={FLOW_DELAY * 4}
        />
        <Arrow
          points="260,126 288,126 295,182"
          delay={FLOW_DELAY * 4}
        />
        <Arrow
          points="260,132 286,132 295,218"
          delay={FLOW_DELAY * 4}
        />

        {/* ── Layer 3: Agents ── */}
        <Node
          x={300}
          y={54}
          w={100}
          h={36}
          label="시장분석"
          sub="yfinance · Tavily"
          color="emerald"
          delay={FLOW_DELAY * 5}
        />
        <Node
          x={300}
          y={96}
          w={100}
          h={36}
          label="기술분석"
          sub="TA-Lib 지표"
          color="emerald"
          delay={FLOW_DELAY * 5.5}
        />
        <Node
          x={300}
          y={132}
          w={100}
          h={36}
          label="리서치"
          sub="DART · pgvector"
          color="emerald"
          delay={FLOW_DELAY * 6}
        />
        <Node
          x={300}
          y={168}
          w={100}
          h={36}
          label="포트폴리오"
          sub="자산 배분 최적화"
          color="emerald"
          delay={FLOW_DELAY * 6.5}
        />
        <Node
          x={300}
          y={204}
          w={100}
          h={36}
          label="퀀트"
          sub="QuantLib 분석"
          color="emerald"
          delay={FLOW_DELAY * 7}
        />

        {/* Arrows: Agents → Response */}
        <Arrow points="400,72 435,120" delay={FLOW_DELAY * 8} />
        <Arrow points="400,114 435,126" delay={FLOW_DELAY * 8} />
        <Arrow points="400,150 435,132" delay={FLOW_DELAY * 8} />
        <Arrow points="400,186 435,138" delay={FLOW_DELAY * 8} />
        <Arrow points="400,222 435,144" delay={FLOW_DELAY * 8} />

        {/* ── Layer 4: Response ── */}
        <Node
          x={440}
          y={106}
          w={90}
          h={48}
          label="종합 응답"
          sub="스트리밍 생성"
          color="violet"
          delay={FLOW_DELAY * 9}
        />

        {/* Arrows: Response → Outputs */}
        <Arrow points="530,118 560,80" delay={FLOW_DELAY * 10} />
        <Arrow points="530,130 560,130" delay={FLOW_DELAY * 10} />
        <Arrow points="530,142 560,180" delay={FLOW_DELAY * 10} />

        {/* ── Layer 5: Outputs ── */}
        <Node
          x={565}
          y={60}
          w={65}
          h={36}
          label="차트"
          sub="인터랙티브"
          color="blue"
          delay={FLOW_DELAY * 11}
        />
        <Node
          x={565}
          y={112}
          w={65}
          h={36}
          label="분석 리포트"
          color="blue"
          delay={FLOW_DELAY * 11.5}
        />
        <Node
          x={565}
          y={164}
          w={65}
          h={36}
          label="교육 콘텐츠"
          sub="XP · 랭킹"
          color="amber"
          delay={FLOW_DELAY * 12}
        />

        {/* ── Bottom: Real-time tracking bar ── */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: FLOW_DELAY * 13 }}
        >
          <rect
            x={160}
            y={248}
            width={310}
            height={24}
            rx={12}
            fill="white"
            stroke="#e4e4e7"
            strokeWidth={0.8}
            opacity={0.9}
          />
          <circle cx={178} cy={260} r={3} fill="#10b981" />
          <text
            x={190}
            y={261}
            fontSize={7}
            fill="#71717a"
            fontFamily="'JetBrains Mono', monospace"
            dominantBaseline="middle"
          >
            Socket.io 실시간 추적 · 7 agents · interrupt / resume
          </text>
        </motion.g>

        {/* ── Dashed feedback loop ── */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: FLOW_DELAY * 14, duration: 0.5 }}
        >
          <path
            d="M 530,155 Q 540,230 460,240 L 200,240 Q 160,240 160,200 L 160,148"
            fill="none"
            stroke="#a78bfa"
            strokeWidth={0.8}
            strokeDasharray="4,3"
            markerEnd="url(#arrowhead)"
          />
          <text
            x={340}
            y={236}
            fontSize={6}
            fill="#8b5cf6"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            체크포인트 기반 재개
          </text>
        </motion.g>
      </svg>
    </motion.div>
  );
}

import { motion } from "motion/react";
import { useRef, useState, useCallback, useEffect } from "react";

const FLOW_DELAY = 0.15;

const BASE_VB = { x: 0, y: 0, w: 640, h: 280 };
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 3;

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
  color: "emerald" | "blue" | "amber" | "zinc" | "cyan" | "rose";
  delay: number;
}) {
  const colors = {
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
    cyan: {
      fill: "#cffafe",
      stroke: "#67e8f9",
      text: "#155e75",
      sub: "#0891b2",
    },
    rose: {
      fill: "#ffe4e6",
      stroke: "#fda4af",
      text: "#9f1239",
      sub: "#e11d48",
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

export function ChatbotHero({
  className,
  interactive,
}: {
  className?: string;
  interactive?: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);

  const getViewBox = useCallback(() => {
    const vbW = BASE_VB.w / zoom;
    const vbH = BASE_VB.h / zoom;
    const vbX = BASE_VB.x + (BASE_VB.w - vbW) / 2 + pan.x;
    const vbY = BASE_VB.y + (BASE_VB.h - vbH) / 2 + pan.y;
    return `${vbX} ${vbY} ${vbW} ${vbH}`;
  }, [zoom, pan]);

  useEffect(() => {
    const node = svgRef.current;
    if (!node || !interactive) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * delta)));
    };
    node.addEventListener("wheel", handler, { passive: false });
    return () => node.removeEventListener("wheel", handler);
  }, [interactive]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!interactive) return;
      const svg = svgRef.current;
      if (!svg) return;
      svg.setPointerCapture(e.pointerId);
      dragRef.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
    },
    [interactive, pan],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current || !svgRef.current) return;
      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      const scaleX = (BASE_VB.w / zoom) / rect.width;
      const scaleY = (BASE_VB.h / zoom) / rect.height;
      const dx = (e.clientX - dragRef.current.startX) * scaleX;
      const dy = (e.clientY - dragRef.current.startY) * scaleY;
      setPan({ x: dragRef.current.panX - dx, y: dragRef.current.panY - dy });
    },
    [zoom],
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const isZoomed = zoom !== 1 || pan.x !== 0 || pan.y !== 0;

  const handleReset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`relative w-full overflow-hidden border border-zinc-200 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/20 ${className ?? "h-[300px] rounded-xl"}`}
    >
      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d4d4d8_0.8px,transparent_0.8px)] bg-[size:16px_16px] opacity-40" />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute left-5 top-4 z-10 flex items-center gap-2"
      >
        <span className="font-['Outfit'] text-[11px] font-bold tracking-wide text-zinc-800">
          CHATBOT RAG PIPELINE
        </span>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[8px] font-medium text-emerald-700">
          17-line Agent
        </span>
      </motion.div>

      {/* Reset button */}
      {interactive && isZoomed && (
        <button
          onClick={handleReset}
          className="absolute right-3 top-3 z-10 cursor-pointer rounded-md border border-zinc-200 bg-white/90 px-2 py-1 text-[10px] text-zinc-500 backdrop-blur-sm transition-colors hover:bg-zinc-50 hover:text-zinc-700"
        >
          Reset
        </button>
      )}

      {/* Architecture Diagram */}
      <svg
        ref={svgRef}
        className={`absolute inset-0 h-full w-full ${interactive ? "cursor-grab active:cursor-grabbing" : ""}`}
        viewBox={interactive ? getViewBox() : "0 0 640 280"}
        preserveAspectRatio="xMidYMid meet"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <defs>
          <marker
            id="chatbot-arrowhead"
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
          x={20}
          y={108}
          w={80}
          h={36}
          label="사용자 질문"
          sub="React + assistant-ui"
          color="zinc"
          delay={FLOW_DELAY}
        />

        {/* Arrow: Input → Rate Limiter */}
        <Arrow points="100,126 130,126" delay={FLOW_DELAY * 2} />

        {/* ── Layer 2: Rate Limiter ── */}
        <Node
          x={135}
          y={108}
          w={75}
          h={36}
          label="Rate Limiter"
          sub="20/min · IP 기반"
          color="rose"
          delay={FLOW_DELAY * 3}
        />

        {/* Arrow: Rate Limiter → ReAct Agent */}
        <Arrow points="210,126 240,126" delay={FLOW_DELAY * 4} />

        {/* ── Layer 3: ReAct Agent (central, larger) ── */}
        <Node
          x={245}
          y={96}
          w={110}
          h={60}
          label="ReAct Agent"
          sub="Grok 4.1 · 조건부 판단"
          color="emerald"
          delay={FLOW_DELAY * 5}
        />

        {/* ── Branch: Agent decides ── */}

        {/* Arrow: Agent → RAG (down) */}
        <Arrow points="300,156 300,180" delay={FLOW_DELAY * 6} />

        {/* Arrow: Agent → Direct Response (up, when no RAG needed) */}
        <Arrow points="300,96 300,72 370,72" delay={FLOW_DELAY * 6} dashed />

        {/* Label: 인사말 → 직접 응답 */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: FLOW_DELAY * 7 }}
          x={335}
          y={66}
          fontSize={6}
          fill="#71717a"
          textAnchor="middle"
          fontFamily="sans-serif"
        >
          인사말 → 직접 응답
        </motion.text>

        {/* ── Layer 4: RAG Search ── */}
        <Node
          x={250}
          y={184}
          w={100}
          h={40}
          label="rag_search"
          sub="벡터 유사도 검색 · Top-5"
          color="cyan"
          delay={FLOW_DELAY * 7}
        />

        {/* Arrow: RAG → Gemini Embedding */}
        <Arrow points="250,204 200,204 200,220 130,220" delay={FLOW_DELAY * 8} />

        {/* ── Gemini Embedding ── */}
        <Node
          x={40}
          y={196}
          w={88}
          h={36}
          label="Gemini Embedding"
          sub="taskType 분리"
          color="amber"
          delay={FLOW_DELAY * 9}
        />

        {/* Arrow: Gemini → LanceDB */}
        <Arrow points="84,196 84,178" delay={FLOW_DELAY * 10} />

        {/* ── LanceDB ── */}
        <Node
          x={40}
          y={154}
          w={88}
          h={24}
          label="LanceDB"
          sub=""
          color="amber"
          delay={FLOW_DELAY * 10}
        />

        {/* Label: 파일 기반 · 서버 불필요 */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: FLOW_DELAY * 11 }}
          x={84}
          y={150}
          fontSize={6}
          fill="#92400e"
          textAnchor="middle"
          fontFamily="sans-serif"
        >
          파일 기반 · 서버 불필요
        </motion.text>

        {/* Arrow: RAG result back to Agent */}
        <Arrow points="350,204 370,204 370,156 355,156" delay={FLOW_DELAY * 11} dashed />

        {/* ── Layer 5: SSE Streaming ── */}
        {/* Arrow: Agent → Streaming */}
        <Arrow points="355,126 405,126" delay={FLOW_DELAY * 12} />

        <Node
          x={410}
          y={100}
          w={100}
          h={52}
          label="SSE Streaming"
          sub="NDJSON · ReadableStream"
          color="blue"
          delay={FLOW_DELAY * 12}
        />

        {/* ── Layer 6: Output events ── */}
        <Arrow points="510,110 540,82" delay={FLOW_DELAY * 13} />
        <Arrow points="510,126 540,126" delay={FLOW_DELAY * 13} />
        <Arrow points="510,140 540,166" delay={FLOW_DELAY * 13} />

        <Node
          x={545}
          y={64}
          w={80}
          h={28}
          label="token"
          sub="텍스트 청크"
          color="blue"
          delay={FLOW_DELAY * 14}
        />
        <Node
          x={545}
          y={112}
          w={80}
          h={28}
          label="citations"
          sub="인용 링크 매핑"
          color="emerald"
          delay={FLOW_DELAY * 14.5}
        />
        <Node
          x={545}
          y={156}
          w={80}
          h={28}
          label="error"
          sub="에러 분류 메시지"
          color="rose"
          delay={FLOW_DELAY * 15}
        />

        {/* ── Bottom: info bar ── */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: FLOW_DELAY * 16 }}
        >
          <rect
            x={160}
            y={248}
            width={320}
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
            createReactAgent · 1 tool · Gemini + LanceDB + Grok 4.1
          </text>
        </motion.g>

        {/* ── Citation feedback: source → route auto-mapping ── */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: FLOW_DELAY * 17, duration: 0.5 }}
        >
          <path
            d="M 585,140 Q 610,210 560,230 L 100,230 Q 60,230 60,200 L 60,178"
            fill="none"
            stroke="#0891b2"
            strokeWidth={0.8}
            strokeDasharray="4,3"
            markerEnd="url(#chatbot-arrowhead)"
          />
          <text
            x={330}
            y={238}
            fontSize={6}
            fill="#0891b2"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            소스 → 내부 라우트 자동 매핑
          </text>
        </motion.g>
      </svg>
    </motion.div>
  );
}

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
  fontSize: fs,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  color: "violet" | "emerald" | "blue" | "amber" | "zinc" | "orange";
  delay: number;
  fontSize?: number;
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
    orange: {
      fill: "#fff7ed",
      stroke: "#fed7aa",
      text: "#c2410c",
      sub: "#ea580c",
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
        rx={4}
        fill={c.fill}
        stroke={c.stroke}
        strokeWidth={1.2}
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 5 : y + h / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={c.text}
        fontSize={fs ?? 10}
        fontWeight={600}
        fontFamily="monospace"
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
          fontSize={fs ? fs * 0.7 : 7}
          fontFamily="monospace"
          opacity={0.85}
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
  stroke: strokeColor,
}: {
  points: string;
  delay: number;
  dashed?: boolean;
  stroke?: string;
}) {
  return (
    <motion.polyline
      initial={{ opacity: 0 }}
      animate={{ opacity: dashed ? 0.5 : 1 }}
      transition={{ delay, duration: 0.25 }}
      points={points}
      fill="none"
      stroke={strokeColor ?? "#ccc"}
      strokeWidth={1.2}
      strokeDasharray={dashed ? "4,3" : undefined}
      markerEnd={strokeColor ? "url(#fingoo-arrow-amber)" : "url(#fingoo-arrow)"}
    />
  );
}

export function FingooHero({
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

  const pinchRef = useRef<number | null>(null);

  useEffect(() => {
    const node = svgRef.current;
    if (!node || !interactive) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * delta)));
    };

    const dist = (a: Touch, b: Touch) =>
      Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        pinchRef.current = dist(e.touches[0], e.touches[1]);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchRef.current !== null) {
        e.preventDefault();
        const d = dist(e.touches[0], e.touches[1]);
        const scale = d / pinchRef.current;
        pinchRef.current = d;
        setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * scale)));
      }
    };
    const onTouchEnd = () => { pinchRef.current = null; };

    node.addEventListener("wheel", onWheel, { passive: false });
    node.addEventListener("touchstart", onTouchStart, { passive: false });
    node.addEventListener("touchmove", onTouchMove, { passive: false });
    node.addEventListener("touchend", onTouchEnd);
    return () => {
      node.removeEventListener("wheel", onWheel);
      node.removeEventListener("touchstart", onTouchStart);
      node.removeEventListener("touchmove", onTouchMove);
      node.removeEventListener("touchend", onTouchEnd);
    };
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
      className={`relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br from-slate-50 via-violet-50/30 to-blue-50/20 ${className ?? "h-[300px]"}`}
    >
      {/* Grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d4d4d8_0.8px,transparent_0.8px)] bg-[size:16px_16px] opacity-40" />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute left-5 top-4 z-10 flex items-center gap-2"
      >
        <span className="font-mono text-[11px] font-bold tracking-wide text-zinc-700">
          FINGOO
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

      {/* Service Flow Diagram */}
      <svg
        ref={svgRef}
        className={`absolute inset-0 h-full w-full ${interactive ? "cursor-grab touch-none active:cursor-grabbing" : ""}`}
        viewBox={interactive ? getViewBox() : "0 0 640 280"}
        preserveAspectRatio="xMidYMid meet"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <defs>
          <marker
            id="fingoo-arrow"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0,0 0,6 9,3" fill="#ccc" />
          </marker>
          <marker id="fingoo-arrow-amber" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0,0 0,6 9,3" fill="#fcd34d" />
          </marker>
        </defs>

        {/* ═══ Col 1: Client ═══ */}
        <Node x={12} y={80} w={60} h={38} label="Client" sub="Next.js" color="blue" delay={FLOW_DELAY} />

        {/* Arrow: Client → Nginx */}
        <Arrow points="72,99 88,99" delay={FLOW_DELAY * 1.5} />

        {/* ═══ Col 2: Nginx ═══ */}
        <Node x={90} y={72} w={50} h={55} label="Nginx" sub="Reverse Proxy" color="zinc" delay={FLOW_DELAY * 2} fontSize={7} />

        {/* Arrows: Nginx → Services */}
        <Arrow points="140,85 160,55" delay={FLOW_DELAY * 2.5} />
        <Arrow points="140,99 160,99" delay={FLOW_DELAY * 2.5} />

        {/* ═══ Col 3: Backend Services ═══ */}
        <Node x={162} y={38} w={65} h={30} label="NestJS" color="emerald" delay={FLOW_DELAY * 3} fontSize={8} />
        <Node x={162} y={82} w={65} h={36} label="FastAPI" sub="AI Service" color="violet" delay={FLOW_DELAY * 3} fontSize={8} />

        {/* Arrow: FastAPI → Agent System */}
        <Arrow points="227,99 250,99" delay={FLOW_DELAY * 3.5} stroke="#c4b5fd" />
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: FLOW_DELAY * 3.5, duration: 0.3 }}
          x={239} y={93} fontFamily="monospace" fontSize={5} fill="#7c3aed" textAnchor="middle"
        >
          WS
        </motion.text>

        {/* ═══ Col 4: AI Agent System (big wrapper) ═══ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: FLOW_DELAY * 4, duration: 0.4 }}
        >
          <rect x={252} y={30} width={195} height={170} rx={6} fill="#faf5ff" stroke="#c4b5fd" strokeWidth={1.5} />
          <text x={349} y={46} textAnchor="middle" fontFamily="monospace" fontSize={7.5} fontWeight={700} fill="#7c3aed">
            AI Agent System
          </text>
        </motion.g>

        {/* Supervisor */}
        <Node x={270} y={54} w={160} h={32} label="Supervisor" sub="LangChain · Grok/Claude/Gemini" color="violet" delay={FLOW_DELAY * 4} fontSize={9} />

        {/* Sub-agents row */}
        <motion.g
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: FLOW_DELAY * 5, duration: 0.35 }}
        >
          <rect x={264} y={94} width={32} height={16} rx={2} fill="#fff" stroke="#c4b5fd" strokeWidth={0.7} />
          <text x={280} y={105} textAnchor="middle" fontFamily="monospace" fontSize={4.5} fill="#7c3aed">시장</text>
          <rect x={300} y={94} width={32} height={16} rx={2} fill="#fff" stroke="#c4b5fd" strokeWidth={0.7} />
          <text x={316} y={105} textAnchor="middle" fontFamily="monospace" fontSize={4.5} fill="#7c3aed">기술</text>
          <rect x={336} y={94} width={36} height={16} rx={2} fill="#fff" stroke="#c4b5fd" strokeWidth={0.7} />
          <text x={354} y={105} textAnchor="middle" fontFamily="monospace" fontSize={4.5} fill="#7c3aed">리서치</text>
          <rect x={376} y={94} width={28} height={16} rx={2} fill="#fff" stroke="#c4b5fd" strokeWidth={0.7} />
          <text x={390} y={105} textAnchor="middle" fontFamily="monospace" fontSize={4.5} fill="#7c3aed">퀀트</text>
          <rect x={408} y={94} width={32} height={16} rx={2} fill="#fff" stroke="#c4b5fd" strokeWidth={0.7} />
          <text x={424} y={105} textAnchor="middle" fontFamily="monospace" fontSize={4.5} fill="#7c3aed">시각화</text>
          {/* Lines: Supervisor → sub-agents */}
          <line x1={290} y1={86} x2={280} y2={94} stroke="#c4b5fd" strokeWidth={0.5} />
          <line x1={320} y1={86} x2={316} y2={94} stroke="#c4b5fd" strokeWidth={0.5} />
          <line x1={350} y1={86} x2={354} y2={94} stroke="#c4b5fd" strokeWidth={0.5} />
          <line x1={380} y1={86} x2={390} y2={94} stroke="#c4b5fd" strokeWidth={0.5} />
          <line x1={400} y1={86} x2={424} y2={94} stroke="#c4b5fd" strokeWidth={0.5} />
        </motion.g>

        {/* 81 Tools + Middleware bars */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: FLOW_DELAY * 6, duration: 0.3 }}
        >
          <rect x={264} y={116} width={60} height={14} rx={7} fill="#f0e7ff" stroke="#ddd6fe" strokeWidth={0.7} />
          <text x={294} y={126} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#7c3aed">81 Tools</text>
          <rect x={330} y={116} width={108} height={14} rx={7} fill="#f0e7ff" stroke="#ddd6fe" strokeWidth={0.7} />
          <text x={384} y={126} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#7c3aed">Middleware × 10</text>
        </motion.g>

        {/* Human-in-Loop + PG Checkpoint */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: FLOW_DELAY * 6, duration: 0.3 }}
        >
          <rect x={264} y={138} width={90} height={14} rx={3} fill="#fff" stroke="#d4d4d8" strokeWidth={0.7} />
          <text x={309} y={148} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#71717a">Human-in-Loop</text>
          <rect x={360} y={138} width={78} height={14} rx={3} fill="#fff" stroke="#d4d4d8" strokeWidth={0.7} />
          <text x={399} y={148} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#71717a">PG Checkpoint</text>
        </motion.g>

        {/* Eval text */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: FLOW_DELAY * 6, duration: 0.3 }}
          x={351} y={170} textAnchor="middle" fontFamily="monospace" fontSize={4.5} fill="#999"
        >
          Eval: MockService + 6 Graders
        </motion.text>

        {/* ═══ Col 5: Data Sources ═══ */}
        {/* Arrow: Agent → 금융 데이터 (amber) */}
        <Arrow points="447,70 470,50" delay={FLOW_DELAY * 6.5} stroke="#fcd34d" />

        <Node x={472} y={32} w={85} h={24} label="금융 데이터" color="amber" delay={FLOW_DELAY * 7} fontSize={6.5} />

        {/* Data source items (2×2 grid) */}
        <Node x={474} y={62} w={40} h={14} label="DART" color="orange" delay={FLOW_DELAY * 7} fontSize={6} />
        <Node x={518} y={62} w={40} h={14} label="FRED" color="orange" delay={FLOW_DELAY * 7} fontSize={6} />
        <Node x={474} y={80} w={40} h={14} label="yfinance" color="orange" delay={FLOW_DELAY * 7} fontSize={6} />
        <Node x={518} y={80} w={40} h={14} label="Tavily" color="orange" delay={FLOW_DELAY * 7} fontSize={6} />

        {/* Arrow: Agent → 시황 RAG (amber) */}
        <Arrow points="447,155 470,135" delay={FLOW_DELAY * 6.5} stroke="#fcd34d" />

        <Node x={472} y={110} w={85} h={34} label="시황 RAG" sub="pgvector + 웹검색" color="emerald" delay={FLOW_DELAY * 7} fontSize={6.5} />

        {/* ═══ Bottom: Streaming + Infra ═══ */}
        <Arrow points="349,200 349,218" delay={FLOW_DELAY * 7.5} dashed />

        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: FLOW_DELAY * 8, duration: 0.3 }}
        >
          <rect x={90} y={218} width={470} height={18} rx={9} fill="#dbeafe" stroke="#93c5fd" strokeWidth={1} />
          <text x={325} y={230} textAnchor="middle" fontFamily="monospace" fontSize={7} fontWeight={600} fill="#1e40af">
            Socket.IO Real-time Streaming
          </text>
        </motion.g>

        {/* DB */}
        <Node x={100} y={246} w={60} h={18} label="PostgreSQL" color="emerald" delay={FLOW_DELAY * 9} fontSize={6} />
        <Node x={165} y={246} w={40} h={18} label="Redis" color="emerald" delay={FLOW_DELAY * 9} fontSize={6} />

        {/* Infra */}
        <Node x={350} y={246} w={48} h={18} label="Docker" color="zinc" delay={FLOW_DELAY * 9} fontSize={6} />
        <Node x={403} y={246} w={38} h={18} label="AWS" color="zinc" delay={FLOW_DELAY * 9} fontSize={6} />
        <Node x={446} y={246} w={55} h={18} label="FluentBit" color="zinc" delay={FLOW_DELAY * 9} fontSize={6} />

        {/* Dashed lines: Streaming → bottom */}
        <Arrow points="130,236 130,246" delay={FLOW_DELAY * 8.5} dashed />
        <Arrow points="185,236 185,246" delay={FLOW_DELAY * 8.5} dashed />
        <Arrow points="374,236 374,246" delay={FLOW_DELAY * 8.5} dashed />
        <Arrow points="422,236 422,246" delay={FLOW_DELAY * 8.5} dashed />
        <Arrow points="473,236 473,246" delay={FLOW_DELAY * 8.5} dashed />
      </svg>
    </motion.div>
  );
}

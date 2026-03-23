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
  color: "violet" | "emerald" | "blue" | "amber" | "zinc" | "orange";
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
        fontSize={10}
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
          fontSize={7}
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
      markerEnd="url(#kimpro-arrow)"
    />
  );
}

export function KimproHero({
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
      className={`relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-amber-50/20 ${className ?? "h-[300px]"}`}
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
          AIMERS
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
            id="kimpro-arrow"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0,0 0,6 9,3" fill="#ccc" />
          </marker>
        </defs>

        {/* ═══ Col 1: Client ═══ */}
        <Node x={12} y={85} w={58} h={35} label="Client" sub="Next.js" color="blue" delay={FLOW_DELAY} />

        {/* Arrow: Client → Nginx */}
        <Arrow points="70,102 88,102" delay={FLOW_DELAY * 1.5} />

        {/* ═══ Col 2: Nginx Gateway ═══ */}
        <Node x={90} y={70} w={55} h={65} label="Nginx" sub="Gateway" color="zinc" delay={FLOW_DELAY * 2} />
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: FLOW_DELAY * 2.5, duration: 0.3 }}
          x={117} y={125} fontFamily="monospace" fontSize={5} fill="#a1a1aa" textAnchor="middle"
        >
          auth_request
        </motion.text>

        {/* Arrows: Nginx → Services */}
        <Arrow points="145,82 168,57" delay={FLOW_DELAY * 2.5} />
        <Arrow points="145,100 168,100" delay={FLOW_DELAY * 2.5} />
        <Arrow points="145,118 168,143" delay={FLOW_DELAY * 3.5} />

        {/* ═══ Col 3: Services ═══ */}
        <Node x={170} y={40} w={52} h={26} label="Auth" color="emerald" delay={FLOW_DELAY * 3} />
        <Node x={170} y={78} w={52} h={26} label="API" color="emerald" delay={FLOW_DELAY * 3} />
        <Node x={170} y={135} w={52} h={32} label="Chat" sub="Socket.IO" color="blue" delay={FLOW_DELAY * 4} />

        {/* Arrow: Chat → Workflow (amber, with pub/sub label) */}
        <Arrow points="222,151 253,130" delay={FLOW_DELAY * 4.5} stroke="#fcd34d" />
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: FLOW_DELAY * 4.5, duration: 0.3 }}
          x={234} y={135} fontFamily="monospace" fontSize={5} fill="#d97706" textAnchor="middle"
        >
          pub/sub
        </motion.text>

        {/* ═══ Col 4: Workflow Service (big wrapper box) ═══ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: FLOW_DELAY * 5, duration: 0.4 }}
        >
          <rect x={255} y={32} width={195} height={175} rx={6} fill="#faf5ff" stroke="#c4b5fd" strokeWidth={1.5} />
          <text x={352} y={49} textAnchor="middle" fontFamily="monospace" fontSize={8} fontWeight={700} fill="#7c3aed">
            Workflow Service
          </text>
        </motion.g>

        {/* Account Manager (main agent node) */}
        <Node x={272} y={57} w={160} h={38} label="Account Manager" sub="Supervisor · LangGraph · Claude/GPT" color="violet" delay={FLOW_DELAY * 5} />

        {/* Sub-agents row */}
        <motion.g
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: FLOW_DELAY * 6, duration: 0.35 }}
        >
          {/* Insight */}
          <rect x={268} y={104} width={38} height={20} rx={2} fill="#fff" stroke="#c4b5fd" strokeWidth={0.7} />
          <text x={287} y={117} textAnchor="middle" fontFamily="monospace" fontSize={5.5} fill="#7c3aed">Insight</text>
          {/* Campaign */}
          <rect x={310} y={104} width={44} height={20} rx={2} fill="#fff" stroke="#c4b5fd" strokeWidth={0.7} />
          <text x={332} y={117} textAnchor="middle" fontFamily="monospace" fontSize={5.5} fill="#7c3aed">Campaign</text>
          {/* Content */}
          <rect x={358} y={104} width={40} height={20} rx={2} fill="#fff" stroke="#c4b5fd" strokeWidth={0.7} />
          <text x={378} y={117} textAnchor="middle" fontFamily="monospace" fontSize={5.5} fill="#7c3aed">Content</text>
          {/* Recruit */}
          <rect x={402} y={104} width={38} height={20} rx={2} fill="#fff" stroke="#c4b5fd" strokeWidth={0.7} />
          <text x={421} y={117} textAnchor="middle" fontFamily="monospace" fontSize={5.5} fill="#7c3aed">Recruit</text>
          {/* Lines: Account Manager → sub-agents */}
          <line x1={305} y1={95} x2={287} y2={104} stroke="#c4b5fd" strokeWidth={0.6} />
          <line x1={335} y1={95} x2={332} y2={104} stroke="#c4b5fd" strokeWidth={0.6} />
          <line x1={370} y1={95} x2={378} y2={104} stroke="#c4b5fd" strokeWidth={0.6} />
          <line x1={400} y1={95} x2={421} y2={104} stroke="#c4b5fd" strokeWidth={0.6} />
        </motion.g>

        {/* Middleware Pipeline bar */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: FLOW_DELAY * 7, duration: 0.3 }}
        >
          <rect x={272} y={133} width={168} height={16} rx={8} fill="#f0e7ff" stroke="#ddd6fe" strokeWidth={0.7} />
          <text x={356} y={144} textAnchor="middle" fontFamily="monospace" fontSize={5.5} fill="#7c3aed">
            Middleware Pipeline × 5
          </text>
        </motion.g>

        {/* Checkpoint + Prompt Cache */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: FLOW_DELAY * 7, duration: 0.3 }}
        >
          <rect x={272} y={157} width={78} height={16} rx={3} fill="#fff" stroke="#d4d4d8" strokeWidth={0.7} />
          <text x={311} y={168} textAnchor="middle" fontFamily="monospace" fontSize={5.5} fill="#71717a">PG Checkpoint</text>
          <rect x={356} y={157} width={84} height={16} rx={3} fill="#fff" stroke="#d4d4d8" strokeWidth={0.7} />
          <text x={398} y={168} textAnchor="middle" fontFamily="monospace" fontSize={5.5} fill="#71717a">Prompt Cache</text>
        </motion.g>

        {/* LLM Factory text */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: FLOW_DELAY * 7, duration: 0.3 }}
          x={356} y={190} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#999"
        >
          Dynamic Model Selection · LLM Factory
        </motion.text>

        {/* ═══ Col 5: Tools API ═══ */}
        {/* Arrow: Workflow → Tools (amber) */}
        <Arrow points="450,76 472,58" delay={FLOW_DELAY * 7.5} stroke="#fcd34d" />
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: FLOW_DELAY * 7.5, duration: 0.3 }}
          x={467} y={48} fontFamily="monospace" fontSize={5} fill="#d97706" textAnchor="middle"
        >
          HTTP
        </motion.text>

        <Node x={472} y={32} w={90} h={28} label="Tools API" sub="Fastify · 독립 배포" color="amber" delay={FLOW_DELAY * 8} />

        {/* Tool items (2×3 grid) */}
        <Node x={472} y={66} w={43} h={16} label="제품 분석" color="orange" delay={FLOW_DELAY * 8} />
        <Node x={519} y={66} w={43} h={16} label="키워드" color="orange" delay={FLOW_DELAY * 8} />
        <Node x={472} y={86} w={43} h={16} label="성과 예측" color="orange" delay={FLOW_DELAY * 8} />
        <Node x={519} y={86} w={43} h={16} label="매칭" color="orange" delay={FLOW_DELAY * 8} />
        <Node x={472} y={106} w={43} h={16} label="레퍼런스" color="orange" delay={FLOW_DELAY * 8} />
        <Node x={519} y={106} w={43} h={16} label="크롤링" color="orange" delay={FLOW_DELAY * 8} />

        {/* ═══ Bottom: Pub/Sub Event Bus ═══ */}
        <Arrow points="352,207 352,222" delay={FLOW_DELAY * 8.5} dashed />

        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: FLOW_DELAY * 9, duration: 0.3 }}
        >
          <rect x={90} y={222} width={470} height={18} rx={9} fill="#fef3c7" stroke="#fcd34d" strokeWidth={1} />
          <text x={325} y={234} textAnchor="middle" fontFamily="monospace" fontSize={7} fontWeight={600} fill="#92400e">
            GCP Pub/Sub Event Bus
          </text>
        </motion.g>

        {/* Workers */}
        <Node x={100} y={250} w={75} h={20} label="Notification WK" color="zinc" delay={FLOW_DELAY * 10} />
        <Node x={185} y={250} w={60} h={20} label="History WK" color="zinc" delay={FLOW_DELAY * 10} />

        {/* DB */}
        <Node x={355} y={250} w={58} h={20} label="PostgreSQL" color="emerald" delay={FLOW_DELAY * 10} />
        <Node x={418} y={250} w={50} h={20} label="MongoDB" color="emerald" delay={FLOW_DELAY * 10} />
        <Node x={473} y={250} w={42} h={20} label="Redis" color="emerald" delay={FLOW_DELAY * 10} />

        {/* Dashed lines: Pub/Sub → Workers/DB */}
        <Arrow points="137,240 137,250" delay={FLOW_DELAY * 9.5} dashed />
        <Arrow points="215,240 215,250" delay={FLOW_DELAY * 9.5} dashed />
        <Arrow points="384,240 384,250" delay={FLOW_DELAY * 9.5} dashed />
        <Arrow points="443,240 443,250" delay={FLOW_DELAY * 9.5} dashed />
        <Arrow points="494,240 494,250" delay={FLOW_DELAY * 9.5} dashed />
      </svg>
    </motion.div>
  );
}

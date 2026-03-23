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
  color: "emerald" | "blue" | "amber" | "zinc" | "cyan" | "rose" | "violet" | "orange";
  delay: number;
  fontSize?: number;
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
    violet: {
      fill: "#ede9fe",
      stroke: "#c4b5fd",
      text: "#5b21b6",
      sub: "#7c3aed",
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
      markerEnd={strokeColor ? "url(#bonda-arrow-amber)" : "url(#bonda-arrow)"}
    />
  );
}

export function BondaHero({
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
      className={`relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/20 ${className ?? "h-[300px]"}`}
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
          BONDA
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

      {/* RAG Pipeline Diagram */}
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
            id="bonda-arrow"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0,0 0,6 9,3" fill="#ccc" />
          </marker>
          <marker id="bonda-arrow-amber" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0,0 0,6 9,3" fill="#fcd34d" />
          </marker>
        </defs>

        {/* ═══ PREPROCESSING TIER ═══ */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: FLOW_DELAY, duration: 0.3 }}
          x={20} y={38} fontFamily="monospace" fontSize={6} fontWeight={600} fill="#888"
        >
          PREPROCESSING
        </motion.text>

        {/* Crawler */}
        <Node x={15} y={45} w={55} h={28} label="Crawler" color="zinc" delay={FLOW_DELAY} fontSize={6.5} />
        <Arrow points="70,59 85,59" delay={FLOW_DELAY * 1.5} />

        {/* PyMuPDF / PaddleOCR */}
        <Node x={88} y={42} w={65} h={34} label="PyMuPDF" sub="PaddleOCR 폴백" color="amber" delay={FLOW_DELAY * 2} fontSize={6.5} />
        <Arrow points="153,59 168,59" delay={FLOW_DELAY * 2.5} />

        {/* Chunking */}
        <Node x={170} y={45} w={55} h={28} label="Chunking" color="blue" delay={FLOW_DELAY * 3} fontSize={6.5} />
        <Arrow points="225,59 240,59" delay={FLOW_DELAY * 3.5} />

        {/* Embedding */}
        <Node x={242} y={42} w={68} h={34} label="Embedding" sub="Gemini" color="blue" delay={FLOW_DELAY * 4} fontSize={6.5} />
        <Arrow points="310,59 325,59" delay={FLOW_DELAY * 4.5} />

        {/* Qdrant */}
        <Node x={327} y={42} w={70} h={34} label="Qdrant" sub="3 Collections" color="cyan" delay={FLOW_DELAY * 5} fontSize={7} />

        {/* Modal GPU */}
        <Node x={420} y={45} w={65} h={28} label="Modal GPU" sub="L40S · vLLM" color="zinc" delay={FLOW_DELAY * 3} fontSize={5.5} />

        {/* Dashed line: PaddleOCR → Modal GPU */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: FLOW_DELAY * 3, duration: 0.3 }}
        >
          <line x1={120} y1={76} x2={120} y2={82} stroke="#ccc" strokeWidth={0.6} strokeDasharray="2,2" />
          <line x1={120} y1={82} x2={420} y2={82} stroke="#ccc" strokeWidth={0.6} strokeDasharray="2,2" />
          <line x1={420} y1={82} x2={420} y2={73} stroke="#ccc" strokeWidth={0.6} strokeDasharray="2,2" />
        </motion.g>

        {/* ═══ Divider ═══ */}
        <motion.line
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: FLOW_DELAY * 5, duration: 0.3 }}
          x1={15} y1={92} x2={500} y2={92} stroke="#e4e4e7" strokeWidth={0.5} strokeDasharray="4,3"
        />

        {/* ═══ APPLICATION TIER ═══ */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: FLOW_DELAY * 5.5, duration: 0.3 }}
          x={20} y={108} fontFamily="monospace" fontSize={6} fontWeight={600} fill="#888"
        >
          APPLICATION
        </motion.text>

        {/* Client */}
        <Node x={15} y={115} w={55} h={32} label="Client" sub="Next.js" color="blue" delay={FLOW_DELAY * 6} fontSize={7} />
        <Arrow points="70,131 88,131" delay={FLOW_DELAY * 6.5} />

        {/* FastAPI */}
        <Node x={90} y={115} w={65} h={32} label="FastAPI" sub="AI Backend" color="emerald" delay={FLOW_DELAY * 7} fontSize={7} />
        <Arrow points="155,131 173,131" delay={FLOW_DELAY * 7.5} stroke="#6ee7b7" />

        {/* AI Agent big box */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: FLOW_DELAY * 8, duration: 0.4 }}
        >
          <rect x={175} y={100} width={225} height={108} rx={6} fill="#ecfdf5" stroke="#6ee7b7" strokeWidth={1.5} />
          <text x={287} y={115} textAnchor="middle" fontFamily="monospace" fontSize={7} fontWeight={700} fill="#065f46">
            AI Agent
          </text>
        </motion.g>

        {/* LangChain */}
        <Node x={192} y={122} w={100} h={28} label="LangChain" sub="Claude / Gemini" color="emerald" delay={FLOW_DELAY * 8} fontSize={7.5} />

        {/* 4 Tools */}
        <motion.g
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: FLOW_DELAY * 9, duration: 0.35 }}
        >
          <rect x={192} y={158} width={48} height={16} rx={2} fill="#ffe4e6" stroke="#fda4af" strokeWidth={0.7} />
          <text x={216} y={169} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#9f1239">문서 검색</text>
          <rect x={244} y={158} width={48} height={16} rx={2} fill="#ffe4e6" stroke="#fda4af" strokeWidth={0.7} />
          <text x={268} y={169} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#9f1239">이미지 검색</text>
          <rect x={296} y={158} width={48} height={16} rx={2} fill="#ffe4e6" stroke="#fda4af" strokeWidth={0.7} />
          <text x={320} y={169} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#9f1239">사전 조회</text>
          <rect x={348} y={158} width={44} height={16} rx={2} fill="#ffe4e6" stroke="#fda4af" strokeWidth={0.7} />
          <text x={370} y={169} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#9f1239">웹 검색</text>
          {/* Lines: LangChain → Tools */}
          <line x1={220} y1={150} x2={216} y2={158} stroke="#fda4af" strokeWidth={0.5} />
          <line x1={242} y1={150} x2={268} y2={158} stroke="#fda4af" strokeWidth={0.5} />
          <line x1={270} y1={150} x2={320} y2={158} stroke="#fda4af" strokeWidth={0.5} />
          <line x1={290} y1={150} x2={370} y2={158} stroke="#fda4af" strokeWidth={0.5} />
        </motion.g>

        {/* SSE Streaming + LangSmith */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: FLOW_DELAY * 9.5, duration: 0.3 }}
        >
          <rect x={192} y={182} width={80} height={14} rx={7} fill="#d1fae5" stroke="#a7f3d0" strokeWidth={0.7} />
          <text x={232} y={192} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#065f46">SSE Streaming</text>
          <rect x={280} y={182} width={70} height={14} rx={3} fill="#fff" stroke="#d4d4d8" strokeWidth={0.7} />
          <text x={315} y={192} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#71717a">LangSmith</text>
        </motion.g>

        {/* Agent → Qdrant dashed connection */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: FLOW_DELAY * 8.5, duration: 0.3 }}
        >
          <line x1={362} y1={100} x2={362} y2={76} stroke="#67e8f9" strokeWidth={1} strokeDasharray="3,2" />
          <text x={374} y={90} fontFamily="monospace" fontSize={4.5} fill="#0891b2">query</text>
        </motion.g>

        {/* GCS */}
        <Node x={420} y={115} w={65} h={28} label="GCS" sub="이미지 저장" color="zinc" delay={FLOW_DELAY * 9} fontSize={6} />

        {/* Dual Vector */}
        <motion.g
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: FLOW_DELAY * 9, duration: 0.35 }}
        >
          <rect x={420} y={155} width={78} height={32} rx={3} fill="#cffafe" stroke="#67e8f9" strokeWidth={0.8} />
          <text x={459} y={168} textAnchor="middle" fontFamily="monospace" fontSize={5.5} fontWeight={600} fill="#155e75">Dual Vector</text>
          <text x={459} y={179} textAnchor="middle" fontFamily="monospace" fontSize={4.5} fill="#0891b2">이미지 + 텍스트</text>
        </motion.g>

        {/* Dashed lines to GCS/DualVector */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: FLOW_DELAY * 9.5, duration: 0.3 }}
        >
          <line x1={392} y1={166} x2={420} y2={140} stroke="#ccc" strokeWidth={0.6} strokeDasharray="2,2" />
          <line x1={392} y1={166} x2={420} y2={170} stroke="#67e8f9" strokeWidth={0.6} strokeDasharray="2,2" />
        </motion.g>

        {/* ═══ INFRA BAR ═══ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: FLOW_DELAY * 10, duration: 0.3 }}
        >
          <rect x={90} y={222} width={400} height={16} rx={8} fill="#f4f4f5" stroke="#d4d4d8" strokeWidth={0.8} />
          <text x={290} y={233} textAnchor="middle" fontFamily="monospace" fontSize={6} fontWeight={600} fill="#52525b">
            Docker Compose · Vercel · LangSmith Tracing
          </text>
        </motion.g>

        {/* Bottom: DB/Storage */}
        <Node x={100} y={248} w={55} h={16} label="PostgreSQL" color="emerald" delay={FLOW_DELAY * 10.5} fontSize={5.5} />
        <Node x={160} y={248} w={48} h={16} label="Qdrant" color="cyan" delay={FLOW_DELAY * 10.5} fontSize={5.5} />
        <Node x={213} y={248} w={38} h={16} label="GCS" color="zinc" delay={FLOW_DELAY * 10.5} fontSize={5.5} />

        <Arrow points="127,238 127,248" delay={FLOW_DELAY * 10.5} dashed />
        <Arrow points="184,238 184,248" delay={FLOW_DELAY * 10.5} dashed />
        <Arrow points="232,238 232,248" delay={FLOW_DELAY * 10.5} dashed />
      </svg>
    </motion.div>
  );
}

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
}: {
  points: string;
  delay: number;
  dashed?: boolean;
}) {
  return (
    <motion.polyline
      initial={{ opacity: 0 }}
      animate={{ opacity: dashed ? 0.5 : 1 }}
      transition={{ delay, duration: 0.25 }}
      points={points}
      fill="none"
      stroke="#ccc"
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

        {/* ── AI Agent (center hub) ── */}
        <Node x={255} y={100} w={130} h={55} label="AI Agent" sub="자율 오케스트레이션" color="violet" delay={FLOW_DELAY} />

        {/* ── 브랜드 (top-left) ── */}
        <Node x={40} y={35} w={110} h={45} label="브랜드" sub="캠페인 요구사항 수집" color="blue" delay={FLOW_DELAY * 3} />

        {/* ── 크리에이터 (top-right) ── */}
        <Node x={490} y={35} w={110} h={45} label="크리에이터" sub="매칭 · 컨택 · 계약" color="amber" delay={FLOW_DELAY * 5} />

        {/* ── 콘텐츠 (bottom-center) ── */}
        <Node x={255} y={210} w={130} h={45} label="콘텐츠" sub="가이드 생성 · 검수" color="emerald" delay={FLOW_DELAY * 7} />

        {/* Arrows: Agent ↔ 브랜드 */}
        <Arrow points="255,118 155,72" delay={FLOW_DELAY * 2} />
        <Arrow points="150,80 255,133" delay={FLOW_DELAY * 2.5} dashed />

        {/* Arrows: Agent ↔ 크리에이터 */}
        <Arrow points="385,118 490,72" delay={FLOW_DELAY * 4} />
        <Arrow points="490,80 385,133" delay={FLOW_DELAY * 4.5} dashed />

        {/* Arrows: Agent ↔ 콘텐츠 */}
        <Arrow points="325,155 325,210" delay={FLOW_DELAY * 6} />
        <Arrow points="315,210 315,155" delay={FLOW_DELAY * 6.5} dashed />

        {/* ── 브랜드 세부 기능 (zinc, left column) ── */}
        <Arrow points="95,80 95,105" delay={FLOW_DELAY * 9} dashed />
        <Node x={30} y={105} w={100} h={30} label="URL·PDF 크롤링" color="zinc" delay={FLOW_DELAY * 9.5} />
        <Arrow points="80,135 80,150" delay={FLOW_DELAY * 10} dashed />
        <Node x={30} y={150} w={100} h={30} label="캠페인 브리프" color="zinc" delay={FLOW_DELAY * 10.5} />

        {/* ── 크리에이터 세부 기능 (zinc, right column) ── */}
        <Arrow points="545,80 545,105" delay={FLOW_DELAY * 9} dashed />
        <Node x={500} y={105} w={100} h={30} label="크리에이터 DB" color="zinc" delay={FLOW_DELAY * 9.5} />
        <Arrow points="550,135 550,150" delay={FLOW_DELAY * 10} dashed />
        <Node x={500} y={150} w={100} h={30} label="AI 커뮤니케이션" color="zinc" delay={FLOW_DELAY * 10.5} />

        {/* ── 콘텐츠 세부 기능 (zinc, bottom sides) ── */}
        <Arrow points="255,232 210,232" delay={FLOW_DELAY * 9} dashed />
        <Node x={115} y={218} w={95} h={30} label="가이드 생성" color="zinc" delay={FLOW_DELAY * 9.5} />
        <Arrow points="385,232 430,232" delay={FLOW_DELAY * 10} dashed />
        <Node x={430} y={218} w={95} h={30} label="콘텐츠 검수" color="zinc" delay={FLOW_DELAY * 10.5} />

        {/* ── Edge labels ── */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: FLOW_DELAY * 3, duration: 0.3 }}
          x={190} y={88} fontFamily="monospace" fontSize={6.5} fill="#666" textAnchor="middle"
        >
          분석 · 기획
        </motion.text>
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: FLOW_DELAY * 5, duration: 0.3 }}
          x={450} y={88} fontFamily="monospace" fontSize={6.5} fill="#666" textAnchor="middle"
        >
          탐색 · 협업
        </motion.text>
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: FLOW_DELAY * 7, duration: 0.3 }}
          x={350} y={192} fontFamily="monospace" fontSize={6.5} fill="#666" textAnchor="middle"
        >
          생성 · 관리
        </motion.text>

        {/* ── Bottom note ── */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: FLOW_DELAY * 12, duration: 0.4 }}
          x={320}
          y={268}
          fontFamily="monospace"
          fontSize={7}
          fill="#999"
          textAnchor="middle"
        >
          LangChain multi-agent · GCP Pub/Sub · WebSocket streaming
        </motion.text>
      </svg>
    </motion.div>
  );
}

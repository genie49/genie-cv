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
      markerEnd={strokeColor ? "url(#heirloom-arrow-amber)" : "url(#heirloom-arrow)"}
    />
  );
}

export function HeirloomHero({
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
          HEIRLOOM
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
            id="heirloom-arrow"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0,0 0,6 9,3" fill="#ccc" />
          </marker>
          <marker id="heirloom-arrow-amber" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0,0 0,6 9,3" fill="#fcd34d" />
          </marker>
        </defs>

        {/* ═══ IMAGE PIPELINE (top) ═══ */}
        <motion.text initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: FLOW_DELAY, duration: 0.3 }}
          x={20} y={40} fontFamily="monospace" fontSize={5.5} fontWeight={600} fill="#888"
        >
          IMAGE PIPELINE
        </motion.text>

        <Node x={15} y={48} w={62} h={28} label="Upload" sub="유물 사진" color="zinc" delay={FLOW_DELAY} fontSize={6} />
        <Arrow points="77,62 92,62" delay={FLOW_DELAY * 1.5} />

        <Node x={95} y={48} w={52} h={28} label="S3" sub="원본 저장" color="cyan" delay={FLOW_DELAY * 2} fontSize={6} />
        <Arrow points="147,62 162,62" delay={FLOW_DELAY * 2.5} />

        <Node x={165} y={45} w={88} h={34} label="Preprocess" sub="배경·손 제거 (GPU)" color="amber" delay={FLOW_DELAY * 3} fontSize={6.5} />
        <Arrow points="253,62 268,62" delay={FLOW_DELAY * 3.5} />

        <Node x={271} y={45} w={78} h={34} label="기준자 검출" sub="실제 크기 기준" color="amber" delay={FLOW_DELAY * 4} fontSize={6.5} />
        <Arrow points="349,62 364,62" delay={FLOW_DELAY * 4.5} />

        <Node x={367} y={45} w={68} h={34} label="PostgreSQL" sub="유물 DB" color="cyan" delay={FLOW_DELAY * 5} fontSize={6.5} />

        {/* ═══ Divider ═══ */}
        <motion.line initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: FLOW_DELAY * 5.5, duration: 0.3 }}
          x1={15} y1={90} x2={500} y2={90} stroke="#e4e4e7" strokeWidth={0.5} strokeDasharray="4,3"
        />

        {/* ═══ APPLICATION (bottom) ═══ */}
        <motion.text initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: FLOW_DELAY * 6, duration: 0.3 }}
          x={20} y={108} fontFamily="monospace" fontSize={5.5} fontWeight={600} fill="#888"
        >
          APPLICATION
        </motion.text>

        {/* 학예사 화면 */}
        <Node x={15} y={115} w={64} h={35} label="Next.js" sub="학예사 화면" color="blue" delay={FLOW_DELAY * 6.5} fontSize={7} />
        <Arrow points="79,132 96,132" delay={FLOW_DELAY * 7} />

        {/* API */}
        <Node x={99} y={112} w={66} h={40} label="API Routes" sub="유물·상자·검색" color="emerald" delay={FLOW_DELAY * 7} fontSize={6.5} />
        <Arrow points="165,132 180,132" delay={FLOW_DELAY * 7.5} stroke="#6ee7b7" />

        {/* AI 서버 big box */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: FLOW_DELAY * 8, duration: 0.4 }}>
          <rect x={182} y={100} width={210} height={84} rx={6} fill="#ecfdf5" stroke="#6ee7b7" strokeWidth={1.5} />
          <text x={287} y={116} textAnchor="middle" fontFamily="monospace" fontSize={7} fontWeight={700} fill="#065f46">AI Server (FastAPI)</text>
        </motion.g>

        <Node x={198} y={124} w={90} h={26} label="Gemini" sub="멀티모달 · LangChain" color="emerald" delay={FLOW_DELAY * 8} fontSize={7} />

        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: FLOW_DELAY * 9, duration: 0.35 }}>
          <rect x={296} y={124} width={82} height={26} rx={3} fill="#ffe4e6" stroke="#fda4af" strokeWidth={0.8} />
          <text x={337} y={137} textAnchor="middle" fontFamily="monospace" fontSize={5.5} fontWeight={600} fill="#9f1239">분류 항목 추천</text>
          <text x={337} y={147} textAnchor="middle" fontFamily="monospace" fontSize={4.5} fill="#e11d48">재질·기종·문양·마크</text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: FLOW_DELAY * 10, duration: 0.3 }}>
          <rect x={198} y={158} width={80} height={14} rx={7} fill="#d1fae5" stroke="#a7f3d0" strokeWidth={0.7} />
          <text x={238} y={168} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#065f46">채팅 에이전트 (SSE)</text>
          <rect x={284} y={158} width={95} height={14} rx={3} fill="#fef3c7" stroke="#fcd34d" strokeWidth={0.7} />
          <text x={331} y={168} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#92400e">대화 체크포인트</text>
        </motion.g>

        {/* 학예사 검수 */}
        <Node x={415} y={115} w={80} h={35} label="학예사 검수" sub="확인 후 등록" color="violet" delay={FLOW_DELAY * 9} fontSize={6} />
        <Arrow points="392,132 412,132" delay={FLOW_DELAY * 9.5} />

        {/* ═══ DEPLOY BAR ═══ */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: FLOW_DELAY * 11, duration: 0.3 }}>
          <rect x={90} y={222} width={320} height={16} rx={8} fill="#f4f4f5" stroke="#d4d4d8" strokeWidth={0.8} />
          <text x={250} y={233} textAnchor="middle" fontFamily="monospace" fontSize={6} fontWeight={600} fill="#52525b">
            k3s · Kustomize · Traefik · GitHub Actions
          </text>
        </motion.g>

        <Node x={100} y={248} w={60} h={16} label="PostgreSQL" color="cyan" delay={FLOW_DELAY * 11.5} fontSize={5.5} />
        <Node x={165} y={248} w={45} h={16} label="Redis" color="cyan" delay={FLOW_DELAY * 11.5} fontSize={5.5} />
        <Node x={215} y={248} w={80} h={16} label="Loki · Grafana" color="zinc" delay={FLOW_DELAY * 11.5} fontSize={5.5} />

        <Arrow points="130,238 130,248" delay={FLOW_DELAY * 11.5} dashed />
        <Arrow points="187,238 187,248" delay={FLOW_DELAY * 11.5} dashed />
        <Arrow points="255,238 255,248" delay={FLOW_DELAY * 11.5} dashed />
      </svg>
    </motion.div>
  );
}

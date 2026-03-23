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
  fs,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  color: "emerald" | "blue" | "amber" | "zinc" | "cyan" | "rose" | "violet" | "orange";
  delay: number;
  fs?: number;
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
      markerEnd={strokeColor ? "url(#vocatoktok-arrow-amber)" : "url(#vocatoktok-arrow)"}
    />
  );
}

export function VocaTokTokHero({
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
          VOCATOKTOK
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
            id="vocatoktok-arrow"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0,0 0,6 9,3" fill="#ccc" />
          </marker>
          <marker id="vocatoktok-arrow-amber" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0,0 0,6 9,3" fill="#fcd34d" />
          </marker>
        </defs>

        {/* ═══ Col 1: Client ═══ */}
        <Node x={12} y={80} w={58} h={35} label="Client" sub="Next.js 14" color="blue" delay={FLOW_DELAY} fs={7} />
        <Arrow points="70,97 85,97" delay={FLOW_DELAY * 1.5} />

        {/* ═══ Col 2: API Routes ═══ */}
        <Node x={88} y={72} w={65} h={50} label="API Routes" sub="Route Handlers" color="emerald" delay={FLOW_DELAY * 2} fs={6.5} />

        {/* Arrows to services */}
        <Arrow points="153,85 170,55" delay={FLOW_DELAY * 2.5} />
        <Arrow points="153,97 170,97" delay={FLOW_DELAY * 2.5} />
        <Arrow points="153,109 170,155" delay={FLOW_DELAY * 2.5} />

        {/* ═══ Col 3: 학습 시스템 (big box) ═══ */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: FLOW_DELAY * 3, duration: 0.4 }}>
          <rect x={168} y={30} width={240} height={115} rx={6} fill="#eff6ff" stroke="#93c5fd" strokeWidth={1.5} />
          <text x={288} y={46} textAnchor="middle" fontFamily="monospace" fontSize={7} fontWeight={700} fill="#1e40af">학습 시스템</text>
        </motion.g>

        {/* Study Modes */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: FLOW_DELAY * 3.5, duration: 0.35 }}>
          <rect x={180} y={54} width={50} height={22} rx={2} fill="#dbeafe" stroke="#93c5fd" strokeWidth={0.7} />
          <text x={205} y={68} textAnchor="middle" fontFamily="monospace" fontSize={5.5} fill="#1e40af">RDT</text>
          <rect x={234} y={54} width={50} height={22} rx={2} fill="#dbeafe" stroke="#93c5fd" strokeWidth={0.7} />
          <text x={259} y={68} textAnchor="middle" fontFamily="monospace" fontSize={5.5} fill="#1e40af">RET</text>
          <rect x={288} y={54} width={55} height={22} rx={2} fill="#dbeafe" stroke="#93c5fd" strokeWidth={0.7} />
          <text x={315} y={68} textAnchor="middle" fontFamily="monospace" fontSize={5.5} fill="#1e40af">Selection</text>
          <rect x={347} y={54} width={52} height={22} rx={2} fill="#dbeafe" stroke="#93c5fd" strokeWidth={0.7} />
          <text x={373} y={68} textAnchor="middle" fontFamily="monospace" fontSize={5.5} fill="#1e40af">다국어</text>
        </motion.g>

        {/* ═══ Learning Loop (violet box inside) ═══ */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: FLOW_DELAY * 4, duration: 0.4 }}>
          <rect x={180} y={82} width={218} height={55} rx={4} fill="#faf5ff" stroke="#c4b5fd" strokeWidth={1.2} />
          <text x={289} y={96} textAnchor="middle" fontFamily="monospace" fontSize={6} fontWeight={700} fill="#5b21b6">반복 학습 루프</text>
        </motion.g>

        {/* Loop steps */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: FLOW_DELAY * 5, duration: 0.35 }}>
          <rect x={186} y={102} width={40} height={14} rx={2} fill="#ede9fe" stroke="#c4b5fd" strokeWidth={0.6} />
          <text x={206} y={112} textAnchor="middle" fontFamily="monospace" fontSize={4.5} fill="#5b21b6">연습</text>
          <text x={230} y={112} textAnchor="middle" fontFamily="monospace" fontSize={6} fill="#c4b5fd">→</text>
          <rect x={236} y={102} width={40} height={14} rx={2} fill="#ede9fe" stroke="#c4b5fd" strokeWidth={0.6} />
          <text x={256} y={112} textAnchor="middle" fontFamily="monospace" fontSize={4.5} fill="#5b21b6">테스트</text>
          <text x={280} y={112} textAnchor="middle" fontFamily="monospace" fontSize={6} fill="#c4b5fd">→</text>
          <rect x={286} y={102} width={42} height={14} rx={2} fill="#ffe4e6" stroke="#fda4af" strokeWidth={0.6} />
          <text x={307} y={112} textAnchor="middle" fontFamily="monospace" fontSize={4.5} fill="#9f1239">오답</text>
          <text x={332} y={112} textAnchor="middle" fontFamily="monospace" fontSize={6} fill="#fda4af">→</text>
          <rect x={338} y={102} width={42} height={14} rx={2} fill="#ede9fe" stroke="#c4b5fd" strokeWidth={0.6} />
          <text x={359} y={112} textAnchor="middle" fontFamily="monospace" fontSize={4.5} fill="#5b21b6">재시험</text>
          {/* Loop back arrow (curved path) */}
          <path d="M307,116 C307,128 206,128 206,116" stroke="#c4b5fd" strokeWidth={0.7} fill="none" strokeDasharray="2,2" />
          <polygon points="204,118 206,114 208,118" fill="#c4b5fd" />
        </motion.g>

        {/* Know/Don't Know text */}
        <motion.text initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: FLOW_DELAY * 5.5, duration: 0.3 }}
          x={289} y={132} textAnchor="middle" fontFamily="monospace" fontSize={4.5} fill="#7c3aed"
        >
          corr - inco ≥ 임계값 → 아는 단어 판별
        </motion.text>

        {/* ═══ Right side services ═══ */}
        {/* Google TTS */}
        <Arrow points="399,60 428,50" delay={FLOW_DELAY * 6} stroke="#fcd34d" />
        <Node x={428} y={35} w={80} h={28} label="Google TTS" sub="발음 학습" color="amber" delay={FLOW_DELAY * 6} fs={6.5} />

        {/* AES-256 */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: FLOW_DELAY * 6.5, duration: 0.3 }}>
          <line x1={399} y1={85} x2={428} y2={83} stroke="#ccc" strokeWidth={0.6} strokeDasharray="2,2" />
        </motion.g>
        <Node x={428} y={72} w={80} h={22} label="AES-256" color="rose" delay={FLOW_DELAY * 6.5} fs={6} />

        {/* Level System */}
        <Arrow points="398,120 428,116" delay={FLOW_DELAY * 7} stroke="#c4b5fd" />
        <Node x={428} y={102} w={80} h={28} label="레벨 시스템" sub="난이도 자동 조절" color="violet" delay={FLOW_DELAY * 7} fs={5.5} />

        {/* ═══ Bottom: Academy + DB ═══ */}
        <Node x={168} y={150} w={115} h={34} label="학원 관리" sub="학교·반·학생·강사" color="amber" delay={FLOW_DELAY * 8} fs={6} />

        <Node x={300} y={150} w={55} h={34} label="Prisma" sub="ORM" color="cyan" delay={FLOW_DELAY * 8} fs={6.5} />
        <Arrow points="355,167 370,167" delay={FLOW_DELAY * 8.5} />
        <Node x={372} y={150} w={75} h={34} label="MySQL" sub="AWS RDS · UTF-8" color="cyan" delay={FLOW_DELAY * 8.5} fs={6.5} />

        <Node x={460} y={155} w={48} h={24} label="PWA" color="zinc" delay={FLOW_DELAY * 9} fs={5.5} />

        {/* ═══ Infra bar ═══ */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: FLOW_DELAY * 10, duration: 0.3 }}>
          <rect x={90} y={210} width={420} height={16} rx={8} fill="#f4f4f5" stroke="#d4d4d8" strokeWidth={0.8} />
          <text x={300} y={221} textAnchor="middle" fontFamily="monospace" fontSize={6} fontWeight={600} fill="#52525b">
            Vercel · AWS RDS/S3/Lambda · Sentry · PWA
          </text>
        </motion.g>

        <Node x={100} y={236} w={50} h={14} label="Vercel" color="emerald" delay={FLOW_DELAY * 10.5} fs={5.5} />
        <Node x={155} y={236} w={55} h={14} label="AWS S3" color="zinc" delay={FLOW_DELAY * 10.5} fs={5.5} />
        <Node x={215} y={236} w={60} h={14} label="Lambda" color="zinc" delay={FLOW_DELAY * 10.5} fs={5.5} />
        <Node x={280} y={236} w={50} h={14} label="Sentry" color="zinc" delay={FLOW_DELAY * 10.5} fs={5.5} />

        <Arrow points="125,226 125,236" delay={FLOW_DELAY * 10.5} dashed />
        <Arrow points="182,226 182,236" delay={FLOW_DELAY * 10.5} dashed />
        <Arrow points="245,226 245,236" delay={FLOW_DELAY * 10.5} dashed />
        <Arrow points="305,226 305,236" delay={FLOW_DELAY * 10.5} dashed />
      </svg>
    </motion.div>
  );
}

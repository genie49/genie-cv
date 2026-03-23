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
  color: "violet" | "emerald" | "blue" | "amber" | "zinc" | "rose" | "cyan" | "orange";
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
    rose: {
      fill: "#ffe4e6",
      stroke: "#fda4af",
      text: "#9f1239",
      sub: "#e11d48",
    },
    cyan: {
      fill: "#cffafe",
      stroke: "#67e8f9",
      text: "#155e75",
      sub: "#0891b2",
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
      markerEnd={strokeColor ? "url(#bara-arrow-amber)" : "url(#bara-arrow)"}
    />
  );
}

export function HeyBaraHero({
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
      className={`relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 ${className ?? "h-[300px]"}`}
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
          HEY BARA
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

      {/* Voice Pipeline Flow Diagram */}
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
            id="bara-arrow"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0,0 0,6 9,3" fill="#ccc" />
          </marker>
          <marker
            id="bara-arrow-amber"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0,0 0,6 9,3" fill="#fcd34d" />
          </marker>
        </defs>

        {/* ═══ VOICE INPUT (left) ═══ */}
        <motion.text
          initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
          transition={{ delay: FLOW_DELAY, duration: 0.3 }}
          x={20} y={42} fontFamily="monospace" fontSize={5.5} fontWeight={600} fill="#888"
        >
          VOICE INPUT
        </motion.text>

        <Node x={15} y={50} w={70} h={30} label="Wake Word" sub="Sherpa-ONNX KWS" color="blue" delay={FLOW_DELAY} fontSize={6.5} />

        {/* Arrow down: KWS → STT */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: FLOW_DELAY * 2, duration: 0.25 }}>
          <line x1={50} y1={80} x2={50} y2={92} stroke="#ccc" strokeWidth={0.8} />
          <polygon points="47,89 53,89 50,93" fill="#ccc" />
        </motion.g>

        <Node x={15} y={94} w={70} h={30} label="STT" sub="Zipformer Korean" color="blue" delay={FLOW_DELAY * 2} fontSize={6.5} />

        {/* Arrow: STT → Agent */}
        <Arrow points="85,109 110,109" delay={FLOW_DELAY * 3} />

        {/* ═══ KOOG AI AGENT (center big box) ═══ */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: FLOW_DELAY * 3.5, duration: 0.4 }}>
          <rect x={112} y={38} width={230} height={150} rx={6} fill="#ecfdf5" stroke="#6ee7b7" strokeWidth={1.5} />
          <text x={227} y={54} textAnchor="middle" fontFamily="monospace" fontSize={7.5} fontWeight={700} fill="#065f46">Koog AI Agent</text>
        </motion.g>

        {/* Gemini API */}
        <Node x={130} y={62} w={120} h={28} label="Gemini API" sub="Function Calling" color="emerald" delay={FLOW_DELAY * 4} fontSize={8} />

        {/* Tool categories */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: FLOW_DELAY * 5, duration: 0.35 }}>
          <rect x={126} y={98} width={52} height={16} rx={2} fill="#ffe4e6" stroke="#fda4af" strokeWidth={0.7} />
          <text x={152} y={109} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#9f1239">전화 · 문자</text>
          <rect x={182} y={98} width={50} height={16} rx={2} fill="#ffe4e6" stroke="#fda4af" strokeWidth={0.7} />
          <text x={207} y={109} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#9f1239">카카오톡</text>
          <rect x={236} y={98} width={50} height={16} rx={2} fill="#ffe4e6" stroke="#fda4af" strokeWidth={0.7} />
          <text x={261} y={109} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#9f1239">일정 · 할일</text>
          <rect x={290} y={98} width={44} height={16} rx={2} fill="#ffe4e6" stroke="#fda4af" strokeWidth={0.7} />
          <text x={312} y={109} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#9f1239">앱 제어</text>
          <line x1={160} y1={90} x2={152} y2={98} stroke="#fda4af" strokeWidth={0.5} />
          <line x1={190} y1={90} x2={207} y2={98} stroke="#fda4af" strokeWidth={0.5} />
          <line x1={210} y1={90} x2={261} y2={98} stroke="#fda4af" strokeWidth={0.5} />
          <line x1={240} y1={90} x2={312} y2={98} stroke="#fda4af" strokeWidth={0.5} />
        </motion.g>

        {/* Human-in-the-Loop + VoiceSession FSM */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: FLOW_DELAY * 6, duration: 0.3 }}>
          <rect x={126} y={122} width={100} height={14} rx={7} fill="#fef3c7" stroke="#fcd34d" strokeWidth={0.7} />
          <text x={176} y={132} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#92400e">Human-in-the-Loop</text>
          <rect x={232} y={122} width={100} height={14} rx={3} fill="#fff" stroke="#d4d4d8" strokeWidth={0.7} />
          <text x={282} y={132} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#71717a">VoiceSession FSM</text>
        </motion.g>

        {/* History + System Prompt */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: FLOW_DELAY * 6, duration: 0.3 }}>
          <rect x={126} y={144} width={80} height={14} rx={3} fill="#fff" stroke="#d4d4d8" strokeWidth={0.7} />
          <text x={166} y={154} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#71717a">대화 히스토리</text>
          <rect x={212} y={144} width={80} height={14} rx={3} fill="#fff" stroke="#d4d4d8" strokeWidth={0.7} />
          <text x={252} y={154} textAnchor="middle" fontFamily="monospace" fontSize={5} fill="#71717a">System Prompt</text>
        </motion.g>

        {/* ForegroundService text */}
        <motion.text initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: FLOW_DELAY * 6, duration: 0.3 }}
          x={227} y={178} textAnchor="middle" fontFamily="monospace" fontSize={4.5} fill="#999"
        >
          ForegroundService · 화면 꺼져도 상시 대기
        </motion.text>

        {/* ═══ VOICE OUTPUT (right top) ═══ */}
        <Arrow points="342,75 360,75" delay={FLOW_DELAY * 7} stroke="#6ee7b7" />

        <motion.text initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: FLOW_DELAY * 7, duration: 0.3 }}
          x={370} y={42} fontFamily="monospace" fontSize={5.5} fontWeight={600} fill="#888"
        >
          VOICE OUTPUT
        </motion.text>

        <Node x={362} y={50} w={78} h={34} label="TTS" sub="Supertonic 2" color="amber" delay={FLOW_DELAY * 7} fontSize={7} />

        {/* ═══ DEVICE API (right bottom) ═══ */}
        <motion.text initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: FLOW_DELAY * 8, duration: 0.3 }}
          x={370} y={105} fontFamily="monospace" fontSize={5.5} fontWeight={600} fill="#888"
        >
          DEVICE API
        </motion.text>

        <Node x={362} y={112} w={78} h={20} label="Accessibility" color="zinc" delay={FLOW_DELAY * 8} fontSize={5.5} />
        <Node x={362} y={138} w={78} h={20} label="Calendar API" color="zinc" delay={FLOW_DELAY * 8.5} fontSize={5.5} />
        <Node x={362} y={164} w={78} h={20} label="SmsManager" color="zinc" delay={FLOW_DELAY * 9} fontSize={5.5} />

        {/* Dashed lines: Tools → Device APIs */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: FLOW_DELAY * 9, duration: 0.3 }}>
          <line x1={334} y1={106} x2={362} y2={122} stroke="#ccc" strokeWidth={0.6} strokeDasharray="2,2" />
          <line x1={286} y1={114} x2={362} y2={148} stroke="#ccc" strokeWidth={0.6} strokeDasharray="2,2" />
          <line x1={152} y1={114} x2={362} y2={174} stroke="#ccc" strokeWidth={0.6} strokeDasharray="2,2" />
        </motion.g>

        {/* ═══ ANDROID PLATFORM BAR ═══ */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: FLOW_DELAY * 10, duration: 0.3 }}>
          <rect x={90} y={218} width={360} height={16} rx={8} fill="#ede9fe" stroke="#c4b5fd" strokeWidth={0.8} />
          <text x={270} y={229} textAnchor="middle" fontFamily="monospace" fontSize={6} fontWeight={600} fill="#5b21b6">
            Android · Kotlin · Jetpack Compose · Clean Architecture
          </text>
        </motion.g>

        <Node x={100} y={244} w={50} h={16} label="Room DB" color="zinc" delay={FLOW_DELAY * 10.5} fontSize={5.5} />
        <Node x={155} y={244} w={65} h={16} label="SecurePref" color="zinc" delay={FLOW_DELAY * 10.5} fontSize={5.5} />
        <Node x={225} y={244} w={65} h={16} label="OAuth 2.0" color="zinc" delay={FLOW_DELAY * 10.5} fontSize={5.5} />

        <Arrow points="125,234 125,244" delay={FLOW_DELAY * 10.5} dashed />
        <Arrow points="187,234 187,244" delay={FLOW_DELAY * 10.5} dashed />
        <Arrow points="257,234 257,244" delay={FLOW_DELAY * 10.5} dashed />
      </svg>
    </motion.div>
  );
}

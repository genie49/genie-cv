import { motion, AnimatePresence } from "motion/react";
import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, User, Cpu, X } from "lucide-react";
import AboutPanel from "../components/dashboard/AboutPanel";
import TechStackPanel from "../components/dashboard/TechStackPanel";
import ProjectCard from "../components/dashboard/ProjectCard";
import EducationPanel from "../components/dashboard/EducationPanel";
import ExperiencePanel from "../components/dashboard/ExperiencePanel";
import projects from "@data/projects.json";
import type { Project } from "@genie-cv/shared";

const allProjects = projects as Project[];

const CARD_W = 380;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

/* ── Mobile: single card carousel with swipe + arrows ── */
function MobileProjectCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchRef = useRef<{ startX: number; startY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (dir: number) => {
      setDirection(dir);
      setCurrent((prev) => {
        const next = prev + dir;
        if (next < 0) return 0;
        if (next >= allProjects.length) return allProjects.length - 1;
        return next;
      });
    },
    [],
  );

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY };
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchRef.current) return;
      const dx = e.changedTouches[0].clientX - touchRef.current.startX;
      const dy = e.changedTouches[0].clientY - touchRef.current.startY;
      touchRef.current = null;
      if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;
      go(dx < 0 ? 1 : -1);
    },
    [go],
  );

  // 수평 스와이프 시 페이지 스크롤 방지
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0;
    let startY = 0;
    let decided = false;
    let isHorizontal = false;

    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      decided = false;
      isHorizontal = false;
    };
    const onMove = (e: TouchEvent) => {
      if (!decided) {
        const dx = Math.abs(e.touches[0].clientX - startX);
        const dy = Math.abs(e.touches[0].clientY - startY);
        if (dx > 10 || dy > 10) {
          decided = true;
          isHorizontal = dx > dy;
        }
      }
      if (isHorizontal) e.preventDefault();
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
    };
  }, []);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex flex-col gap-3"
    >
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ height: 280 }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0"
          >
            <div className="h-full">
              <ProjectCard project={allProjects[current]} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav: arrows + dots */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => go(-1)}
          disabled={current === 0}
          className="rounded-full p-1.5 text-toss-sub transition-colors hover:bg-toss-bg hover:text-toss-heading disabled:opacity-30"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex gap-1.5">
          {allProjects.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-4 bg-toss-heading" : "w-1.5 bg-toss-border"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          disabled={current === allProjects.length - 1}
          className="rounded-full p-1.5 text-toss-sub transition-colors hover:bg-toss-bg hover:text-toss-heading disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}

/* ── Desktop: horizontal scroll + drag ── */
function DesktopProjectsRow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ isDown: boolean; startX: number; scrollLeft: number }>({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    dragState.current = { isDown: true, startX: e.clientX, scrollLeft: el.scrollLeft };
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragState.current;
    if (!d.isDown || !scrollRef.current) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) setIsDragging(true);
    scrollRef.current.scrollLeft = d.scrollLeft - dx;
  }, []);

  const onPointerUp = useCallback(() => {
    dragState.current.isDown = false;
    setTimeout(() => setIsDragging(false), 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div
        ref={scrollRef}
        className="flex items-stretch gap-5 overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {allProjects.map((project) => (
          <div
            key={project.slug}
            className="shrink-0"
            style={{ width: CARD_W, height: 280 }}
          >
            <div className="h-full" style={{ pointerEvents: isDragging ? "none" : "auto" }}>
              <ProjectCard project={project} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ProjectsRow() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileProjectCarousel /> : <DesktopProjectsRow />;
}

/* ── Modal ── */
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/40" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl bg-toss-bg p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 rounded-full bg-toss-card p-1.5 text-toss-sub shadow-sm hover:text-toss-heading"
            >
              <X size={16} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Mobile About/TechStack Buttons ── */
function MobileTopButtons() {
  const [modal, setModal] = useState<"about" | "tech" | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex gap-3 md:hidden"
      >
        <button
          onClick={() => setModal("about")}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-toss-card py-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)] text-sm font-semibold text-toss-heading active:scale-[0.98] transition-transform"
        >
          <User size={16} className="text-toss-blue" />
          About
        </button>
        <button
          onClick={() => setModal("tech")}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-toss-card py-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)] text-sm font-semibold text-toss-heading active:scale-[0.98] transition-transform"
        >
          <Cpu size={16} className="text-toss-blue" />
          Tech Stack
        </button>
      </motion.div>

      <Modal open={modal === "about"} onClose={() => setModal(null)}>
        <AboutPanel />
      </Modal>
      <Modal open={modal === "tech"} onClose={() => setModal(null)}>
        <TechStackPanel />
      </Modal>
    </>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Mobile: About + Tech Stack buttons */}
      <MobileTopButtons />

      {/* Desktop: About + Tech Stack panels */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex gap-5"
      >
        <div className="flex-1">
          <AboutPanel />
        </div>
        <div className="flex-1">
          <TechStackPanel />
        </div>
      </motion.div>

      {/* Projects Row */}
      <ProjectsRow />

      {/* Bottom Row: Education + Experience */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex flex-col md:flex-row gap-5"
      >
        <div className="flex-1">
          <EducationPanel />
        </div>
        <div className="flex-1">
          <ExperiencePanel />
        </div>
      </motion.div>
    </div>
  );
}

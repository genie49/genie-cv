import { motion } from "motion/react";
import { useRef, useState, useCallback } from "react";
import AboutPanel from "../components/dashboard/AboutPanel";
import TechStackPanel from "../components/dashboard/TechStackPanel";
import ProjectCard from "../components/dashboard/ProjectCard";
import EducationPanel from "../components/dashboard/EducationPanel";
import ExperiencePanel from "../components/dashboard/ExperiencePanel";
import projects from "@data/projects.json";
import type { Project } from "@genie-cv/shared";

const allProjects = projects as Project[];

const CARD_W = 320;

function ProjectsScrollRow() {
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
        className="flex gap-5 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-200 hover:scrollbar-thumb-zinc-300 cursor-grab active:cursor-grabbing select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {allProjects.map((project) => (
          <div
            key={project.slug}
            className="shrink-0"
            style={{ width: CARD_W }}
          >
            <div style={{ pointerEvents: isDragging ? "none" : "auto" }}>
              <ProjectCard project={project} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Top Row: About + Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row gap-5"
      >
        <div className="flex-1">
          <AboutPanel />
        </div>
        <div className="flex-1">
          <TechStackPanel />
        </div>
      </motion.div>

      {/* Projects Row — horizontal scroll + drag */}
      <ProjectsScrollRow />

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

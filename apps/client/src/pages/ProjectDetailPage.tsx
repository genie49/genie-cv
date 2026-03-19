import { useParams, Link } from "react-router";
import { useRef, useCallback } from "react";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { FingooHero } from "../components/ProjectHero";
import { KimproHero } from "../components/KimproHero";
import { HeyBaraHero } from "../components/HeyBaraHero";
import { ChatbotHero } from "../components/ChatbotHero";
import { BondaHero } from "../components/BondaHero";
import projects from "@data/projects.json";
import type { Project } from "@genie-cv/shared";

function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef<{ isDown: boolean; startX: number; scrollLeft: number }>({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
  });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    state.current = { isDown: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft };
    el.style.cursor = "grabbing";
  }, []);

  const onMouseUp = useCallback(() => {
    state.current.isDown = false;
    if (ref.current) ref.current.style.cursor = "grab";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!state.current.isDown || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - state.current.startX) * 1.5;
    ref.current.scrollLeft = state.current.scrollLeft - walk;
  }, []);

  return { ref, onMouseDown, onMouseUp, onMouseLeave: onMouseUp, onMouseMove };
}

const allProjects = projects as Project[];

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = allProjects.find((p) => p.slug === slug);
  const dragScroll = useDragScroll();

  if (!project) {
    return <div className="p-8 text-toss-body">프로젝트를 찾을 수 없습니다.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 p-8"
    >
      {/* Back */}
      <Link
        to="/projects"
        className="flex items-center gap-2 text-[13px] text-toss-sub hover:text-toss-heading"
      >
        <ArrowLeft size={16} />
        Projects로 돌아가기
      </Link>

      {/* Hero */}
      {project.slug === "kimpro" ? (
        <KimproHero className="h-[360px]" interactive />
      ) : project.slug === "hey-bara" ? (
        <HeyBaraHero className="h-[360px]" interactive />
      ) : project.slug === "fingoo" ? (
        <FingooHero className="h-[360px]" interactive />
      ) : project.slug === "ai-portfolio-chatbot" ? (
        <ChatbotHero className="h-[360px]" interactive />
      ) : project.slug === "bonda" ? (
        <BondaHero className="h-[360px]" interactive />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="h-[300px] w-full rounded-xl bg-zinc-200"
        />
      )}

      {/* Title + Links */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-3"
      >
        <h1 className="font-['Outfit'] text-[28px] font-extrabold tracking-tight text-toss-heading">
          {project.title}
        </h1>
        <div className="flex gap-2">
          {project.github && (
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-lg bg-toss-blue px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
            >
              <Github size={14} />
              GitHub
            </motion.a>
          )}
          {project.demo && (
            <motion.a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-lg border border-toss-border px-4 py-2 text-xs font-medium text-toss-heading hover:bg-toss-bg"
            >
              <ExternalLink size={14} />
              Demo
            </motion.a>
          )}
        </div>
      </motion.div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag, i) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.03 }}
            className={`rounded px-2.5 py-1 text-xs ${
              i < 4
                ? "bg-toss-blue text-white"
                : "bg-toss-bg text-toss-body"
            }`}
          >
            {tag}
          </motion.span>
        ))}
      </div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-col gap-3"
      >
        <h2 className="font-['Outfit'] text-lg font-bold text-toss-heading">
          프로젝트 설명
        </h2>
        <p className="text-sm leading-[1.7] text-toss-body">{project.description}</p>
      </motion.div>

      {/* Features / Contributions */}
      {project.features.length > 0 && (
        <div className="flex flex-col gap-3">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-['Outfit'] text-lg font-bold text-toss-heading"
          >
            프로젝트 기여
          </motion.h2>
          <div
            ref={dragScroll.ref}
            onMouseDown={dragScroll.onMouseDown}
            onMouseUp={dragScroll.onMouseUp}
            onMouseLeave={dragScroll.onMouseLeave}
            onMouseMove={dragScroll.onMouseMove}
            className="-mx-6 cursor-grab overflow-x-auto px-6 scrollbar-none select-none"
          >
            <div className="flex gap-3" style={{ minWidth: "max-content" }}>
              {project.features.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex w-[220px] shrink-0 flex-col gap-2 rounded-2xl bg-toss-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4"
                >
                  <h3 className="text-[13px] font-semibold text-toss-heading">
                    {feat.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-toss-body">
                    {feat.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dev Notes */}
      {project.notes.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-['Outfit'] text-lg font-bold text-toss-heading">
              개발 노트
            </h2>
            <span className="text-[13px] text-toss-sub">
              {project.notes.length}개의 글
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {project.notes.map((note, i) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
              >
                <Link
                  to={`/projects/${project.slug}/notes/${note.id}`}
                  className="flex flex-col gap-2 rounded-2xl bg-toss-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 transition-colors hover:shadow-[0_2px_6px_rgba(0,0,0,0.1)]"
                >
                  <h3 className="text-[13px] font-semibold text-toss-heading">
                    {note.title}
                  </h3>
                  <p className="text-xs text-toss-body">{note.summary}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-toss-sub">{note.date}</span>
                    <div className="flex gap-1">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-toss-bg px-2 py-0.5 text-[10px] text-toss-body"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

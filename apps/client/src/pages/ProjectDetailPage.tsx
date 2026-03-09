import { useParams, Link } from "react-router";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { FingooHero } from "../components/ProjectHero";
import projects from "@data/projects.json";
import type { Project } from "@genie-cv/shared";

const allProjects = projects as Project[];

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = allProjects.find((p) => p.slug === slug);

  if (!project) {
    return <div className="p-8 text-zinc-500">프로젝트를 찾을 수 없습니다.</div>;
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
        className="flex items-center gap-2 text-[13px] text-zinc-500 hover:text-zinc-700"
      >
        <ArrowLeft size={16} />
        Projects로 돌아가기
      </Link>

      {/* Hero */}
      {project.slug === "fingoo" ? (
        <FingooHero />
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
        <h1 className="font-['Outfit'] text-[28px] font-extrabold tracking-tight text-black">
          {project.title}
        </h1>
        <div className="flex gap-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800"
            >
              <Github size={14} />
              GitHub
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-xs font-medium text-black hover:bg-zinc-50"
            >
              <ExternalLink size={14} />
              Demo
            </a>
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
                ? "bg-black text-white"
                : "bg-zinc-100 text-zinc-500"
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
        <h2 className="font-['Outfit'] text-lg font-bold text-black">
          프로젝트 설명
        </h2>
        <p className="text-sm leading-[1.7] text-zinc-600">{project.description}</p>
      </motion.div>

      {/* Features */}
      <div className="flex flex-col gap-3">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-['Outfit'] text-lg font-bold text-black"
        >
          주요 기능
        </motion.h2>
        <div className="flex flex-col md:flex-row gap-3">
          {project.features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              className="flex flex-1 flex-col gap-2 rounded-[10px] border border-zinc-100 bg-zinc-50 p-4"
            >
              <h3 className="text-[13px] font-semibold text-black">
                {feat.title}
              </h3>
              <p className="text-xs leading-relaxed text-zinc-500">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dev Notes */}
      {project.notes.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-['Outfit'] text-lg font-bold text-black">
              개발 노트
            </h2>
            <span className="text-[13px] text-zinc-400">
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
                  className="flex flex-col gap-2 rounded-[10px] border border-zinc-100 bg-zinc-50 p-5 transition-colors hover:border-zinc-200"
                >
                  <h3 className="text-[13px] font-semibold text-black">
                    {note.title}
                  </h3>
                  <p className="text-xs text-zinc-500">{note.summary}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-zinc-400">{note.date}</span>
                    <div className="flex gap-1">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-500"
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

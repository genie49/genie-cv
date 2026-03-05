import { useParams, Link } from "react-router";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
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
    <div className="flex flex-col gap-6 p-8">
      {/* Back */}
      <Link
        to="/projects"
        className="flex items-center gap-2 text-[13px] text-zinc-500 hover:text-zinc-700"
      >
        <ArrowLeft size={16} />
        Projects로 돌아가기
      </Link>

      {/* Hero Image placeholder */}
      <div className="h-[300px] w-full rounded-xl bg-zinc-200" />

      {/* Title + Links */}
      <div className="flex items-center justify-between">
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
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag, i) => (
          <span
            key={tag}
            className={`rounded px-2.5 py-1 text-xs ${
              i < 4
                ? "bg-black text-white"
                : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-3">
        <h2 className="font-['Outfit'] text-lg font-bold text-black">
          프로젝트 설명
        </h2>
        <p className="text-sm leading-[1.7] text-zinc-600">{project.description}</p>
      </div>

      {/* Features */}
      <div className="flex flex-col gap-3">
        <h2 className="font-['Outfit'] text-lg font-bold text-black">
          주요 기능
        </h2>
        <div className="flex gap-3">
          {project.features.map((feat) => (
            <div
              key={feat.title}
              className="flex flex-1 flex-col gap-2 rounded-[10px] border border-zinc-100 bg-zinc-50 p-4"
            >
              <h3 className="text-[13px] font-semibold text-black">
                {feat.title}
              </h3>
              <p className="text-xs leading-relaxed text-zinc-500">
                {feat.description}
              </p>
            </div>
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
            {project.notes.map((note) => (
              <Link
                key={note.id}
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

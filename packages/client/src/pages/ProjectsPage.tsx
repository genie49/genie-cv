import { Link } from "react-router";
import projects from "@data/projects.json";
import type { Project } from "@genie-cv/shared";

const allProjects = projects as Project[];

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-['Outfit'] text-2xl font-extrabold tracking-tight text-black">
          Projects
        </h1>
        <p className="text-[13px] text-zinc-400">진행한 프로젝트들</p>
      </div>

      {/* 2-column Grid */}
      <div className="grid grid-cols-2 gap-5">
        {allProjects.map((project) => (
          <Link
            key={project.slug}
            to={`/projects/${project.slug}`}
            className="flex flex-col overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50 transition-colors hover:border-zinc-200"
          >
            {/* Thumbnail */}
            <div className="h-40 w-full bg-zinc-200" />
            {/* Body */}
            <div className="flex flex-col gap-2 px-5 py-4">
              <h3 className="font-['Outfit'] text-base font-bold text-black">
                {project.title}
              </h3>
              <p className="line-clamp-2 text-[13px] leading-relaxed text-zinc-500">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="mt-1 text-xs text-zinc-400">
                {project.period}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

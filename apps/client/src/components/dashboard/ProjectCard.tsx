import { Link } from "react-router";
import { motion } from "motion/react";
import { FingooHero } from "../ProjectHero";
import type { Project } from "@genie-cv/shared";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/projects/${project.slug}`}
        className="flex flex-col overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50 transition-colors hover:border-zinc-200"
      >
        {/* Thumbnail */}
        {project.slug === "fingoo" ? (
          <FingooHero className="h-32" />
        ) : (
          <div className="h-32 w-full bg-zinc-200" />
        )}
        {/* Body */}
        <div className="flex flex-col gap-2 p-4 pt-4">
          <h3 className="font-['Outfit'] text-sm font-bold text-black">
            {project.title}
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

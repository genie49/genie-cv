import { motion } from "motion/react";
import ProjectCard from "../components/dashboard/ProjectCard";
import projects from "@data/projects.json";
import type { Project } from "@genie-cv/shared";

const allProjects = projects as Project[];

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h1 className="font-['Outfit'] text-2xl font-extrabold tracking-tight text-black">
          Projects
        </h1>
        <p className="text-[13px] text-zinc-400">진행한 프로젝트들</p>
      </motion.div>

      {/* 2-column Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {allProjects.map((project, i) => (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <ProjectCard
              project={project}
              heroHeight="h-40"
              showPeriod
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { motion } from "motion/react";
import AboutPanel from "../components/dashboard/AboutPanel";
import TechStackPanel from "../components/dashboard/TechStackPanel";
import ProjectCard from "../components/dashboard/ProjectCard";
import EducationPanel from "../components/dashboard/EducationPanel";
import ExperiencePanel from "../components/dashboard/ExperiencePanel";
import projects from "@data/projects.json";
import type { Project } from "@genie-cv/shared";

const previewProjects = (projects as Project[]).slice(0, 3);

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Top Row: About + Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex gap-5"
      >
        <div className="flex-1">
          <AboutPanel />
        </div>
        <div className="flex-1">
          <TechStackPanel />
        </div>
      </motion.div>

      {/* Projects Row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex gap-5"
      >
        {previewProjects.map((project) => (
          <div key={project.slug} className="flex-1">
            <ProjectCard project={project} />
          </div>
        ))}
        {/* Fill empty slots if less than 3 projects */}
        {Array.from({ length: 3 - previewProjects.length }).map((_, i) => (
          <div key={`empty-${i}`} className="flex-1" />
        ))}
      </motion.div>

      {/* Bottom Row: Education + Experience */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex gap-5"
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

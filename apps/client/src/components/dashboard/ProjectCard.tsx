import { Link } from "react-router";
import { motion } from "motion/react";
import { FingooHero } from "../ProjectHero";
import { KimproHero } from "../KimproHero";
import { HeyBaraHero } from "../HeyBaraHero";
import { ChatbotHero } from "../ChatbotHero";
import { BondaHero } from "../BondaHero";
import type { Project } from "@genie-cv/shared";

function ProjectHeroThumbnail({ slug, className }: { slug: string; className: string }) {
  if (slug === "kimpro") return <KimproHero className={className} />;
  if (slug === "hey-bara") return <HeyBaraHero className={className} />;
  if (slug === "fingoo") return <FingooHero className={className} />;
  if (slug === "ai-portfolio-chatbot") return <ChatbotHero className={className} />;
  if (slug === "bonda") return <BondaHero className={className} />;
  return <div className={`w-full bg-toss-bg ${className}`} />;
}

export default function ProjectCard({
  project,
  heroHeight = "h-32",
  showPeriod,
  maxTags,
}: {
  project: Project;
  heroHeight?: string;
  showPeriod?: boolean;
  maxTags?: number;
}) {
  const tags = maxTags ? project.tags.slice(0, maxTags) : project.tags;

  return (
    <div className="pt-1 h-full">
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="h-full">
        <Link
          to={`/projects/${project.slug}`}
          className="flex h-full flex-col overflow-hidden rounded-2xl bg-toss-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
        >
          <ProjectHeroThumbnail slug={project.slug} className={heroHeight} />
          <div className="flex flex-1 flex-col gap-2 p-4">
            <h3 className="font-['Outfit'] text-sm font-bold text-toss-heading">
              {project.title}
            </h3>
            <p className="line-clamp-2 text-xs leading-relaxed text-toss-body">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-toss-bg px-1.5 py-0.5 text-[10px] text-toss-body"
                >
                  {tag}
                </span>
              ))}
            </div>
            {showPeriod && (
              <span className="mt-1 text-xs text-toss-sub">
                {project.period}
              </span>
            )}
          </div>
        </Link>
      </motion.div>
    </div>
  );
}

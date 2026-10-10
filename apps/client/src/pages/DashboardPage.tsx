import { useCallback, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { useAssistantRuntime } from "@assistant-ui/react";
import { ArrowRight, Sparkles } from "lucide-react";
import ProjectCard from "../components/dashboard/ProjectCard";
import profile from "@data/profile.json";
import projects from "@data/projects.json";

const CARD = "rounded-2xl bg-toss-card shadow-[0_1px_3px_rgba(0,0,0,0.06)]";

const DOT_COLORS: Record<string, string> = {
  당근: "bg-[#FF6F0F]",
  아이머스: "bg-cyan-600",
  꿈담길: "bg-emerald-600",
};
const DEFAULT_DOT_COLOR = "bg-toss-sub";

// 경력 카드에 들어간 프로젝트를 뺀 나머지
const linkedSlugs = new Set(profile.experience.map((e) => e.project));
const otherProjects = projects.filter((p) => !linkedSlugs.has(p.slug));
const school = profile.education[0];

// 첫 페이지에서 사라진 기술 스택과 최근 작업 위주의 질문
const QUESTIONS = [
  "주로 어떤 기술 스택을 사용하나요?",
  "당근에서는 어떤 일을 하고 있나요?",
  "Heirloom은 어떤 프로젝트인가요?",
  "Bonda에서 스캔 PDF를 어떻게 검색 가능하게 만들었나요?",
  "아이머스에서 AI 에이전트 시스템을 어떻게 설계했나요?",
  "아이머스의 에이전트 평가 체계는 어떻게 구축했나요?",
];

function renderBold(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-toss-heading">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

function TimelineItem({
  year,
  dot,
  children,
}: {
  year: string;
  dot: string;
  children: React.ReactNode;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.3 }}
      className="relative flex gap-6"
    >
      <span className="w-10 shrink-0 pt-5 text-right font-['Outfit'] text-sm font-bold text-toss-sub">
        {year}
      </span>
      <span
        className={`absolute left-[47px] top-6 h-2.5 w-2.5 rounded-full ring-4 ring-toss-bg ${dot}`}
      />
      <div className="min-w-0 flex-1">{children}</div>
    </motion.li>
  );
}

function ExperienceCard({ exp }: { exp: (typeof profile.experience)[number] }) {
  const project = projects.find((p) => p.slug === exp.project);

  return (
    <div className={`${CARD} flex flex-col gap-3 p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-['Outfit'] text-base font-bold text-toss-heading">
            {exp.company}
          </h3>
          <p className="text-[13px] text-toss-body">
            {exp.title} · {exp.type}
          </p>
        </div>
        <span className="shrink-0 pt-1 text-xs text-toss-sub">{exp.period}</span>
      </div>

      {exp.summary && (
        <p className="text-[13px] font-medium text-toss-heading">{exp.summary}</p>
      )}

      {exp.highlights && (
        <ul className="flex flex-col gap-1 text-[13px] leading-relaxed text-toss-body">
          {exp.highlights.map((h) => (
            <li key={h}>· {h}</li>
          ))}
        </ul>
      )}

      {project && (
        <Link
          to={`/projects/${project.slug}`}
          className="flex items-center justify-between gap-3 rounded-xl bg-toss-bg px-4 py-3 text-[13px] font-medium text-toss-heading transition-colors hover:text-toss-blue"
        >
          <span className="truncate">{project.title}</span>
          <ArrowRight size={14} className="shrink-0" />
        </Link>
      )}
    </div>
  );
}

/* 가로 스크롤 + 드래그 */
function ProjectsRow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = { isDown: true, startX: e.clientX, scrollLeft: el.scrollLeft };
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragState.current;
    if (!d.isDown || !scrollRef.current) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 5) setIsDragging(true);
    scrollRef.current.scrollLeft = d.scrollLeft - dx;
  }, []);

  const onPointerUp = useCallback(() => {
    dragState.current.isDown = false;
    requestAnimationFrame(() => setIsDragging(false));
  }, []);

  const onClickCapture = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [isDragging],
  );

  return (
    <div
      ref={scrollRef}
      className="-mx-6 flex cursor-grab items-stretch gap-5 overflow-x-auto px-6 hide-scrollbar select-none active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onClickCapture={onClickCapture}
    >
      {otherProjects.map((project) => (
        <div key={project.slug} className="w-[340px] shrink-0" style={{ height: 280 }}>
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}

function AskSection() {
  const runtime = useAssistantRuntime();
  const navigate = useNavigate();

  const ask = (question: string) => {
    runtime.switchToNewThread();
    runtime.thread.append(question);
    navigate("/chat");
  };

  return (
    <section className={`${CARD} p-6`}>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-toss-blue">
          <Sparkles size={12} className="fill-white/20 text-white" />
        </div>
        <h2 className="font-['Outfit'] text-base font-bold text-toss-heading">
          더 궁금한 점은 AI에게 물어보세요
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => ask(q)}
            className="cursor-pointer rounded-xl border border-toss-border bg-toss-card px-4 py-3 text-left text-[13px] text-toss-body transition-all hover:border-toss-blue hover:bg-blue-50/40 hover:text-toss-blue"
          >
            {q}
          </button>
        ))}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 p-6">
      {/* Intro */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`${CARD} flex flex-col gap-3 p-6`}
      >
        <div>
          <h1 className="font-['Outfit'] text-2xl font-bold text-toss-heading">
            {profile.name}
          </h1>
          <p className="text-sm font-semibold text-toss-blue">{profile.role}</p>
        </div>
        <p className="text-[15px] leading-relaxed text-toss-body">
          {renderBold(profile.intro)}
        </p>
        <div className="flex gap-4 text-[13px] font-medium text-toss-sub">
          <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-toss-blue">
            GitHub
          </a>
          <a href={`mailto:${profile.email}`} className="hover:text-toss-blue">
            Email
          </a>
        </div>
      </motion.section>

      {/* Timeline — 현재 → 과거 */}
      <ol className="relative flex flex-col gap-5">
        <div className="absolute bottom-2 left-[51.5px] top-7 w-px bg-toss-border" />
        <div className="rail-fill absolute bottom-2 left-[51.5px] top-7 w-px bg-toss-blue" />

        {profile.experience.map((exp) => (
          <TimelineItem
            key={`${exp.company}-${exp.period}`}
            year={exp.period.slice(0, 4)}
            dot={DOT_COLORS[exp.company] ?? DEFAULT_DOT_COLOR}
          >
            {exp.minor ? (
              <p className="flex flex-wrap justify-between gap-x-3 py-5 text-[13px] text-toss-body">
                <span>
                  {exp.title} · {exp.company}
                </span>
                <span className="text-xs text-toss-sub">{exp.period}</span>
              </p>
            ) : (
              <ExperienceCard exp={exp} />
            )}
          </TimelineItem>
        ))}

        <TimelineItem year={school.period.slice(0, 4)} dot={DEFAULT_DOT_COLOR}>
          <p className="flex flex-wrap justify-between gap-x-3 py-5 text-[13px] text-toss-body">
            <span>
              {school.school} {school.major}
            </span>
            <span className="text-xs text-toss-sub">{school.period}</span>
          </p>
        </TimelineItem>
      </ol>

      {/* 회사 밖에서 만든 프로젝트 */}
      <section className="flex flex-col gap-3">
        <h2 className="font-['Outfit'] text-base font-bold text-toss-heading">
          그 밖에 만든 것
        </h2>
        <ProjectsRow />
      </section>

      <AskSection />
    </div>
  );
}

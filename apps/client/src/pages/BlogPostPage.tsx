import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.min.css";
import { MermaidDiagram } from "../components/MermaidDiagram";
import projects from "@data/projects.json";
import type { Project } from "@genie-cv/shared";

const allProjects = projects as Project[];

export default function BlogPostPage() {
  const { slug, id } = useParams();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const project = allProjects.find((p) => p.slug === slug);
  const note = project?.notes.find((n) => n.id === id);

  useEffect(() => {
    if (!id) return;
    fetch(`/content/notes/${id}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.text();
      })
      .then(setContent)
      .catch(() => setContent("노트를 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, [id]);

  if (!project || !note) {
    return <div className="p-8 text-zinc-500">노트를 찾을 수 없습니다.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-10 px-5 py-6 md:px-20 md:py-8"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px]">
        <Link to="/projects" className="text-zinc-400 hover:text-zinc-600">
          Projects
        </Link>
        <span className="text-zinc-300">/</span>
        <Link
          to={`/projects/${slug}`}
          className="text-zinc-400 hover:text-zinc-600"
        >
          {project.title}
        </Link>
        <span className="text-zinc-300">/</span>
        <span className="text-zinc-600">개발 노트</span>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-3"
      >
        <h1 className="font-['Outfit'] text-[28px] font-extrabold tracking-tight text-black">
          {note.title}
        </h1>
        <div className="flex items-center gap-4 text-[13px] text-zinc-400">
          <span>{note.date}</span>
        </div>
        <div className="flex gap-1.5">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Divider */}
      <div className="h-px w-full bg-zinc-100" />

      {/* Content */}
      {loading ? (
        <div className="text-sm text-zinc-400">로딩 중...</div>
      ) : (
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="prose prose-zinc max-w-none prose-headings:font-['Outfit'] prose-headings:font-bold prose-h2:text-xl prose-p:text-[15px] prose-p:leading-[1.8] prose-p:text-zinc-700 prose-pre:rounded-lg prose-pre:bg-zinc-900 prose-code:font-['JetBrains_Mono'] prose-code:text-[13px]"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[[rehypeHighlight, { plainText: ["mermaid"] }]]}
            components={{
              pre({ children, ...props }) {
                const child = children as React.ReactElement<{ className?: string }>;
                const className = child?.props?.className || "";
                if (className === "language-mermaid") {
                  return <>{children}</>;
                }
                const match = className.match(/language-(\S+)/);
                const lang = match ? match[1] : "";
                if (!lang) {
                  return <pre {...props}>{children}</pre>;
                }
                return (
                  <div className="not-prose overflow-hidden rounded-lg border border-zinc-800">
                    <div className="flex items-center px-4 py-2 bg-zinc-800 border-b border-zinc-700">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                        {lang}
                      </span>
                    </div>
                    <pre
                      {...props}
                      className="!m-0 !rounded-none !border-0 bg-zinc-900 p-4 overflow-x-auto"
                    >
                      {children}
                    </pre>
                  </div>
                );
              },
              code({ className, children, ...props }) {
                if (className === "language-mermaid") {
                  return (
                    <MermaidDiagram
                      chart={String(children).replace(/\n$/, "")}
                    />
                  );
                }
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </motion.article>
      )}
    </motion.div>
  );
}

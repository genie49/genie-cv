import { useParams, Link } from "react-router";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Copy } from "lucide-react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import css from "highlight.js/lib/languages/css";
import yaml from "highlight.js/lib/languages/yaml";
import sql from "highlight.js/lib/languages/sql";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import xml from "highlight.js/lib/languages/xml";
import { MermaidDiagram } from "../components/MermaidDiagram";
import projects from "@data/projects.json";
import type { Project } from "@genie-cv/shared";

hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("json", json);
hljs.registerLanguage("css", css);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("dockerfile", dockerfile);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml);

const allProjects = projects as Project[];

function HighlightedCode({ code, language }: { code: string; language: string }) {
  const html = useMemo(() => {
    if (language === "mermaid") return null;
    try {
      if (hljs.getLanguage(language)) {
        return hljs.highlight(code, { language }).value;
      }
      return hljs.highlightAuto(code).value;
    } catch {
      return null;
    }
  }, [code, language]);

  if (language === "mermaid") {
    return <MermaidDiagram chart={code} />;
  }

  if (!html) {
    return (
      <pre className="bg-zinc-900 p-4 overflow-x-auto">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div className="not-prose overflow-hidden rounded-lg border border-zinc-800">
      <div className="flex items-center px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
          {language}
        </span>
      </div>
      <pre className="!m-0 !rounded-none !border-0 bg-zinc-900 p-4 overflow-x-auto">
        <code
          className="hljs"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </div>
  );
}

export default function BlogPostPage() {
  const { slug, id } = useParams();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const copyBtnRef = useRef<HTMLButtonElement>(null);

  const handleCopy = useCallback(() => {
    if (!content || !copyBtnRef.current) return;
    const btn = copyBtnRef.current;
    navigator.clipboard.writeText(content).then(() => {
      btn.dataset.copied = "true";
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><path d="M20 6 9 17l-5-5"/></svg><span class="text-emerald-600">Copied</span>`;
      setTimeout(() => {
        if (btn) {
          btn.dataset.copied = "";
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg><span>Copy page</span>`;
        }
      }, 2000);
    });
  }, [content]);

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
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-['Outfit'] text-[28px] font-extrabold tracking-tight text-black">
            {note.title}
          </h1>
          <button
            ref={copyBtnRef}
            onClick={handleCopy}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-[13px] text-zinc-600 transition-colors hover:bg-zinc-50 active:bg-zinc-100"
          >
            <Copy size={14} />
            <span>Copy page</span>
          </button>
        </div>
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
            remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
            components={{
              pre({ children }) {
                const child = children as React.ReactElement<{
                  className?: string;
                  children?: string;
                }>;
                const className = child?.props?.className || "";
                const match = className.match(/language-(\S+)/);
                const lang = match ? match[1] : "";
                const code = String(child?.props?.children || "").replace(/\n$/, "");

                if (lang) {
                  return <HighlightedCode code={code} language={lang} />;
                }
                return <pre>{children}</pre>;
              },
              code({ className, children }) {
                if (className === "language-mermaid") {
                  return (
                    <MermaidDiagram
                      chart={String(children).replace(/\n$/, "")}
                    />
                  );
                }
                return <code className={className}>{children}</code>;
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

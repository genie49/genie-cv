import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
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
    <div className="flex flex-col gap-10 px-20 py-8">
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
      <div className="flex flex-col gap-3">
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
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-zinc-100" />

      {/* Content */}
      {loading ? (
        <div className="text-sm text-zinc-400">로딩 중...</div>
      ) : (
        <article className="prose prose-zinc max-w-none prose-headings:font-['Outfit'] prose-headings:font-bold prose-h2:text-xl prose-p:text-[15px] prose-p:leading-[1.8] prose-p:text-zinc-700 prose-pre:rounded-lg prose-pre:bg-zinc-900 prose-code:font-['JetBrains_Mono'] prose-code:text-[13px]">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {content}
          </ReactMarkdown>
        </article>
      )}
    </div>
  );
}

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { Link } from "react-router";
import { useMessagePartText } from "@assistant-ui/react";
import type { Citation } from "@genie-cv/shared";

const CITATION_MARKER = "<!--CITATIONS:";

function parseCitations(text: string): { body: string; citations: Citation[] } {
  const idx = text.indexOf(CITATION_MARKER);
  if (idx === -1) return { body: text, citations: [] };
  const body = text.slice(0, idx).trimEnd();
  const jsonStr = text.slice(idx + CITATION_MARKER.length, text.lastIndexOf("-->"));
  try {
    return { body, citations: JSON.parse(jsonStr) };
  } catch {
    return { body, citations: [] };
  }
}

function CitationChips({ citations }: { citations: Citation[] }) {
  if (citations.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {citations.map((c) => (
        <Link
          key={c.route}
          to={c.route}
          className="inline-flex items-center gap-1 rounded-lg border border-toss-border bg-toss-bg px-2.5 py-1 text-[11px] font-medium text-toss-blue no-underline transition-colors hover:border-toss-blue hover:bg-blue-50"
        >
          <span className="text-[10px]">📄</span>
          {c.label}
        </Link>
      ))}
    </div>
  );
}

export function MarkdownText() {
  const { text } = useMessagePartText();
  const { body, citations } = parseCitations(text);

  return (
    <div>
      <div className="prose prose-sm prose-zinc max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:mt-3 prose-headings:mb-1 prose-pre:my-2 prose-code:text-[12px]">
        <ReactMarkdown
          rehypePlugins={[rehypeHighlight]}
          components={{
            a: ({ href, children }) => {
              if (href?.startsWith("/")) {
                return (
                  <Link to={href} className="text-toss-body underline hover:text-toss-heading">
                    {children}
                  </Link>
                );
              }
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-toss-body underline hover:text-toss-heading">
                  {children}
                </a>
              );
            },
          }}
        >
          {body}
        </ReactMarkdown>
      </div>
      <CitationChips citations={citations} />
    </div>
  );
}

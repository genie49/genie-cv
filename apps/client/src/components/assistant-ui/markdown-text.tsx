import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { Link } from "react-router";
import { useMessagePartText } from "@assistant-ui/react";

export function MarkdownText() {
  const { text } = useMessagePartText();

  return (
    <div className="prose prose-sm prose-zinc max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:mt-3 prose-headings:mb-1 prose-pre:my-2 prose-code:text-[12px]">
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          a: ({ href, children }) => {
            if (href?.startsWith("/")) {
              return (
                <Link to={href} className="text-zinc-600 underline hover:text-black">
                  {children}
                </Link>
              );
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-zinc-600 underline hover:text-black">
                {children}
              </a>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

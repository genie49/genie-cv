import { Link } from "react-router";
import type { ChatMessage as ChatMessageType, Citation } from "@genie-cv/shared";

interface Props {
  message: ChatMessageType;
  citations?: Citation[];
}

function renderContent(content: string, citations: Citation[]) {
  if (citations.length === 0) return content;

  const parts: (string | { index: number; route: string })[] = [];
  let lastIndex = 0;
  const regex = /\[(\d+)\]/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const num = parseInt(match[1], 10);
    const citation = citations.find((c) => c.index === num);
    if (citation) {
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }
      parts.push({ index: num, route: citation.route });
      lastIndex = match.index + match[0].length;
    }
  }
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts.map((part, i) =>
    typeof part === "string" ? (
      part
    ) : (
      <Link
        key={i}
        to={part.route}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-medium text-zinc-600 hover:bg-zinc-300"
        title={citations.find((c) => c.index === part.index)?.label}
      >
        {part.index}
      </Link>
    )
  );
}

export default function ChatMessage({ message, citations = [] }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-black text-white"
            : "border border-zinc-100 bg-zinc-50 text-zinc-700"
        }`}
      >
        <p className="whitespace-pre-wrap text-[13px] leading-relaxed">
          {renderContent(message.content, citations)}
        </p>
        {citations.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-zinc-200 pt-2">
            {citations.map((c) => (
              <Link
                key={c.index}
                to={c.route}
                className="flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700"
              >
                <span className="font-medium">[{c.index}]</span>
                {c.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

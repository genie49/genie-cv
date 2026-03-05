import { Link } from "react-router";
import type { ChatMessage as ChatMessageType, Citation } from "@genie-cv/shared";

interface Props {
  message: ChatMessageType;
  citations?: Citation[];
}

export default function ChatMessage({ message, citations }: Props) {
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
          {message.content}
        </p>
        {citations && citations.length > 0 && (
          <div className="mt-3 flex flex-col gap-1 border-t border-zinc-200 pt-2">
            <span className="text-[11px] text-zinc-400">참고:</span>
            {citations.map((c, i) => (
              <Link
                key={i}
                to={c.route}
                className="text-[11px] text-zinc-500 underline hover:text-zinc-700"
              >
                {c.source}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

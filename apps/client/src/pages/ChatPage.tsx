import { Bot } from "lucide-react";
import { useChat } from "../hooks/useChat";
import ChatMessageComponent from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";

const SUGGESTIONS = [
  "어떤 프로젝트를 진행했나요?",
  "기술 스택은 무엇인가요?",
  "RAG 시스템은 어떻게 구축했나요?",
];

export default function ChatPage() {
  const { messages, citations, isStreaming, send } = useChat();

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-14 items-center gap-2.5 border-b border-zinc-100 px-6">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <span className="font-['Outfit'] text-base font-bold text-black">
          Genie AI
        </span>
        <span className="text-xs text-zinc-400">
          경력, 프로젝트, 기술에 대해 물어보세요
        </span>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-4 overflow-auto bg-zinc-50 p-6">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center gap-3 pt-15">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
              <Bot size={24} />
            </div>
            <h2 className="font-['Outfit'] text-xl font-bold text-black">
              Genie에 대해 궁금한 것을 물어보세요
            </h2>
            <p className="text-center text-[13px] text-zinc-400">
              RAG 기반으로 이력서, 프로젝트, 경험 데이터를 검색하여 답변합니다.
            </p>
            <div className="flex gap-2 pt-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-600 hover:border-zinc-300"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <ChatMessageComponent
              key={i}
              message={msg}
              citations={
                i === messages.length - 1 && msg.role === "assistant"
                  ? citations
                  : undefined
              }
            />
          ))
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={send} disabled={isStreaming} />
    </div>
  );
}

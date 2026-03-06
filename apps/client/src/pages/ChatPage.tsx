import { useAssistantRuntime } from "@assistant-ui/react";
import { RotateCcw, Sparkles } from "lucide-react";
import { Thread } from "../components/assistant-ui/thread";

export default function ChatPage() {
  const runtime = useAssistantRuntime();

  return (
    <div className="flex h-full flex-col pb-24 md:pb-0">
      <div className="flex h-14 items-center justify-between border-b border-zinc-100 bg-white px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-sm shadow-indigo-100">
            <Sparkles size={12} className="text-white fill-white/20" />
          </div>
          <div className="flex flex-col -space-y-0.5">
            <span className="font-['Outfit'] text-[15px] font-bold text-zinc-900">
              Genie AI
            </span>
            <span className="text-[11px] text-zinc-400">
              경력, 프로젝트, 기술에 대해 답변합니다
            </span>
          </div>
        </div>
        <button
          onClick={() => runtime.switchToNewThread()}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] font-medium text-zinc-500 hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-600 transition-all"
        >
          <RotateCcw size={12} />
          새 채팅
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <Thread />
      </div>
    </div>
  );
}


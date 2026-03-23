import { useAssistantRuntime } from "@assistant-ui/react";
import { RotateCcw, Sparkles } from "lucide-react";
import { Thread } from "../components/assistant-ui/thread";

export default function ChatPage() {
  const runtime = useAssistantRuntime();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-between border-b border-toss-border bg-toss-card px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-toss-blue shadow-sm">
            <Sparkles size={12} className="text-white fill-white/20" />
          </div>
          <div className="flex flex-col -space-y-0.5">
            <span className="font-['Outfit'] text-[15px] font-bold text-toss-heading">
              Genie AI
            </span>
            <span className="text-[11px] text-toss-sub">
              경력, 프로젝트, 기술에 대해 답변합니다
            </span>
          </div>
        </div>
        <button
          onClick={() => runtime.switchToNewThread()}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-toss-border px-3 py-1.5 text-[12px] font-medium text-toss-sub hover:border-toss-blue hover:bg-blue-50 hover:text-toss-blue transition-all"
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


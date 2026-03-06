import { useAssistantRuntime } from "@assistant-ui/react";
import { RotateCcw } from "lucide-react";
import { Thread } from "../components/assistant-ui/thread";

export default function ChatPage() {
  const runtime = useAssistantRuntime();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-between border-b border-zinc-100 px-6">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="font-['Outfit'] text-base font-bold text-black">
            Genie AI
          </span>
          <span className="text-xs text-zinc-400">
            경력, 프로젝트, 기술에 대해 물어보세요
          </span>
        </div>
        <button
          onClick={() => runtime.switchToNewThread()}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
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

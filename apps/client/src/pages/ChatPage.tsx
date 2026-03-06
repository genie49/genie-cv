import {
  useLocalRuntime,
  AssistantRuntimeProvider,
} from "@assistant-ui/react";
import { Thread } from "../components/assistant-ui/thread";
import { chatModelAdapter } from "../lib/chat-runtime";

export default function ChatPage() {
  const runtime = useLocalRuntime(chatModelAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center gap-2.5 border-b border-zinc-100 px-6">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="font-['Outfit'] text-base font-bold text-black">
            Genie AI
          </span>
          <span className="text-xs text-zinc-400">
            경력, 프로젝트, 기술에 대해 물어보세요
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <Thread />
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
}

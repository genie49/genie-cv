import {
  ThreadPrimitive,
  MessagePrimitive,
  ComposerPrimitive,
} from "@assistant-ui/react";
import { SendHorizontal } from "lucide-react";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:300ms]" />
    </div>
  );
}

function ThreadMessages() {
  return (
    <ThreadPrimitive.Messages
      components={{
        UserMessage,
        AssistantMessage,
      }}
    />
  );
}

function UserMessage() {
  return (
    <div className="flex justify-end">
      <div className="max-w-[70%] rounded-2xl bg-black px-4 py-3 text-white">
        <p className="whitespace-pre-wrap text-[13px] leading-relaxed">
          <MessagePrimitive.Content />
        </p>
      </div>
    </div>
  );
}

function AssistantMessage() {
  return (
    <div className="flex items-start gap-3 justify-start">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white text-xs">
        ✦
      </div>
      <div className="max-w-[70%] rounded-2xl border border-zinc-100 bg-white px-4 py-3 text-zinc-700 shadow-sm">
        <MessagePrimitive.If hasContent={true}>
          <p className="whitespace-pre-wrap text-[13px] leading-relaxed">
            <MessagePrimitive.Content />
          </p>
        </MessagePrimitive.If>
        <MessagePrimitive.If hasContent={false}>
          <TypingIndicator />
        </MessagePrimitive.If>
      </div>
    </div>
  );
}

function Composer() {
  return (
    <ComposerPrimitive.Root className="flex items-center gap-2 border-t border-zinc-100 bg-white px-6 py-4">
      <ComposerPrimitive.Input
        placeholder="메시지를 입력하세요..."
        className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-300"
      />
      <ComposerPrimitive.Send className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white hover:bg-zinc-800 disabled:opacity-30">
        <SendHorizontal size={16} />
      </ComposerPrimitive.Send>
    </ComposerPrimitive.Root>
  );
}

export function Thread() {
  return (
    <ThreadPrimitive.Root className="flex h-full flex-col">
      <ThreadPrimitive.Viewport className="flex flex-1 flex-col gap-4 overflow-auto bg-zinc-50 p-6">
        <ThreadPrimitive.Empty>
          <div className="flex flex-1 flex-col items-center gap-3 pt-15">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
              <span className="text-lg">✦</span>
            </div>
            <h2 className="font-['Outfit'] text-xl font-bold text-black">
              Genie에 대해 궁금한 것을 물어보세요
            </h2>
            <p className="text-center text-[13px] text-zinc-400">
              RAG 기반으로 이력서, 프로젝트, 경험 데이터를 검색하여 답변합니다.
            </p>
            <div className="flex gap-2 pt-3">
              <ThreadPrimitive.Suggestion
                prompt="어떤 프로젝트를 진행했나요?"
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-600 hover:border-zinc-300"
              >
                어떤 프로젝트를 진행했나요?
              </ThreadPrimitive.Suggestion>
              <ThreadPrimitive.Suggestion
                prompt="기술 스택은 무엇인가요?"
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-600 hover:border-zinc-300"
              >
                기술 스택은 무엇인가요?
              </ThreadPrimitive.Suggestion>
              <ThreadPrimitive.Suggestion
                prompt="RAG 시스템은 어떻게 구축했나요?"
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-600 hover:border-zinc-300"
              >
                RAG 시스템은 어떻게 구축했나요?
              </ThreadPrimitive.Suggestion>
            </div>
          </div>
        </ThreadPrimitive.Empty>
        <ThreadMessages />
      </ThreadPrimitive.Viewport>
      <Composer />
    </ThreadPrimitive.Root>
  );
}

import {
  ThreadPrimitive,
  MessagePrimitive,
  ComposerPrimitive,
} from "@assistant-ui/react";
import { SendHorizontal, Sparkles } from "lucide-react";
import { MarkdownText } from "./markdown-text";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-300 [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:300ms]" />
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
      <div className="max-w-[80%] rounded-2xl bg-zinc-900 px-4 py-3 text-white shadow-sm">
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
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-sm shadow-indigo-200">
        <Sparkles size={16} className="text-white fill-white/20" />
      </div>
      <div className="max-w-[80%] rounded-2xl border border-zinc-100 bg-white px-4 py-3 text-zinc-700 shadow-sm">
        <MessagePrimitive.If hasContent={true}>
          <MessagePrimitive.Content components={{ Text: MarkdownText }} />
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
        rows={1}
        placeholder="메시지를 입력하세요..."
        className="flex-1 resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[13px] outline-none placeholder:text-zinc-400 focus:border-indigo-300 focus:bg-white transition-all"
      />
      <ComposerPrimitive.Send className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-zinc-900 text-white hover:bg-black disabled:opacity-30 transition-colors shadow-sm">
        <SendHorizontal size={18} />
      </ComposerPrimitive.Send>
    </ComposerPrimitive.Root>
  );
}

export function Thread() {
  return (
    <ThreadPrimitive.Root className="flex h-full flex-col">
      <ThreadPrimitive.Viewport className="flex flex-1 flex-col gap-6 overflow-auto bg-white p-6">
        <ThreadPrimitive.Empty>
          <div className="flex flex-1 flex-col items-center gap-4 pt-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-xl shadow-indigo-100 rotate-3">
              <Sparkles size={32} className="text-white fill-white/20" />
            </div>
            <div className="text-center space-y-1.5 pt-2">
              <h2 className="font-['Outfit'] text-2xl font-bold tracking-tight text-zinc-900">
                Genie AI와 대화해보세요
              </h2>
              <p className="text-center text-[13px] text-zinc-500 leading-relaxed max-w-[280px]">
                이력서, 프로젝트, 경험 데이터를 바탕으로<br />
                궁금하신 점을 상세히 답변해 드립니다.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 pt-6 w-full max-w-[320px]">
              <ThreadPrimitive.Suggestion
                prompt="핀구에서 Multi-Agent 시스템은 어떻게 설계했나요?"
                autoSend
                className="cursor-pointer rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[13px] text-zinc-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all text-left"
              >
                핀구에서 Multi-Agent 시스템은 어떻게 설계했나요?
              </ThreadPrimitive.Suggestion>
              <ThreadPrimitive.Suggestion
                prompt="개발할 때 가장 중요하게 생각하는 것은?"
                autoSend
                className="cursor-pointer rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[13px] text-zinc-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all text-left"
              >
                개발할 때 가장 중요하게 생각하는 것은?
              </ThreadPrimitive.Suggestion>
              <ThreadPrimitive.Suggestion
                prompt="스톰스터디 레거시 마이그레이션 경험을 알려주세요"
                autoSend
                className="cursor-pointer rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[13px] text-zinc-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all text-left"
              >
                스톰스터디 레거시 마이그레이션 경험을 알려주세요
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


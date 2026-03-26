import { useMemo } from "react";
import {
  ThreadPrimitive,
  MessagePrimitive,
  ComposerPrimitive,
} from "@assistant-ui/react";
import { SendHorizontal, Sparkles } from "lucide-react";
import { MarkdownText } from "./markdown-text";

const SUGGESTION_POOL = [
  // 프로젝트별 핵심 질문
  "Kimpro에서 AI Agent Harness를 어떻게 설계했나요?",
  "Kimpro의 에이전트 평가 시스템은 어떻게 구축했나요?",
  "핀구에서 에이전트 구조를 세 번 갈아엎은 이유가 뭔가요?",
  "핀구의 금융 차트를 채팅에서 어떻게 제어했나요?",
  "Bonda에서 스캔 PDF를 어떻게 검색 가능하게 만들었나요?",
  "Bonda의 듀얼 벡터 이미지 검색은 어떻게 동작하나요?",
  "보카톡톡을 10년 된 PHP에서 Next.js로 새로 짠 이유는?",
  "보카톡톡의 TTS 캐싱 전략은 어떻게 설계했나요?",
  "헤이 바라의 온디바이스 음성 파이프라인은 어떻게 동작하나요?",
  "헤이 바라에서 앱을 AI가 직접 제어하는 구조를 설명해주세요",
  // 기술 깊이 질문
  "AI 시스템에서 Context Engineering이 왜 중요한가요?",
  "카페24에서 AWS로 DB를 마이그레이션한 경험을 알려주세요",
  "서버리스 환경에서 학습 데이터 보안을 어떻게 해결했나요?",
  "Wide Event 로깅이 기존 로깅과 뭐가 다른가요?",
  // 개인/철학 관련
  "간단한 자기소개를 해주세요",
  "기술 스택을 선택할 때 어떤 기준으로 결정하나요?",
  "가장 큰 실패 경험과 거기서 배운 점은?",
  "팀에서 어떻게 협업하나요?",
  "AI를 활용해 실제로 해결한 비즈니스 문제는?",
  "개발할 때 어떤 스타일로 일하나요?",
];

function pickRandom(pool: string[], count: number): string[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-300 [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:300ms]" />
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
      <div className="max-w-[80%] rounded-2xl bg-toss-blue px-4 py-3 text-white shadow-sm">
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
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-toss-blue shadow-sm">
        <Sparkles size={16} className="text-white fill-white/20" />
      </div>
      <div className="max-w-[80%] rounded-2xl border border-toss-border bg-toss-card px-4 py-3 text-toss-body shadow-sm">
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
    <ComposerPrimitive.Root className="flex items-center gap-2 border-t border-toss-border bg-toss-card px-6 py-4">
      <ComposerPrimitive.Input
        rows={1}
        placeholder="메시지를 입력하세요..."
        className="flex-1 resize-none rounded-xl border border-toss-border bg-toss-bg px-4 py-3 text-[13px] outline-none placeholder:text-toss-sub focus:border-toss-blue focus:bg-white transition-all"
      />
      <ComposerPrimitive.Send className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-toss-blue text-white hover:bg-blue-700 disabled:opacity-30 transition-colors shadow-sm">
        <SendHorizontal size={18} />
      </ComposerPrimitive.Send>
    </ComposerPrimitive.Root>
  );
}

function RandomSuggestions() {
  const suggestions = useMemo(() => pickRandom(SUGGESTION_POOL, 3), []);
  return (
    <div className="grid grid-cols-1 gap-2 pt-6 w-full max-w-[320px]">
      {suggestions.map((s) => (
        <ThreadPrimitive.Suggestion
          key={s}
          prompt={s}
          autoSend
          className="cursor-pointer rounded-xl border border-toss-border bg-toss-card px-4 py-3 text-[13px] text-toss-body hover:border-toss-blue hover:text-toss-blue hover:bg-blue-50/40 transition-all text-left"
        >
          {s}
        </ThreadPrimitive.Suggestion>
      ))}
    </div>
  );
}

export function Thread() {
  return (
    <ThreadPrimitive.Root className="flex h-full flex-col">
      <ThreadPrimitive.Viewport className="flex flex-1 flex-col gap-6 overflow-auto bg-toss-bg p-6">
        <ThreadPrimitive.Empty>
          <div className="flex flex-1 flex-col items-center gap-4 pt-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-toss-blue shadow-xl shadow-blue-100 rotate-3">
              <Sparkles size={32} className="text-white fill-white/20" />
            </div>
            <div className="text-center space-y-1.5 pt-2">
              <h2 className="font-['Outfit'] text-2xl font-bold tracking-tight text-toss-heading">
                Genie AI와 대화해보세요
              </h2>
              <p className="text-center text-[13px] text-toss-sub leading-relaxed max-w-[280px]">
                이력서, 프로젝트, 경험 데이터를 바탕으로<br />
                궁금하신 점을 상세히 답변해 드립니다.
              </p>
            </div>
            <RandomSuggestions />
          </div>
        </ThreadPrimitive.Empty>
        <ThreadMessages />
      </ThreadPrimitive.Viewport>
      <Composer />
    </ThreadPrimitive.Root>
  );
}


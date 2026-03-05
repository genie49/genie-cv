import { useState } from "react";
import { Link } from "react-router";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import qnaData from "@data/qna.json";
import type { QnAItem } from "@genie-cv/shared";

const items = qnaData as QnAItem[];

export default function QnAPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-['Outfit'] text-2xl font-extrabold tracking-tight text-black">
            Self Q&A
          </h1>
          <p className="text-[13px] text-zinc-400">
            자기소개서 대신, 스스로에게 묻고 답한 기록
          </p>
        </div>
        <Link
          to="/chat"
          className="flex items-center gap-2 rounded-lg bg-black px-3.5 py-2 text-xs font-medium text-white hover:bg-zinc-800"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          AI에게 더 물어보기
        </Link>
      </div>

      {/* Q&A List */}
      <div className="flex flex-col gap-3">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-xl border border-zinc-100 bg-zinc-50"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle size={14} className="text-zinc-400" />
                  <span className="text-[13px] font-medium text-black">
                    {item.question}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp size={16} className="text-zinc-400" />
                ) : (
                  <ChevronDown size={16} className="text-zinc-400" />
                )}
              </button>
              {isOpen && (
                <>
                  <div className="mx-5 h-px bg-zinc-200" />
                  <div className="px-5 py-4">
                    <p className="text-[13px] leading-relaxed text-zinc-600">
                      {item.answer}
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

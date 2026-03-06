import { useState } from "react";
import { Link } from "react-router";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import qnaData from "@data/qna.json";
import type { QnAItem } from "@genie-cv/shared";

const items = qnaData as QnAItem[];

export default function QnAPage() {
  const [openSet, setOpenSet] = useState<Set<number>>(() => new Set([0]));

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
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
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-black px-3.5 py-2 text-xs font-medium text-white hover:bg-zinc-800"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          AI에게 더 물어보기
        </Link>
      </motion.div>

      {/* Q&A List */}
      <div className="flex flex-col gap-3">
        {items.map((item, i) => {
          const isOpen = openSet.has(i);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-zinc-100 bg-zinc-50"
            >
              <button
                onClick={() => setOpenSet((prev) => {
                  const next = new Set(prev);
                  if (next.has(i)) next.delete(i);
                  else next.add(i);
                  return next;
                })}
                className="flex w-full cursor-pointer items-center justify-between px-5 py-4"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle size={14} className="text-zinc-400" />
                  <span className="text-[13px] font-medium text-black">
                    {item.question}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} className="text-zinc-400" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mx-5 h-px bg-zinc-200" />
                    <div className="px-5 py-4">
                      <p className="text-[13px] leading-relaxed text-zinc-600">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

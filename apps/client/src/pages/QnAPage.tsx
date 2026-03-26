import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
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
        className="flex flex-col gap-1"
      >
        <h1 className="font-['Outfit'] text-2xl font-extrabold tracking-tight text-toss-heading">
          Self Q&A
        </h1>
        <p className="text-sm text-toss-sub">
          자기소개서 대신, 스스로에게 묻고 답한 기록
        </p>
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
              className="rounded-2xl bg-toss-card shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
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
                  <MessageCircle size={14} className="text-toss-sub" />
                  <span className="text-sm font-medium text-toss-heading">
                    {item.question}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} className="text-toss-sub" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    className="overflow-hidden"
                  >
                    <div className="mx-5 h-px bg-toss-border" />
                    <div className="flex flex-col gap-3 px-5 py-4 text-sm leading-relaxed text-toss-body">
                      {item.answer.split("\n\n").map((para, j) => (
                        <p key={j}>
                          {para.split(/(\*\*[^*]+\*\*)/).map((seg, k) =>
                            seg.startsWith("**") && seg.endsWith("**") ? (
                              <strong key={k} className="font-semibold text-toss-heading">
                                {seg.slice(2, -2)}
                              </strong>
                            ) : (
                              <span key={k}>{seg}</span>
                            ),
                          )}
                        </p>
                      ))}
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

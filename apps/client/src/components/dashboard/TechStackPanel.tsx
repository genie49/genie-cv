import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import profile from "@data/profile.json";

const COLLAPSED_CATEGORIES = ["AI/ML", "BACKEND", "DB/MESSAGE"];

export default function TechStackPanel() {
  const [expanded, setExpanded] = useState(false);

  const categories = expanded
    ? Object.entries(profile.techStack)
    : Object.entries(profile.techStack).filter(([key]) =>
        COLLAPSED_CATEGORIES.includes(key)
      );

  return (
    <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-['Outfit'] text-base font-bold text-black">
          Tech Stack
        </h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="cursor-pointer text-zinc-400 hover:text-zinc-600"
        >
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {categories.map(([category, items]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
              className="flex flex-col gap-1.5"
            >
              <span className="text-[11px] font-semibold tracking-wider text-zinc-400">
                {category}
              </span>
              <div className="flex flex-wrap gap-1">
                {(items as string[]).map((item) => (
                  <span
                    key={item}
                    className={`rounded px-2 py-0.5 text-xs ${
                      category === "AI/ML"
                        ? "bg-black text-white"
                        : "border border-zinc-200 bg-white text-zinc-500"
                    }`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

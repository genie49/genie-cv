import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import profile from "@data/profile.json";

const COLLAPSED_CATEGORIES = ["AI/ML", "BACKEND", "DB/MESSAGE", "DEVOPS/INFRA"];

const allCategories = Object.entries(profile.techStack);
const alwaysVisible = allCategories.filter(([key]) =>
  COLLAPSED_CATEGORIES.includes(key),
);
const extraCategories = allCategories.filter(
  ([key]) => !COLLAPSED_CATEGORIES.includes(key),
);

export default function TechStackPanel({ bare }: { bare?: boolean }) {
  const [expanded, setExpanded] = useState(false);

  // bare mode: 모달 안에서 사용 — 전체 카테고리 표시, 카드 래퍼 없음
  if (bare) {
    return (
      <div className="flex flex-col gap-4">
        {allCategories.map(([category, items]) => (
          <Category key={category} category={category} items={items as string[]} />
        ))}
      </div>
    );
  }

  return (
    <div className="h-full rounded-2xl bg-toss-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-['Outfit'] text-base font-bold text-toss-heading">
          Tech Stack
        </h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="cursor-pointer text-toss-sub hover:text-toss-heading"
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
        {alwaysVisible.map(([category, items]) => (
          <Category key={category} category={category} items={items as string[]} />
        ))}
        <motion.div
          initial={false}
          animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ overflow: "hidden" }}
        >
          <div className="flex flex-col gap-4">
            {extraCategories.map(([category, items]) => (
              <Category key={category} category={category} items={items as string[]} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Category({ category, items }: { category: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold tracking-wider text-toss-sub">
        {category}
      </span>
      <div className="flex flex-wrap gap-1">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded px-2 py-0.5 text-xs ${
              category === "AI/ML"
                ? "bg-toss-blue text-white"
                : "bg-toss-bg text-toss-body"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

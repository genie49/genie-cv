import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import profile from "@data/profile.json";

const DESKTOP_COLLAPSED = ["AI/ML", "BACKEND", "DB/MESSAGE"];
const MOBILE_COLLAPSED = ["AI/ML", "BACKEND"];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

const allCategories = Object.entries(profile.techStack);

export default function TechStackPanel() {
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();

  const collapsedKeys = isMobile ? MOBILE_COLLAPSED : DESKTOP_COLLAPSED;
  const alwaysVisible = allCategories.filter(([key]) =>
    collapsedKeys.includes(key),
  );
  const extraCategories = allCategories.filter(
    ([key]) => !collapsedKeys.includes(key),
  );

  return (
    <div className="rounded-2xl bg-toss-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6">
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

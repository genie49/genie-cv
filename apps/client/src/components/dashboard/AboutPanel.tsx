import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import profile from "@data/profile.json";

function renderBold(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-zinc-700">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

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

export default function AboutPanel() {
  const paragraphs = profile.about.split("\n\n");
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);

  const isCollapsible = isMobile;
  const showAll = !isCollapsible || expanded;

  return (
    <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-6">
      <div className={`flex items-center justify-between ${isCollapsible ? "mb-3" : "mb-3"}`}>
        <h2 className="font-['Outfit'] text-base font-bold text-black">
          About
        </h2>
        {isCollapsible && (
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
        )}
      </div>
      <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-zinc-500">
        <p>{renderBold(paragraphs[0])}</p>
        {paragraphs.length > 1 && (
          <motion.div
            initial={false}
            animate={{
              height: showAll ? "auto" : 0,
              opacity: showAll ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ overflow: "hidden" }}
          >
            <div className="flex flex-col gap-3">
              {paragraphs.slice(1).map((p, i) => (
                <p key={i}>{renderBold(p)}</p>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

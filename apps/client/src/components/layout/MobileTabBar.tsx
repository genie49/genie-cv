import { NavLink, useLocation } from "react-router";
import { motion } from "motion/react";
import { User, Folder, MessageCircle, Sparkles } from "lucide-react";

const tabs = [
  { to: "/", icon: User, label: "ABOUT" },
  { to: "/projects", icon: Folder, label: "PROJECTS" },
  { to: "/qna", icon: MessageCircle, label: "Q&A" },
  { to: "/chat", icon: Sparkles, label: "AI CHAT" },
];

function isTabActive(to: string, pathname: string) {
  if (to === "/") return pathname === "/";
  return pathname.startsWith(to);
}

export default function MobileTabBar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-toss-border bg-white px-4 pb-6 pt-3 md:hidden">
      <div className="flex h-14 items-center rounded-[28px] border border-toss-border bg-toss-bg p-1">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = isTabActive(to, pathname);
          return (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 rounded-3xl py-2"
            >
              {/* layoutId sliding indicator */}
              {active && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-3xl bg-toss-blue"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              {/* Press feedback */}
              <motion.div
                className={`relative z-10 flex flex-col items-center gap-1 ${active ? "text-white" : "text-toss-sub"}`}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
              >
                <Icon size={18} />
                <span className="text-[10px] font-medium tracking-wide">
                  {label}
                </span>
              </motion.div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

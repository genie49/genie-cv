import { NavLink } from "react-router";
import { User, Folder, MessageCircle, Sparkles } from "lucide-react";

const tabs = [
  { to: "/", icon: User, label: "ABOUT" },
  { to: "/projects", icon: Folder, label: "PROJECTS" },
  { to: "/qna", icon: MessageCircle, label: "Q&A" },
  { to: "/chat", icon: Sparkles, label: "AI CHAT" },
];

export default function MobileTabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-toss-border bg-white px-4 pb-6 pt-3 md:hidden">
      <div className="flex h-14 items-center rounded-[28px] border border-toss-border bg-toss-bg p-1">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 rounded-3xl py-2 transition-colors ${
                isActive
                  ? "bg-toss-blue text-white"
                  : "text-toss-sub"
              }`
            }
          >
            <Icon size={18} />
            <span className="text-[10px] font-medium tracking-wide">
              {label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

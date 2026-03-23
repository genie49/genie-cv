import { NavLink, useLocation } from "react-router";
import { motion } from "motion/react";
import { User, Folder, MessageCircle, Sparkles, Github, Mail } from "lucide-react";

const navItems = [
  { to: "/", icon: User, label: "About" },
  { to: "/projects", icon: Folder, label: "Projects" },
  { to: "/qna", icon: MessageCircle, label: "Q&A" },
  { to: "/chat", icon: Sparkles, label: "AI Chat" },
];


function isNavActive(to: string, pathname: string) {
  if (to === "/") return pathname === "/";
  return pathname.startsWith(to);
}

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="hidden md:flex w-[260px] shrink-0 flex-col border-r border-toss-border bg-white px-6 py-8">
      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4 pb-6"
      >
        <div className="flex h-20 w-20 overflow-hidden rounded-full bg-toss-bg border-2 border-toss-border shadow-sm">
          <img 
            src="/images/profile.png" 
            alt="Profile" 
            className="h-full w-full object-cover"
          />
        </div>
        <p className="font-['Outfit'] text-[22px] font-extrabold text-toss-heading">
          김형진
        </p>
        <p className="text-[13px] font-medium text-toss-sub">AI Engineer</p>
        <p className="text-center text-xs leading-relaxed text-toss-sub">
          AI와 웹 기술을 결합하여
          <br />
          실용적인 프로덕트를 만듭니다.
        </p>
      </motion.div>

      {/* Divider */}
      <div className="h-px w-full bg-toss-border" />

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 py-4">
        {navItems.map(({ to, icon: Icon, label }, i) => {
          const active = isNavActive(to, pathname);
          return (
            <motion.div
              key={to}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <NavLink
                to={to}
                end={to === "/"}
                className="relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium"
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute inset-0 rounded-lg bg-toss-blue"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <motion.div
                  className={`relative z-10 flex items-center gap-2.5 ${active ? "text-white" : "text-toss-sub"}`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={16} />
                  {label}
                </motion.div>
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Divider */}
      <div className="h-px w-full bg-toss-border" />

      {/* Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col gap-2 pt-4"
      >
        <a
          href="https://github.com/genie49"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-medium text-toss-sub hover:text-toss-heading"
        >
          <Github size={14} />
          GitHub
        </a>
        <a
          href="mailto:kimgenie0409@gmail.com"
          className="flex items-center gap-2 text-xs font-medium text-toss-sub hover:text-toss-heading"
        >
          <Mail size={14} />
          kimgenie0409@gmail.com
        </a>
      </motion.div>
    </aside>
  );
}

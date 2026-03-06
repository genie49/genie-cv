import { NavLink } from "react-router";
import { motion } from "motion/react";
import { User, Folder, MessageCircle, Sparkles, Github, Mail } from "lucide-react";

const navItems = [
  { to: "/", icon: User, label: "About" },
  { to: "/projects", icon: Folder, label: "Projects" },
  { to: "/qna", icon: MessageCircle, label: "Q&A" },
  { to: "/chat", icon: Sparkles, label: "AI Chat" },
];


export default function Sidebar() {
  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 px-6 py-8">
      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4 pb-6"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-200">
          <span className="font-['Outfit'] text-3xl font-extrabold text-zinc-500">
            G
          </span>
        </div>
        <p className="font-['Outfit'] text-[22px] font-extrabold text-black">
          김형진
        </p>
        <p className="text-[13px] font-medium text-zinc-500">AI Engineer</p>
        <p className="text-center text-xs leading-relaxed text-zinc-400">
          AI와 웹 기술을 결합하여
          <br />
          실용적인 프로덕트를 만듭니다.
        </p>
      </motion.div>

      {/* Divider */}
      <div className="h-px w-full bg-zinc-200" />

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 py-4">
        {navItems.map(({ to, icon: Icon, label }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-black text-white"
                    : "text-zinc-500 hover:bg-zinc-100"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Divider */}
      <div className="h-px w-full bg-zinc-200" />

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
          className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-zinc-600"
        >
          <Github size={14} />
          GitHub
        </a>
        <a
          href="mailto:kimgenie0409@gmail.com"
          className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-zinc-600"
        >
          <Mail size={14} />
          kimgenie0409@gmail.com
        </a>
      </motion.div>
    </aside>
  );
}

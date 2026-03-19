import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router";
import { useLocalRuntime, AssistantRuntimeProvider } from "@assistant-ui/react";
import { AnimatePresence, motion } from "motion/react";
import Sidebar from "./components/layout/Sidebar";
import MobileTabBar from "./components/layout/MobileTabBar";
import { chatModelAdapter } from "./lib/chat-runtime";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const QnAPage = lazy(() => import("./pages/QnAPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));

export default function App() {
  const runtime = useLocalRuntime(chatModelAdapter);
  const location = useLocation();

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-toss-bg pb-24 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Suspense>
                <Routes location={location}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/:slug" element={<ProjectDetailPage />} />
                  <Route path="/projects/:slug/notes/:id" element={<BlogPostPage />} />
                  <Route path="/qna" element={<QnAPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                </Routes>
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
        <MobileTabBar />
      </div>
    </AssistantRuntimeProvider>
  );
}

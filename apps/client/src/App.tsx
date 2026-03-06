import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import { useLocalRuntime, AssistantRuntimeProvider } from "@assistant-ui/react";
import Sidebar from "./components/layout/Sidebar";
import { chatModelAdapter } from "./lib/chat-runtime";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const QnAPage = lazy(() => import("./pages/QnAPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));

export default function App() {
  const runtime = useLocalRuntime(chatModelAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-white">
          <Suspense>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/projects/:slug/notes/:id" element={<BlogPostPage />} />
              <Route path="/qna" element={<QnAPage />} />
              <Route path="/chat" element={<ChatPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </AssistantRuntimeProvider>
  );
}

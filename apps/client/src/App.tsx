import { Routes, Route } from "react-router";
import { useLocalRuntime, AssistantRuntimeProvider } from "@assistant-ui/react";
import Sidebar from "./components/layout/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import BlogPostPage from "./pages/BlogPostPage";
import QnAPage from "./pages/QnAPage";
import ChatPage from "./pages/ChatPage";
import { chatModelAdapter } from "./lib/chat-runtime";

export default function App() {
  const runtime = useLocalRuntime(chatModelAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-white">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/projects/:slug/notes/:id" element={<BlogPostPage />} />
            <Route path="/qna" element={<QnAPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </main>
      </div>
    </AssistantRuntimeProvider>
  );
}

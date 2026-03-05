import { Routes, Route } from "react-router";

function Placeholder({ name }: { name: string }) {
  return <div className="p-8 text-zinc-500">{name}</div>;
}

export default function App() {
  return (
    <div className="flex h-screen">
      <aside className="w-[260px] border-r border-zinc-200 bg-zinc-50 p-6">
        <p className="text-sm font-semibold text-zinc-900">김형진</p>
        <p className="text-xs text-zinc-500">AI Engineer</p>
      </aside>
      <main className="flex-1 overflow-auto bg-white">
        <Routes>
          <Route path="/" element={<Placeholder name="Dashboard" />} />
          <Route path="/projects" element={<Placeholder name="Projects" />} />
          <Route path="/projects/:slug" element={<Placeholder name="Project Detail" />} />
          <Route path="/projects/:slug/notes/:id" element={<Placeholder name="Blog Post" />} />
          <Route path="/qna" element={<Placeholder name="Q&A" />} />
          <Route path="/chat" element={<Placeholder name="AI Chat" />} />
        </Routes>
      </main>
    </div>
  );
}

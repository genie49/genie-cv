export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Citation {
  index: number;
  text: string;
  source: string;
  route: string;
  label: string;
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

export interface ChatSSEEvent {
  type: "token" | "citations" | "done" | "error";
  data: string | Citation[] | null;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  period: string;
  github?: string;
  demo?: string;
  features: { title: string; description: string }[];
  notes: BlogPostMeta[];
}

export interface BlogPostMeta {
  id: string;
  projectSlug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
}

export interface QnAItem {
  question: string;
  answer: string;
}

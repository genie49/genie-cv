import type { ChatModelAdapter } from "@assistant-ui/react";
import type { Citation } from "@genie-cv/shared";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

function applyCitations(text: string, citations: Citation[]): string {
  let result = text;
  for (const c of citations) {
    result = result.replaceAll(
      `[${c.index}]`,
      `[\\[${c.index}\\] ${c.label}](${c.route})`
    );
  }
  return result;
}

export const chatModelAdapter: ChatModelAdapter = {
  async *run({ messages, abortSignal }) {
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role,
      content:
        m.content
          .filter((p): p is { type: "text"; text: string } => p.type === "text")
          .map((p) => p.text)
          .join("") || "",
    }));

    const lastMessage = messages[messages.length - 1];
    const message =
      lastMessage.content
        .filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("") || "";

    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
      signal: abortSignal,
    });

    if (!res.ok) {
      throw new Error(`Chat API error: ${res.status}`);
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";
    let citations: Citation[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.trim()) continue;
        const event = JSON.parse(line);
        if (event.type === "token") {
          fullText += event.data;
          yield { content: [{ type: "text" as const, text: fullText }] };
        } else if (event.type === "citations") {
          citations = event.data;
          const withCitations = applyCitations(fullText, citations);
          yield { content: [{ type: "text" as const, text: withCitations }] };
        }
      }
    }
  },
};

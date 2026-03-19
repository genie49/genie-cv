import type { ChatModelAdapter } from "@assistant-ui/react";
import type { Citation } from "@genie-cv/shared";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

function applyCitations(text: string, citations: Citation[]): string {
  // 본문에서 모든 [N] 인용 번호 패턴 제거
  let result = text.replace(/\[\d+\]/g, "");
  // 중복 제거된 citation을 마커로 텍스트 끝에 추가
  const unique = citations.filter(
    (c, i, arr) => arr.findIndex((x) => x.route === c.route) === i,
  );
  if (unique.length > 0) {
    result += `\n\n<!--CITATIONS:${JSON.stringify(unique)}-->`;
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
      if (res.status === 429) {
        const body = await res.json();
        yield { content: [{ type: "text" as const, text: body.data || "잠깐, 숨 좀 고를게요... 1분 후 다시 시도해주세요!" }] };
        return;
      }
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
        } else if (event.type === "error") {
          const errorText = event.data || "알 수 없는 오류가 발생했어요.";
          yield { content: [{ type: "text" as const, text: errorText }] };
          return;
        }
      }
    }
  },
};

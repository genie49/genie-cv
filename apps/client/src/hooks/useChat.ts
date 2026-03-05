import { useState, useCallback } from "react";
import { streamChat } from "../lib/api";
import type { ChatMessage, Citation } from "@genie-cv/shared";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const send = useCallback(
    async (message: string) => {
      const userMsg: ChatMessage = { role: "user", content: message };
      const history = [...messages, userMsg];
      setMessages(history);
      setCitations([]);
      setIsStreaming(true);

      const assistantMsg: ChatMessage = { role: "assistant", content: "" };
      setMessages([...history, assistantMsg]);

      try {
        for await (const event of streamChat(message, history.slice(0, -1))) {
          if (event.type === "token") {
            assistantMsg.content += event.data;
            setMessages([...history, { ...assistantMsg }]);
          } else if (event.type === "citations") {
            setCitations(event.data);
          }
        }
      } catch {
        assistantMsg.content += "\n\n(응답 중 오류가 발생했습니다)";
        setMessages([...history, { ...assistantMsg }]);
      } finally {
        setIsStreaming(false);
      }
    },
    [messages]
  );

  return { messages, citations, isStreaming, send };
}

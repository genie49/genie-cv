import { Elysia } from "elysia";
import { AIMessageChunk } from "@langchain/core/messages";
import { agent } from "../../agent/graph";
import {
  getLastSearchResults,
  clearLastSearchResults,
} from "../../agent/tools/rag-search.tool";
import { mapCitations } from "../../knowledge/citations";

export const chatRoute = new Elysia().post("/api/chat", ({ body }) => {
  const { message, history } = body as {
    message: string;
    history: Array<{ role: string; content: string }>;
  };

  const startTime = Date.now();
  console.log(`[chat] 요청: "${message}" (history: ${history.length}건)`);

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        clearLastSearchResults();

        const messages = [
          ...history.map((m) => ({ role: m.role, content: m.content })),
          { role: "user" as const, content: message },
        ];

        console.log("[chat] agent.stream 시작");
        const stream = await agent.stream(
          { messages },
          { streamMode: "messages" }
        );

        let tokenCount = 0;
        for await (const [msg, _metadata] of stream) {
          if (
            msg instanceof AIMessageChunk &&
            typeof msg.content === "string" &&
            msg.content
          ) {
            tokenCount++;
            controller.enqueue(
              encoder.encode(
                JSON.stringify({ type: "token", data: msg.content }) + "\n"
              )
            );
          }
        }
        console.log(`[chat] 스트리밍 완료: ${tokenCount}개 토큰`);

        const searchResults = getLastSearchResults();
        if (searchResults.length > 0) {
          const citations = mapCitations(searchResults);
          console.log(`[chat] citations: ${citations.length}건`);
          controller.enqueue(
            encoder.encode(
              JSON.stringify({ type: "citations", data: citations }) + "\n"
            )
          );
        }

        controller.enqueue(
          encoder.encode(
            JSON.stringify({ type: "done", data: null }) + "\n"
          )
        );
        console.log(`[chat] 완료 (${Date.now() - startTime}ms)`);
      } catch (err) {
        console.error("[chat] 에러:", err);
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              type: "error",
              data: err instanceof Error ? err.message : "Unknown error",
            }) + "\n"
          )
        );
      } finally {
        clearLastSearchResults();
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
});

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

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        clearLastSearchResults();

        const messages = [
          ...history.map((m) => ({ role: m.role, content: m.content })),
          { role: "user" as const, content: message },
        ];

        const stream = await agent.stream(
          { messages },
          { streamMode: "messages" }
        );

        for await (const [msg, _metadata] of stream) {
          if (
            msg instanceof AIMessageChunk &&
            typeof msg.content === "string" &&
            msg.content
          ) {
            controller.enqueue(
              encoder.encode(
                JSON.stringify({ type: "token", data: msg.content }) + "\n"
              )
            );
          }
        }

        const searchResults = getLastSearchResults();
        if (searchResults.length > 0) {
          const citations = mapCitations(searchResults);
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
      } catch (err) {
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

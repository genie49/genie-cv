import { Elysia } from "elysia";
import { AIMessageChunk } from "@langchain/core/messages";
import { agent } from "../../agent/graph";
import {
  getLastSearchResults,
  clearLastSearchResults,
} from "../../agent/tools/rag-search.tool";
import { mapCitations } from "../../knowledge/citations";

export const chatRoute = new Elysia().post(
  "/api/chat",
  async function* ({ body }) {
    const { message, history } = body as {
      message: string;
      history: Array<{ role: string; content: string }>;
    };

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
        yield JSON.stringify({ type: "token", data: msg.content }) + "\n";
      }
    }

    const searchResults = getLastSearchResults();
    if (searchResults.length > 0) {
      const citations = mapCitations(searchResults);
      yield JSON.stringify({ type: "citations", data: citations }) + "\n";
    }

    yield JSON.stringify({ type: "done", data: null }) + "\n";
    clearLastSearchResults();
  }
);

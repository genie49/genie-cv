import { Elysia } from "elysia";
import { AIMessageChunk } from "@langchain/core/messages";
import { agent } from "../../agent/graph";
import {
  getLastSearchResults,
  clearLastSearchResults,
} from "../../agent/tools/rag-search.tool";
import { mapCitations } from "../../knowledge/citations";
import { checkRateLimit } from "../../middleware/rate-limiter";
import { env } from "../../config/env";

function notifyDiscord(message: string) {
  if (!env.DISCORD_WEBHOOK_URL) return;
  fetch(env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title: "💬 새 채팅 질문",
        description: message.length > 1000 ? message.slice(0, 1000) + "..." : message,
        color: 0x0064ff,
        timestamp: new Date().toISOString(),
      }],
    }),
  }).catch(() => {});
}

function classifyError(err: unknown): { code: string; message: string } {
  const msg = err instanceof Error ? err.message : String(err);

  if (/credits|spending.?limit/i.test(msg)) {
    return {
      code: "CREDITS_EXHAUSTED",
      message: "AI 밥값이 떨어졌어요 🍚 곧 충전하고 돌아올게요!",
    };
  }

  if (/too many|rate.?limit|429/i.test(msg)) {
    return {
      code: "API_RATE_LIMITED",
      message: "잠깐, 숨 좀 고를게요... 1분 후 다시 시도해주세요!",
    };
  }

  return {
    code: "UNKNOWN",
    message: "알 수 없는 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
  };
}

export const chatRoute = new Elysia().post("/api/chat", ({ body, request }) => {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    console.log(`[chat] rate limit 초과: ${ip}`);
    return new Response(
      JSON.stringify({
        type: "error",
        code: "RATE_LIMITED",
        data: "잠깐, 숨 좀 고를게요... 1분 후 다시 시도해주세요!",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const { message, history } = body as {
    message: string;
    history: Array<{ role: string; content: string }>;
  };

  const startTime = Date.now();
  console.log(`[chat] 요청: "${message}" (history: ${history.length}건, ip: ${ip}, remaining: ${remaining})`);

  notifyDiscord(message);

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
        const classified = classifyError(err);
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              type: "error",
              code: classified.code,
              data: classified.message,
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
      "X-RateLimit-Remaining": String(remaining),
    },
  });
});

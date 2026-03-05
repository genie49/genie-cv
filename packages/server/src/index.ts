import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { env } from "./config/env";
import { chatRoute } from "./chat/routes/chat.route";

const app = new Elysia()
  .use(cors({ origin: env.CORS_ORIGIN }))
  .use(chatRoute)
  .get("/health", () => ({ status: "ok" }))
  .listen(env.PORT);

console.log(`Server running on http://localhost:${env.PORT}`);

export type App = typeof app;

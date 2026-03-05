import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { env } from "./config/env";

const app = new Elysia()
  .use(cors({ origin: env.CORS_ORIGIN }))
  .get("/health", () => ({ status: "ok" }))
  .listen(env.PORT);

console.log(`Server running on http://localhost:${env.PORT}`);

export type App = typeof app;

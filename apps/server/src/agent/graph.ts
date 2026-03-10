import { createAgent } from "langchain";
import { ChatXAI } from "@langchain/xai";
import { SYSTEM_PROMPT } from "./prompts/system.prompt";
import { ragSearchTool } from "./tools/rag-search.tool";
import { env } from "../config/env";

const llm = new ChatXAI({
  apiKey: env.XAI_API_KEY,
  model: "grok-4-1-fast-reasoning",
});

export const agent = createAgent({
  model: llm,
  tools: [ragSearchTool],
  systemPrompt: SYSTEM_PROMPT,
});

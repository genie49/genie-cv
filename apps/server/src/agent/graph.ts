import { createAgent } from "langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SYSTEM_PROMPT } from "./prompts/system.prompt";
import { ragSearchTool } from "./tools/rag-search.tool";
import { env } from "../config/env";

const llm = new ChatGoogleGenerativeAI({
  apiKey: env.GOOGLE_API_KEY,
  model: "gemini-3.6-flash",
});

export const agent = createAgent({
  model: llm,
  tools: [ragSearchTool],
  systemPrompt: SYSTEM_PROMPT,
});

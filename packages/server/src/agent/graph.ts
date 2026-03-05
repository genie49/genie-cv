import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatXAI } from "@langchain/xai";
import { SystemMessage } from "@langchain/core/messages";
import { SYSTEM_PROMPT } from "./prompts/system.prompt";
import { ragSearchTool } from "./tools/rag-search.tool";
import { env } from "../config/env";

const llm = new ChatXAI({
  apiKey: env.XAI_API_KEY,
  model: "grok-4-1",
});

export const agent = createReactAgent({
  llm,
  tools: [ragSearchTool],
  prompt: new SystemMessage(SYSTEM_PROMPT),
});

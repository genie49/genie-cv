import { GoogleGenAI } from "@google/genai";
import { getTable } from "./loader";
import { env } from "../config/env";

const ai = new GoogleGenAI({ apiKey: env.GOOGLE_API_KEY });

export interface SearchResult {
  text: string;
  source: string;
  projectSlug: string;
}

export async function retrieve(
  query: string,
  topK = 5
): Promise<SearchResult[]> {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: query,
    taskType: "RETRIEVAL_QUERY",
  });
  const vector = response.embeddings![0].values!;
  const table = await getTable();
  const results = await table.search(vector).limit(topK).toArray();
  return results.map((r) => ({
    text: r.text as string,
    source: r.source as string,
    projectSlug: (r.projectSlug as string) || "",
  }));
}

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { getTable } from "./loader";
import { env } from "../config/env";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: env.GOOGLE_API_KEY,
  modelName: "text-embedding-004",
});

export interface SearchResult {
  text: string;
  source: string;
  projectSlug: string;
}

export async function retrieve(
  query: string,
  topK = 5
): Promise<SearchResult[]> {
  const vector = await embeddings.embedQuery(query);
  const table = await getTable();
  const results = await table.search(vector).limit(topK).toArray();
  return results.map((r) => ({
    text: r.text as string,
    source: r.source as string,
    projectSlug: (r.projectSlug as string) || "",
  }));
}

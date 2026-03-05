import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { retrieve, type SearchResult } from "../../knowledge/retriever";

let lastSearchResults: SearchResult[] = [];

export function getLastSearchResults(): SearchResult[] {
  return lastSearchResults;
}

export function clearLastSearchResults(): void {
  lastSearchResults = [];
}

export const ragSearchTool = tool(
  async ({ query }: { query: string }): Promise<string> => {
    const results = await retrieve(query);
    lastSearchResults = results;

    if (results.length === 0) {
      return "관련 정보를 찾지 못했습니다.";
    }

    return results
      .map((r, i) => `[${i + 1}] (${r.source})\n${r.text}`)
      .join("\n\n---\n\n");
  },
  {
    name: "rag_search",
    description:
      "김형진의 경력, 프로젝트, 기술 스택, 학력 등에 대한 정보를 검색합니다. 사용자가 김형진에 대해 질문할 때 사용하세요.",
    schema: z.object({
      query: z.string().describe("검색 쿼리 (한국어 또는 영어)"),
    }),
  }
);

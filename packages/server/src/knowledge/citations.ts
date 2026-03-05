import type { Citation } from "@genie-cv/shared";
import type { SearchResult } from "./retriever";

const ROUTE_MAP: Record<string, string> = {
  "about.md": "/",
  "education.md": "/",
  "experience.md": "/",
  "qna.json": "/qna",
};

const LABEL_MAP: Record<string, string> = {
  "about.md": "자기소개",
  "education.md": "학력",
  "experience.md": "경력",
  "qna.json": "Q&A",
};

function getRoute(r: SearchResult): string {
  if (ROUTE_MAP[r.source]) return ROUTE_MAP[r.source];
  if (
    r.source.startsWith("notes/") ||
    r.source.startsWith("architectures/notes/")
  )
    return `/projects/${r.projectSlug}/notes/${r.source.split("/").pop()?.replace(/\.(md|mmd)$/, "")}`;
  return `/projects/${r.source.replace(/^(projects\/|architectures\/projects\/)/, "").replace(/\.(md|mmd)$/, "")}`;
}

function getLabel(r: SearchResult): string {
  if (LABEL_MAP[r.source]) return LABEL_MAP[r.source];
  const filename =
    r.source.split("/").pop()?.replace(/\.(md|mmd)$/, "") || r.source;
  return filename
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function mapCitations(results: SearchResult[]): Citation[] {
  const seen = new Set<string>();
  return results
    .filter((r) => {
      if (seen.has(r.source)) return false;
      seen.add(r.source);
      return true;
    })
    .map((r, i) => ({
      index: i + 1,
      text: r.text.slice(0, 100),
      source: r.source,
      route: getRoute(r),
      label: getLabel(r),
    }));
}

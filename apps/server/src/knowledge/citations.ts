import type { Citation } from "@genie-cv/shared";
import type { SearchResult } from "./retriever";
import projects from "../../../../data/projects.json";

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

// 유효한 프로젝트 slug와 노트 id 목록
const validSlugs = new Set(projects.map((p: { slug: string }) => p.slug));
const validNoteIds = new Set(
  projects.flatMap((p: { notes: { id: string }[] }) => p.notes.map((n) => n.id)),
);

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

function isValidRoute(r: SearchResult): boolean {
  // about, education, experience, qna는 항상 유효
  if (ROUTE_MAP[r.source]) return true;
  // 프로젝트 페이지
  if (r.source.startsWith("projects/") || r.source.startsWith("architectures/projects/")) {
    const slug = r.source.replace(/^(projects\/|architectures\/projects\/)/, "").replace(/\.(md|mmd)$/, "");
    return validSlugs.has(slug);
  }
  // 노트 페이지
  if (r.source.startsWith("notes/") || r.source.startsWith("architectures/notes/")) {
    const noteId = r.source.split("/").pop()?.replace(/\.(md|mmd)$/, "") || "";
    return validNoteIds.has(noteId);
  }
  return false;
}

export function mapCitations(results: SearchResult[]): Citation[] {
  const seen = new Set<string>();
  return results
    .filter((r) => {
      if (seen.has(r.source)) return false;
      seen.add(r.source);
      return isValidRoute(r);
    })
    .map((r, i) => ({
      index: i + 1,
      text: r.text.slice(0, 100),
      source: r.source,
      route: getRoute(r),
      label: getLabel(r),
    }));
}

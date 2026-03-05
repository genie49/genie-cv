import { readdir, readFile } from "fs/promises";
import { join, relative, basename } from "path";

const DATA_DIR = join(import.meta.dir, "../data");
const CONTENT_DIR = join(DATA_DIR, "content");
const ARCH_DIR = join(DATA_DIR, "architectures");
const DB_DIR = join(import.meta.dir, "../packages/server/db");

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error("GOOGLE_API_KEY 환경변수가 필요합니다.");
  process.exit(1);
}

interface Chunk {
  text: string;
  source: string;
  projectSlug?: string;
}

// projects.json에서 노트 → 프로젝트 슬러그 매핑 생성
async function buildNoteToProjectMap(): Promise<Record<string, string>> {
  const projects = JSON.parse(
    await readFile(join(DATA_DIR, "projects.json"), "utf-8")
  );
  const map: Record<string, string> = {};
  for (const project of projects) {
    for (const note of project.notes) {
      map[note.id] = project.slug;
    }
  }
  return map;
}

// 디렉토리 내 파일을 재귀적으로 수집
async function collectFiles(
  dir: string,
  ext: string
): Promise<string[]> {
  const files: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await collectFiles(fullPath, ext)));
      } else if (entry.name.endsWith(ext)) {
        files.push(fullPath);
      }
    }
  } catch {
    // 디렉토리가 없으면 무시
  }
  return files;
}

// MD 파일을 H2 기준으로 청크 분할
function splitByH2(content: string, source: string, projectSlug?: string): Chunk[] {
  const sections = content.split(/^## /m);
  const chunks: Chunk[] = [];

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;
    chunks.push({
      text: trimmed.length > 2000 ? trimmed.slice(0, 2000) : trimmed,
      source,
      projectSlug,
    });
  }

  if (chunks.length === 0 && content.trim()) {
    chunks.push({ text: content.trim(), source, projectSlug });
  }

  return chunks;
}

// Gemini Embedding API 호출
async function embed(texts: string[]): Promise<number[][]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:batchEmbedContents?key=${GOOGLE_API_KEY}`;

  // 배치 크기 제한 (최대 100개)
  const batchSize = 100;
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: batch.map((text) => ({
          model: "models/text-embedding-004",
          content: { parts: [{ text }] },
        })),
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Gemini Embedding API 에러: ${res.status} ${error}`);
    }

    const data = await res.json();
    allEmbeddings.push(
      ...data.embeddings.map((e: { values: number[] }) => e.values)
    );

    if (i + batchSize < texts.length) {
      // Rate limiting
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return allEmbeddings;
}

async function main() {
  console.log("임베딩 파이프라인 시작...\n");

  const noteToProject = await buildNoteToProjectMap();
  const allChunks: Chunk[] = [];

  // 1. MD 파일 수집 및 청크 분할
  const mdFiles = await collectFiles(CONTENT_DIR, ".md");
  for (const file of mdFiles) {
    const content = await readFile(file, "utf-8");
    const relPath = relative(CONTENT_DIR, file);
    const noteId = basename(file, ".md");
    const projectSlug = relPath.startsWith("notes/")
      ? noteToProject[noteId]
      : undefined;
    const chunks = splitByH2(content, relPath, projectSlug);
    allChunks.push(...chunks);
    console.log(`  MD: ${relPath} → ${chunks.length}개 청크`);
  }

  // 2. Mermaid 파일 수집
  const mmdFiles = await collectFiles(ARCH_DIR, ".mmd");
  for (const file of mmdFiles) {
    const content = await readFile(file, "utf-8");
    const relPath = relative(DATA_DIR, file).replace(/^architectures\//, "architectures/");
    const noteId = basename(file, ".mmd");
    const isNote = file.includes("/notes/");
    const projectSlug = isNote ? noteToProject[noteId] : undefined;
    allChunks.push({
      text: `아키텍처 다이어그램:\n${content}`,
      source: relPath,
      projectSlug,
    });
    console.log(`  MMD: ${relPath} → 1개 청크`);
  }

  // 3. Q&A JSON
  const qnaRaw = await readFile(join(DATA_DIR, "qna.json"), "utf-8");
  const qnaItems = JSON.parse(qnaRaw);
  for (const item of qnaItems) {
    allChunks.push({
      text: `질문: ${item.question}\n답변: ${item.answer}`,
      source: "qna.json",
    });
  }
  console.log(`  QNA: qna.json → ${qnaItems.length}개 청크`);

  console.log(`\n총 ${allChunks.length}개 청크 생성됨`);

  // 4. 임베딩
  console.log("Gemini Embedding 호출 중...");
  const vectors = await embed(allChunks.map((c) => c.text));
  console.log(`${vectors.length}개 벡터 생성 완료`);

  // 5. LanceDB 저장
  const { connect } = await import("@lancedb/lancedb");
  const db = await connect(DB_DIR);

  const records = allChunks.map((chunk, i) => ({
    text: chunk.text,
    source: chunk.source,
    projectSlug: chunk.projectSlug || "",
    vector: vectors[i],
  }));

  // 기존 테이블 덮어쓰기
  await db.createTable("documents", records, { mode: "overwrite" });

  console.log(`\nLanceDB 저장 완료: ${DB_DIR}`);
  console.log("임베딩 파이프라인 완료!");
}

main().catch(console.error);

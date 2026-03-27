import { existsSync, mkdirSync, rmSync, readFileSync, writeFileSync, copyFileSync, readdirSync } from "fs";
import { join, basename } from "path";

const BASE_URL = "https://genie-cv.com";
const ROOT = join(import.meta.dir, "..");
const DATA_DIR = join(ROOT, "data");
const CONTENT_DIR = join(DATA_DIR, "content");
const PUBLIC_DIR = join(ROOT, "apps", "client", "public");
const LLMS_DIR = join(PUBLIC_DIR, "llms");

// ── helpers ──────────────────────────────────────────────

function readJSON<T>(filename: string): T {
  return JSON.parse(readFileSync(join(DATA_DIR, filename), "utf-8"));
}

function firstLine(text: string): string {
  return text.split("\n")[0];
}

function ensureDir(dir: string) {
  mkdirSync(dir, { recursive: true });
}

function writeOut(relativePath: string, content: string) {
  const fullPath = join(LLMS_DIR, relativePath);
  ensureDir(join(fullPath, ".."));
  writeFileSync(fullPath, content, "utf-8");
  console.log(`  ✓ ${relativePath}`);
}

// ── types ────────────────────────────────────────────────

interface Profile {
  name: string;
  role: string;
  email: string;
  github: string;
  about: string;
  education: { school: string; major: string; degree: string; period: string; status: string }[];
  experience: { title: string; company: string; period: string; type: string; description: string }[];
  techStack: Record<string, string[]>;
}

interface Note {
  id: string;
  projectSlug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
}

interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  period: string;
  demo?: string;
  github?: string;
  features: { title: string; description: string }[];
  notes: Note[];
}

interface QnA {
  question: string;
  answer: string;
}

// ── 1. initialize output directory ───────────────────────

console.log("🗂  Initializing output directory...");
if (existsSync(LLMS_DIR)) {
  rmSync(LLMS_DIR, { recursive: true });
}
ensureDir(join(LLMS_DIR, "projects"));
ensureDir(join(LLMS_DIR, "notes"));

// ── 2. profile.md ────────────────────────────────────────

console.log("👤 Generating profile.md...");
const profile = readJSON<Profile>("profile.json");

let profileMd = `# ${profile.name} | ${profile.role}

- Email: ${profile.email}
- GitHub: ${profile.github}

## 소개

${profile.about}

## 기술 스택
`;

for (const [category, items] of Object.entries(profile.techStack)) {
  profileMd += `\n### ${category}\n`;
  profileMd += items.map((item) => `- ${item}`).join("\n") + "\n";
}

profileMd += `\n## 경력\n`;
for (const exp of profile.experience) {
  profileMd += `\n### ${exp.company} — ${exp.title} (${exp.period})\n${exp.description}\n`;
}

profileMd += `\n## 학력\n`;
for (const edu of profile.education) {
  profileMd += `\n### ${edu.school}`;
  if (edu.major) profileMd += ` — ${edu.major}`;
  profileMd += `\n- 학위: ${edu.degree}\n- 기간: ${edu.period}\n- 상태: ${edu.status}\n`;
}

writeOut("profile.md", profileMd);

// ── 3. projects.md + projects/{slug}.md ──────────────────

console.log("📁 Generating projects...");
const projects = readJSON<Project[]>("projects.json");

// Collect all notes across projects for later use
const allNotesMeta = new Map<string, Note>();
for (const project of projects) {
  for (const note of project.notes) {
    allNotesMeta.set(note.id, note);
  }
}

// projects.md — summary list
let projectsListMd = `# 프로젝트 목록\n`;
for (const p of projects) {
  projectsListMd += `\n## ${p.title}\n`;
  projectsListMd += `> ${firstLine(p.description)}\n\n`;
  projectsListMd += `- 기간: ${p.period}\n`;
  projectsListMd += `- 태그: ${p.tags.join(", ")}\n`;
  projectsListMd += `- [상세](${BASE_URL}/llms/projects/${p.slug}.md)\n`;
}
writeOut("projects.md", projectsListMd);

// per-project files
for (const p of projects) {
  let md = `# ${p.title}\n\n`;
  md += `> ${firstLine(p.description)}\n\n`;
  md += `- 기간: ${p.period}\n`;
  md += `- 태그: ${p.tags.join(", ")}\n`;
  if (p.demo) md += `- 데모: ${p.demo}\n`;

  md += `\n## 주요 기능\n`;
  for (const feat of p.features) {
    md += `- **${feat.title}**: ${feat.description}\n`;
  }

  // merge content/projects/{slug}.md
  const contentPath = join(CONTENT_DIR, "projects", `${p.slug}.md`);
  if (existsSync(contentPath)) {
    const content = readFileSync(contentPath, "utf-8");
    md += `\n## 상세\n${content}\n`;
  }

  // related notes
  if (p.notes.length > 0) {
    md += `\n## 관련 기술 노트\n`;
    for (const note of p.notes) {
      md += `- [${note.title}](${BASE_URL}/llms/notes/${note.id}.md)\n`;
    }
  }

  writeOut(`projects/${p.slug}.md`, md);
}

// ── 4. qna.md ────────────────────────────────────────────

console.log("❓ Generating qna.md...");
const qnas = readJSON<QnA[]>("qna.json");

let qnaMd = `# Q&A\n`;
for (const q of qnas) {
  qnaMd += `\n## Q: ${q.question}\n\n${q.answer}\n`;
}
writeOut("qna.md", qnaMd);

// ── 5. copy notes ────────────────────────────────────────

console.log("📝 Copying notes...");
const notesDir = join(CONTENT_DIR, "notes");
const noteFiles = readdirSync(notesDir).filter((f) => f.endsWith(".md"));
for (const file of noteFiles) {
  copyFileSync(join(notesDir, file), join(LLMS_DIR, "notes", file));
  console.log(`  ✓ notes/${file}`);
}

// ── 6. llms.txt ──────────────────────────────────────────

console.log("📄 Generating llms.txt...");

let llmsTxt = `# ${profile.name} | ${profile.role}

> AI 엔지니어 ${profile.name}의 포트폴리오. 프로필, 프로젝트, 기술 노트, Q&A를 담고 있다.

## Profile
- [프로필](${BASE_URL}/llms/profile.md): 소개, 기술 스택, 경력, 학력

## Projects
- [프로젝트 목록](${BASE_URL}/llms/projects.md): 전체 프로젝트 요약
`;

for (const p of projects) {
  llmsTxt += `- [${p.title}](${BASE_URL}/llms/projects/${p.slug}.md): ${firstLine(p.description)}\n`;
}

llmsTxt += `
## Q&A
- [Q&A](${BASE_URL}/llms/qna.md): 자기소개, 개발 스타일, 협업 방식 등 ${qnas.length}개 문답

## Technical Notes
`;

for (const file of noteFiles) {
  const id = file.replace(/\.md$/, "");
  const meta = allNotesMeta.get(id);
  const label = meta ? meta.title : id;
  llmsTxt += `- [${label}](${BASE_URL}/llms/notes/${file})\n`;
}

writeFileSync(join(PUBLIC_DIR, "llms.txt"), llmsTxt, "utf-8");
console.log("  ✓ llms.txt");

console.log("\n✅ Done!");

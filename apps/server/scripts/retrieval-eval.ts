/**
 * 검색기 단독 평가 — 리랭킹이 필요한지 판단하기 위한 하네스
 *
 * 에이전트를 거치지 않고 벡터 검색만 호출한다.
 * 정답 청크가 몇 등으로 올라오는지를 재서,
 * "리랭킹이 고칠 수 있는 몫"이 실제로 존재하는지 확인한다.
 *
 * 실행: bun run scripts/retrieval-eval.ts
 */
import { GoogleGenAI } from "@google/genai";
import { connect } from "@lancedb/lancedb";
import { join } from "path";
import { writeFileSync } from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

/** 정답은 (파일, H2 섹션) 쌍으로 지정한다. 청크가 H2 단위로 잘리기 때문. */
type Gold = { source: string; section: string };
type Case = {
  id: string;
  kind: string;
  query: string;
  gold: Gold[]; // 하나라도 맞으면 정답
};

const CASES: Case[] = [
  // ── 직설: 문서의 용어를 그대로 쓴 질문
  {
    id: "direct-backpressure",
    kind: "직설",
    query: "본다 인제스션 파이프라인에서 역압은 어떻게 걸었나요?",
    gold: [
      { source: "notes/bonda-ingestion-pipeline.md", section: "그런데 크롤러가 너무 빨랐다" },
    ],
  },
  {
    id: "direct-qdrant",
    kind: "직설",
    query: "본다는 왜 pgvector 대신 Qdrant를 골랐나요?",
    gold: [{ source: "notes/bonda-tech-stack.md", section: "벡터 DB — pgvector가 아니라 Qdrant인 이유" }],
  },
  {
    id: "direct-asym-embed",
    kind: "직설",
    query: "비대칭 임베딩을 왜 쓰나요?",
    gold: [
      { source: "notes/bonda-vector-search.md", section: "임베딩은 비대칭으로 한다" },
      { source: "notes/rag-pipeline.md", section: "Gemini Embedding — taskType 분리" },
    ],
  },
  {
    id: "direct-sliding-window",
    kind: "직설",
    query: "바라에서 대화 히스토리를 슬라이딩 윈도우로 관리한 이유",
    gold: [
      { source: "notes/bara-koog-agent.md", section: "대화 히스토리를 슬라이딩 윈도우로 관리한다" },
    ],
  },
  {
    id: "direct-wide-event",
    kind: "직설",
    query: "Wide Event 로깅이 뭔가요?",
    gold: [
      {
        source: "notes/fingoo-wide-event-logging.md",
        section: "Wide Event는 요청에 무슨 일이 일어났는지를 하나로 기록한다",
      },
    ],
  },

  // ── 우회: 문서에 없는 표현으로 물어본다
  {
    id: "para-cost-migration",
    kind: "우회",
    query: "DB 요금이 너무 많이 나와서 인프라를 옮긴 적이 있나요?",
    gold: [{ source: "notes/bonda-onprem-cutover.md", section: "벡터DB 디스크가 먼저 찼다" }],
  },
  {
    id: "para-gpu-idle",
    kind: "우회",
    query: "그래픽카드가 놀고 있는 걸 발견하고 어떻게 개선했나요?",
    gold: [{ source: "notes/bonda-model-serving.md", section: "그런데 GPU가 놀고 있었다" }],
  },
  {
    id: "para-undo",
    kind: "우회",
    query: "AI가 실수로 데이터를 망가뜨리면 되돌릴 수 있나요?",
    gold: [
      { source: "notes/kimpro-harness-engineering.md", section: "스냅샷 + 롤백 — 틀려도 복구되는 구조" },
      { source: "notes/kimpro-harness-engineering.md", section: "에이전트가 데이터를 잘못 수정하면?" },
    ],
  },
  {
    id: "para-similar-name",
    kind: "우회",
    query: "이름이 비슷한 회사 때문에 검색이 엉뚱하게 나온 적 있나요?",
    gold: [{ source: "notes/fingoo-rag-pipeline.md", section: '"삼성전자"를 검색하면 "삼성SDI"가 나왔다' }],
  },
  {
    id: "para-secret",
    kind: "우회",
    query: "비밀번호나 키를 코드에 안 넣고 어떻게 관리했나요?",
    gold: [
      { source: "notes/fingoo-ssm-deploy.md", section: ".env 파일의 한계" },
      { source: "notes/fingoo-ssm-deploy.md", section: "경로 하나로 환경을 격리한다" },
      { source: "notes/fingoo-ssm-deploy.md", section: "장기 크레덴셜을 쓰지 않는다" },
    ],
  },
  {
    id: "para-cheap-model",
    kind: "우회",
    query: "쉬운 일에 비싼 모델을 쓰지 않으려고 어떻게 했나요?",
    gold: [
      { source: "notes/bonda-agent-evaluation.md", section: "비싼 일과 싼 일을 티어로 갈랐다" },
      { source: "notes/bonda-pdf-pipeline.md", section: "모든 PDF에 OCR을 돌리면 비용이 폭발한다" },
    ],
  },

  // ── 혼동: 여러 프로젝트에 같은 주제가 있다 (오검색 유발)
  {
    id: "confuse-eval-bonda",
    kind: "혼동",
    query: "본다에서 검색 품질을 숫자로 어떻게 쟀나요?",
    gold: [{ source: "notes/bonda-agent-evaluation.md", section: "검색은 검색대로 숫자로 잰다" }],
  },
  {
    id: "confuse-eval-kimpro",
    kind: "혼동",
    query: "김프로에서 AI가 까다로운 사용자를 연기하게 만든 평가",
    gold: [{ source: "notes/kimpro-agent-evaluation.md", section: "AI가 까다로운 사용자를 연기한다" }],
  },
  {
    id: "confuse-stack-chatbot",
    kind: "혼동",
    query: "이 포트폴리오 챗봇은 벡터 DB로 뭘 쓰나요?",
    gold: [
      { source: "notes/chatbot-tech-stack.md", section: "LanceDB — 서버가 필요 없는 벡터 DB" },
      { source: "notes/rag-pipeline.md", section: "왜 LanceDB인가" },
    ],
  },
  {
    id: "confuse-queue-kimpro",
    kind: "혼동",
    query: "김프로에서 서비스 사이에 메시지 큐를 왜 넣었나요?",
    gold: [
      { source: "notes/kimpro-tech-stack.md", section: "서비스 간 통신 — 왜 메시지 큐가 필요했는가" },
      { source: "notes/kimpro-ai-system-design.md", section: "분리된 둘 사이에 메시지 큐를 놓다" },
    ],
  },
  {
    id: "confuse-ratelimit",
    kind: "혼동",
    query: "챗봇에 무제한으로 질문이 들어오면 어떻게 막나요?",
    gold: [
      { source: "notes/chatbot-defensive-ops.md", section: "IP 기반 Rate Limiting" },
      { source: "notes/langchain-agent.md", section: "방어적 운영: IP 기반 Rate Limiting" },
    ],
  },
  {
    id: "confuse-tool-choice",
    kind: "혼동",
    query: "도구를 잘게 쪼갰더니 오히려 결과가 나빠진 경험",
    gold: [{ source: "notes/fingoo-agentic-ai.md", section: "세밀하게 짰더니 오히려 안 됐다" }],
  },

  // ── 짧은 질문: 키워드 한두 개
  { id: "short-k3s", kind: "짧은질문", query: "쿠버네티스 어떻게 세팅했나요?", gold: [{ source: "notes/bonda-onprem-cutover.md", section: "왜 컴포즈가 아니라 쿠버네티스였나" }] },
  { id: "short-backup", kind: "짧은질문", query: "DB 백업", gold: [{ source: "notes/bonda-onprem-cutover.md", section: "무엇이 어떻게 사라지는지부터 적었다" }] },
  { id: "short-tts", kind: "짧은질문", query: "TTS 캐싱", gold: [{ source: "notes/vocatoktok-tts-pipeline.md", section: "3단계 캐싱으로 합성 대기 시간을 없앤다" }] },
  { id: "short-onnx", kind: "짧은질문", query: "ONNX", gold: [{ source: "notes/bara-tech-stack.md", section: "ONNX Runtime — PyTorch 모델의 기본 경로" }] },
  { id: "short-encoding", kind: "짧은질문", query: "한글 깨짐 인코딩 마이그레이션", gold: [{ source: "notes/vocatoktok-db-encoding.md", section: "인코딩 변환의 세 가지 함정" }, { source: "notes/vocatoktok-db-encoding.md", section: "마이그레이션 파이프라인" }] },

  // ── 최신: 방금 추가한 문서를 찾을 수 있는가
  {
    id: "recent-model-eval",
    kind: "최신",
    query: "챗봇 모델을 왜 바꿨나요?",
    gold: [
      { source: "notes/chatbot-model-eval.md", section: "결과" },
      { source: "notes/chatbot-model-eval.md", section: "공짜는 아니었다" },
      { source: "notes/chatbot-model-eval.md", section: "무엇만 바꿀 것인가" },
    ],
  },
  {
    id: "recent-streaming-bug",
    kind: "최신",
    query: "모델 교체하고 나서 스트리밍이 깨진 버그",
    gold: [{ source: "notes/chatbot-model-eval.md", section: "옮기고 나서 바로 터졌다" }],
  },
];

const DEPTH = 30; // 후보를 깊게 뽑아서 정답이 몇 등에 있는지 본다

function isGold(chunk: { source: string; text: string }, gold: Gold[]) {
  return gold.some(
    (g) => chunk.source === g.source && chunk.text.startsWith(g.section)
  );
}

const db = await connect(join(import.meta.dir, "../db"));
const table = await db.openTable("documents");

type Row = {
  id: string;
  kind: string;
  query: string;
  rank: number; // 1-based, 0이면 DEPTH 안에 없음
  top5Sources: string[];
  offProject5: number; // top5 중 정답 문서와 다른 프로젝트에서 온 청크 수
  latencyMs: number;
};

const rows: Row[] = [];

for (const c of CASES) {
  const t0 = Date.now();
  const res = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: c.query,
    config: { taskType: "RETRIEVAL_QUERY" },
  });
  const hits = await table
    .search(res.embeddings![0].values!)
    .limit(DEPTH)
    .toArray();
  const latencyMs = Date.now() - t0;

  const chunks = hits.map((h: any) => ({
    source: h.source as string,
    text: h.text as string,
    slug: (h.projectSlug as string) || "",
  }));

  const idx = chunks.findIndex((ch) => isGold(ch, c.gold));
  const goldSlugPrefix = c.gold[0].source.split("/").pop()!.split("-")[0];
  const offProject5 = chunks
    .slice(0, 5)
    .filter((ch) => !ch.source.includes(goldSlugPrefix)).length;

  rows.push({
    id: c.id,
    kind: c.kind,
    query: c.query,
    rank: idx + 1,
    top5Sources: chunks.slice(0, 5).map((ch) => ch.source),
    offProject5,
    latencyMs,
  });

  const mark = idx === 0 ? "🥇" : idx > 0 && idx < 5 ? "✅" : idx >= 5 ? "⚠️ " : "❌";
  console.log(
    `${mark} ${c.id.padEnd(22)} rank=${idx + 1 || "-"} ${latencyMs}ms  ${c.query}`
  );
}

writeFileSync(
  new URL("./retrieval-eval-result.json", import.meta.url),
  JSON.stringify(rows, null, 2)
);

const n = rows.length;
const at = (k: number) => rows.filter((r) => r.rank >= 1 && r.rank <= k).length;
const mrr =
  rows.reduce((s, r) => s + (r.rank >= 1 && r.rank <= 5 ? 1 / r.rank : 0), 0) / n;

console.log("\n## 전체\n");
console.log(`| 지표 | 값 |`);
console.log(`|---|---|`);
console.log(`| recall@1 | ${at(1)}/${n} |`);
console.log(`| recall@3 | ${at(3)}/${n} |`);
console.log(`| recall@5 (현재 설정) | ${at(5)}/${n} |`);
console.log(`| recall@10 | ${at(10)}/${n} |`);
console.log(`| recall@20 | ${at(20)}/${n} |`);
console.log(`| recall@30 | ${at(30)}/${n} |`);
console.log(`| MRR@5 | ${mrr.toFixed(3)} |`);
console.log(
  `| 리랭킹 상한 (@20 − @5) | ${at(20) - at(5)}건 |`
);

console.log("\n## 유형별 recall@5\n");
for (const kind of [...new Set(CASES.map((c) => c.kind))]) {
  const rs = rows.filter((r) => r.kind === kind);
  const hit = rs.filter((r) => r.rank >= 1 && r.rank <= 5).length;
  const r1 = rs.filter((r) => r.rank === 1).length;
  console.log(`| ${kind} | ${hit}/${rs.length} (1등 ${r1}) |`);
}

console.log("\n## 5등 밖으로 밀린 케이스\n");
for (const r of rows.filter((r) => r.rank === 0 || r.rank > 5)) {
  console.log(`- ${r.id} rank=${r.rank || "30위 밖"} :: ${r.query}`);
  console.log(`    top5: ${r.top5Sources.join(", ")}`);
}

const lat = rows.map((r) => r.latencyMs).sort((a, b) => a - b);
console.log(
  `\n검색 지연 중앙값 ${lat[Math.floor(lat.length / 2)]}ms (min ${lat[0]} / max ${lat.at(-1)})`
);

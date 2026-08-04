/**
 * 모델 비교 실험 하네스
 *
 * 시스템 프롬프트·도구·벡터DB를 고정하고 LLM만 바꿔서
 * 이 포트폴리오 에이전트가 실제로 어떻게 달라지는지 측정한다.
 *
 * 실행: bun run scripts/model-eval.ts [반복횟수]
 */
import { createAgent } from "langchain";
import { ChatXAI } from "@langchain/xai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SYSTEM_PROMPT } from "../src/agent/prompts/system.prompt";
import { ragSearchTool } from "../src/agent/tools/rag-search.tool";
import { writeFileSync } from "fs";

type Case = {
  id: string;
  category: string;
  turns: string[]; // 마지막 턴이 채점 대상
  expectAll?: string[]; // 전부 포함해야 통과
  expectAny?: string[]; // 하나 이상 포함해야 통과
  expectRefusal?: boolean; // 모른다고 답해야 통과
  expectNoTool?: boolean; // 검색을 부르지 않아야 통과
};

const REFUSAL = ["정리되어 있지 않", "찾을 수 없", "확인할 수 없", "정보가 없"];
// 없는 걸 물었을 때, 모른다고 하는 것뿐 아니라 틀린 전제를 바로잡는 답도 정답이다.
// ("Kafka가 아니라 Redis 큐를 썼습니다" — 거절보다 나은 답)
const CORRECTION = ["대신", "사용하지 않", "쓰지 않", "아니라", "없습니다"];

const CASES: Case[] = [
  // ── 사실 검색: 답이 문서에 명확히 있다
  {
    id: "fact-onprem",
    category: "사실검색",
    turns: ["본다는 왜 온프레미스로 옮겼나요?"],
    expectAny: ["비용", "요금", "디스크", "과금"],
  },
  {
    id: "fact-backpressure",
    category: "사실검색",
    turns: ["본다 인제스션에서 역압은 왜 필요했나요?"],
    expectAny: ["크롤", "디스크", "앞서", "적재"],
  },
  {
    id: "fact-fingoo-agent",
    category: "사실검색",
    turns: ["핀구에서 에이전트 구조를 세 번 바꾼 이유가 뭔가요?"],
    expectAny: ["맥락", "컨텍스트", "노드", "연쇄"],
  },
  {
    id: "fact-eval",
    category: "사실검색",
    turns: ["본다에서 검색 품질과 에이전트 품질을 어떻게 구분해서 평가했나요?"],
    expectAny: ["recall", "MRR", "NDCG", "직호출", "골든"],
  },

  // ── 종합: 여러 문서를 엮어야 한다
  {
    id: "synth-gpu-cost",
    category: "종합",
    turns: ["김형진이 GPU 비용을 다뤄본 경험을 정리해줘"],
    expectAny: ["GPU", "파드", "서빙"],
  },
  {
    id: "synth-compare",
    category: "종합",
    turns: ["여러 프로젝트에서 RAG를 만들었는데 각각 어떻게 달랐나요?"],
    expectAll: ["Qdrant"],
    expectAny: ["pgvector", "LanceDB", "핀구", "fingoo"],
  },

  // ── 환각 저항: 포트폴리오에 없는 것
  {
    id: "halluc-toeic",
    category: "환각저항",
    turns: ["김형진의 토익 점수가 몇 점인가요?"],
    expectRefusal: true,
  },
  {
    id: "halluc-kafka",
    category: "환각저항",
    turns: ["본다에서 Kafka를 어떤 식으로 활용했나요?"],
    expectRefusal: true,
  },
  {
    id: "halluc-project",
    category: "환각저항",
    turns: ["김형진이 만든 블록체인 지갑 프로젝트에 대해 알려줘"],
    expectRefusal: true,
  },

  // ── 도구 호출 판단: 검색이 필요 없는 대화
  {
    id: "notool-greet",
    category: "도구판단",
    turns: ["안녕하세요!"],
    expectNoTool: true,
  },
  {
    id: "notool-thanks",
    category: "도구판단",
    turns: ["설명 고마워요"],
    expectNoTool: true,
  },

  // ── 멀티턴: 대명사 해소
  {
    id: "multi-auth",
    category: "멀티턴",
    turns: [
      "본다 온프레미스 이전 얘기 해줘",
      "그때 인증이 왜 문제가 됐던 거야?",
    ],
    expectAny: ["FK", "유저", "Auth", "인증"],
  },
];

const MODELS = {
  "grok-4-1-fast-reasoning": () =>
    new ChatXAI({
      apiKey: process.env.XAI_API_KEY!,
      model: "grok-4-1-fast-reasoning",
    }),
  "gemini-3.6-flash": () =>
    new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY!,
      model: "gemini-3.6-flash",
    }),
};

type Run = {
  model: string;
  caseId: string;
  category: string;
  rep: number;
  latencyMs: number;
  toolCalls: number;
  tokensIn: number;
  tokensOut: number;
  chars: number;
  pass: boolean;
  reason: string;
  answer: string;
  error?: string;
};

function grade(c: Case, answer: string, toolCalls: number) {
  const refused = REFUSAL.some((r) => answer.includes(r));

  if (c.expectNoTool) {
    return toolCalls === 0
      ? { pass: true, reason: "검색 호출 없음" }
      : { pass: false, reason: `불필요한 검색 ${toolCalls}회` };
  }
  if (c.expectRefusal) {
    if (refused) return { pass: true, reason: "모른다고 답함" };
    if (CORRECTION.some((k) => answer.includes(k)))
      return { pass: true, reason: "틀린 전제를 바로잡음" };
    return { pass: false, reason: "없는 내용을 지어냄" };
  }
  if (refused) return { pass: false, reason: "찾을 수 있는데 모른다고 함" };

  const missAll = (c.expectAll ?? []).filter((k) => !answer.includes(k));
  if (missAll.length) return { pass: false, reason: `누락: ${missAll.join(",")}` };

  if (c.expectAny?.length) {
    const hit = c.expectAny.filter((k) => answer.includes(k));
    return hit.length
      ? { pass: true, reason: `키워드 ${hit.join(",")}` }
      : { pass: false, reason: `기대 키워드 전무: ${c.expectAny.join("/")}` };
  }
  return { pass: true, reason: "통과" };
}

async function runCase(
  modelName: string,
  makeModel: () => any,
  c: Case,
  rep: number
): Promise<Run> {
  const agent = createAgent({
    model: makeModel(),
    tools: [ragSearchTool],
    systemPrompt: SYSTEM_PROMPT,
  });

  const history: any[] = [];
  let last: any = null;
  const t0 = Date.now();
  try {
    for (const turn of c.turns) {
      history.push({ role: "user", content: turn });
      last = await agent.invoke({ messages: history });
      const msgs = last.messages;
      history.length = 0;
      history.push(...msgs);
    }
  } catch (e: any) {
    return {
      model: modelName,
      caseId: c.id,
      category: c.category,
      rep,
      latencyMs: Date.now() - t0,
      toolCalls: 0,
      tokensIn: 0,
      tokensOut: 0,
      chars: 0,
      pass: false,
      reason: "예외",
      answer: "",
      error: String(e).slice(0, 300),
    };
  }
  const latencyMs = Date.now() - t0;

  const msgs = last.messages as any[];
  // 마지막 턴에서만 도구 호출을 센다
  const lastUserIdx = msgs.map((m) => m.getType?.()).lastIndexOf("human");
  const tail = msgs.slice(lastUserIdx);
  const toolCalls = tail.reduce(
    (n, m) => n + (m.tool_calls?.length ?? 0),
    0
  );
  const tokensIn = msgs.reduce(
    (n, m) => n + (m.usage_metadata?.input_tokens ?? 0),
    0
  );
  const tokensOut = msgs.reduce(
    (n, m) => n + (m.usage_metadata?.output_tokens ?? 0),
    0
  );
  const answer =
    typeof msgs.at(-1)?.content === "string"
      ? msgs.at(-1).content
      : JSON.stringify(msgs.at(-1)?.content ?? "");

  const g = grade(c, answer, toolCalls);
  return {
    model: modelName,
    caseId: c.id,
    category: c.category,
    rep,
    latencyMs,
    toolCalls,
    tokensIn,
    tokensOut,
    chars: answer.length,
    pass: g.pass,
    reason: g.reason,
    answer,
  };
}

const REPS = Number(process.argv[2] ?? 2);
const runs: Run[] = [];

for (const [name, make] of Object.entries(MODELS)) {
  console.log(`\n=== ${name} ===`);
  for (const c of CASES) {
    for (let rep = 1; rep <= REPS; rep++) {
      const r = await runCase(name, make, c, rep);
      runs.push(r);
      const mark = r.pass ? "✅" : "❌";
      console.log(
        `${mark} ${c.id}#${rep} ${r.latencyMs}ms tools=${r.toolCalls} out=${r.tokensOut} :: ${r.reason}${r.error ? " | " + r.error : ""}`
      );
    }
  }
}

writeFileSync(
  new URL("./model-eval-result.json", import.meta.url),
  JSON.stringify(runs, null, 2)
);

// ── 요약
const models = Object.keys(MODELS);
const cats = [...new Set(CASES.map((c) => c.category))];
const med = (a: number[]) => {
  const s = [...a].sort((x, y) => x - y);
  return s.length ? s[Math.floor(s.length / 2)] : 0;
};

console.log("\n\n## 카테고리별 통과율\n");
console.log(`| 카테고리 | ${models.join(" | ")} |`);
console.log(`|---|${models.map(() => "---").join("|")}|`);
for (const cat of cats) {
  const cells = models.map((m) => {
    const rs = runs.filter((r) => r.model === m && r.category === cat);
    const p = rs.filter((r) => r.pass).length;
    return `${p}/${rs.length}`;
  });
  console.log(`| ${cat} | ${cells.join(" | ")} |`);
}

console.log("\n## 지표\n");
console.log(`| 지표 | ${models.join(" | ")} |`);
console.log(`|---|${models.map(() => "---").join("|")}|`);
const metrics: [string, (r: Run) => number, (a: number[]) => number][] = [
  ["통과율 %", (r) => (r.pass ? 100 : 0), (a) => Math.round(a.reduce((x, y) => x + y, 0) / a.length)],
  ["지연 중앙값 ms", (r) => r.latencyMs, med],
  ["출력 토큰 중앙값", (r) => r.tokensOut, med],
  ["입력 토큰 합", (r) => r.tokensIn, (a) => a.reduce((x, y) => x + y, 0)],
  ["답변 길이 중앙값", (r) => r.chars, med],
];
for (const [label, pick, agg] of metrics) {
  const cells = models.map((m) =>
    String(agg(runs.filter((r) => r.model === m).map(pick)))
  );
  console.log(`| ${label} | ${cells.join(" | ")} |`);
}

console.log("\n## 실패 목록\n");
for (const m of models) {
  const f = runs.filter((r) => r.model === m && !r.pass);
  console.log(`### ${m} (${f.length}건)`);
  for (const r of f) console.log(`- ${r.caseId}#${r.rep}: ${r.reason}`);
}
console.log("\n원문: scripts/model-eval-result.json");

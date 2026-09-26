import { NextRequest, NextResponse } from "next/server";
import { trackDemoEvent } from "@/lib/supabase-server";

type Category =
  | "big-tech-swe"
  | "ai-ml-research"
  | "infra-platform"
  | "product-management"
  | "finance-quant";

const CATEGORY_WINDOWS: Record<
  Category,
  { label: string; opens: string; closes: string; basis: string }
> = {
  "big-tech-swe": {
    label: "Big tech SWE internships",
    opens: "Late July",
    closes: "Early October",
    basis: "Historically the widest posting window; most large tech employers post summer roles the prior fall.",
  },
  "ai-ml-research": {
    label: "AI / ML research internships",
    opens: "August",
    closes: "November",
    basis: "Research-heavy roles post later and stay open longer while teams finalize project scope.",
  },
  "infra-platform": {
    label: "Infra / platform engineering internships",
    opens: "September",
    closes: "Early December",
    basis: "Platform teams (the kind behind Kubernetes, deployment, and observability tooling) tend to post after headcount is finalized in Q4 planning.",
  },
  "product-management": {
    label: "APM / PM internships",
    opens: "Late July",
    closes: "September",
    basis: "PM programs at large companies typically run the tightest, earliest windows of any track.",
  },
  "finance-quant": {
    label: "Quant / finance internships",
    opens: "June",
    closes: "August",
    basis: "Quant shops post earliest of any category, often a full year ahead of the internship start.",
  },
};

const ROLE_KEYWORDS: Record<string, string[]> = {
  "ai-engineer": [
    "python",
    "llm",
    "machine learning",
    "rag",
    "retrieval",
    "pytorch",
    "api integration",
    "prompt",
    "vector",
    "typescript",
  ],
  "swe-infra": [
    "go",
    "java",
    "kubernetes",
    "distributed systems",
    "rest api",
    "ci/cd",
    "observability",
    "docker",
    "cloud",
    "microservices",
  ],
  "full-stack": [
    "react",
    "typescript",
    "node",
    "rest api",
    "sql",
    "css",
    "next.js",
    "authentication",
    "testing",
    "git",
  ],
};

function analyzeKeywords(resumeText: string, roleKey: string) {
  const keywords = ROLE_KEYWORDS[roleKey] ?? ROLE_KEYWORDS["ai-engineer"];
  const lower = resumeText.toLowerCase();
  const matched = keywords.filter((k) => lower.includes(k));
  const missing = keywords.filter((k) => !lower.includes(k));
  const score = Math.round((matched.length / keywords.length) * 100);
  return { matched, missing, score };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const category = (body.category as Category) in CATEGORY_WINDOWS ? (body.category as Category) : "big-tech-swe";
  const roleKey = typeof body.roleKey === "string" ? body.roleKey : "ai-engineer";
  const resumeText = typeof body.resumeText === "string" ? body.resumeText.slice(0, 8000) : "";

  await trackDemoEvent("up2date", "predict");

  const windowInfo = CATEGORY_WINDOWS[category];
  const keywordAnalysis = resumeText.trim().length > 0 ? analyzeKeywords(resumeText, roleKey) : null;

  return NextResponse.json({
    window: windowInfo,
    keywordAnalysis,
    categories: Object.entries(CATEGORY_WINDOWS).map(([key, v]) => ({ key, label: v.label })),
    roleOptions: Object.keys(ROLE_KEYWORDS),
  });
}

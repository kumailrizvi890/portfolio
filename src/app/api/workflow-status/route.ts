import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer, trackDemoEvent } from "@/lib/supabase-server";

type WorkflowRun = {
  id: string | number;
  workflow_name: string;
  status: "success" | "failed";
  duration_ms: number;
  source: string;
  created_at: string;
};

const WORKFLOW_NAMES = [
  "job-board-crawler",
  "resume-keyword-sync",
  "notion-pipeline-sync",
  "gmail-followup-drafts",
  "crm-lead-enrichment",
  "interview-scheduler",
];

const SOURCES = ["cron: */30 * * * *", "manual trigger", "webhook: notion.page_updated", "cron: 0 8 * * *"];

// Deterministic-ish synthetic history, used only when Supabase isn't
// configured for this deployment (local preview, forked repo without env
// vars set) so the dashboard never renders empty.
function syntheticRuns(count: number): WorkflowRun[] {
  const now = Date.now();
  const runs: WorkflowRun[] = [];
  for (let i = 0; i < count; i++) {
    const seed = Math.sin(i * 12.9898) * 43758.5453;
    const frac = seed - Math.floor(seed);
    const name = WORKFLOW_NAMES[i % WORKFLOW_NAMES.length];
    runs.push({
      id: `synthetic-${i}`,
      workflow_name: name,
      status: frac > 0.15 ? "success" : "failed",
      duration_ms: Math.round(400 + frac * 3200),
      source: SOURCES[i % SOURCES.length],
      created_at: new Date(now - i * 1000 * 60 * 47).toISOString(),
    });
  }
  return runs;
}

function computeStats(runs: WorkflowRun[]) {
  if (runs.length === 0) {
    return { totalRuns: 0, successRate: 0, avgDurationMs: 0 };
  }
  const successCount = runs.filter((r) => r.status === "success").length;
  const avgDuration = runs.reduce((sum, r) => sum + r.duration_ms, 0) / runs.length;
  return {
    totalRuns: runs.length,
    successRate: Math.round((successCount / runs.length) * 1000) / 10,
    avgDurationMs: Math.round(avgDuration),
  };
}

export async function GET() {
  const client = getSupabaseServer();

  if (client) {
    const { data, error } = await client
      .from("workflow_runs")
      .select("id, workflow_name, status, duration_ms, source, created_at")
      .order("created_at", { ascending: false })
      .limit(24);

    if (!error && data && data.length > 0) {
      return NextResponse.json({ runs: data, stats: computeStats(data as WorkflowRun[]), live: true });
    }
  }

  const runs = syntheticRuns(24);
  return NextResponse.json({ runs, stats: computeStats(runs), live: false });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const workflowName =
    typeof body.workflowName === "string" && body.workflowName.trim()
      ? body.workflowName.trim().slice(0, 80)
      : WORKFLOW_NAMES[Math.floor(Math.random() * WORKFLOW_NAMES.length)];

  const status: "success" | "failed" = Math.random() > 0.12 ? "success" : "failed";
  const durationMs = Math.round(350 + Math.random() * 3400);
  const source = "manual trigger";

  const client = getSupabaseServer();
  await trackDemoEvent("workflow-automation", "trigger");

  if (client) {
    const { data, error } = await client
      .from("workflow_runs")
      .insert({ workflow_name: workflowName, status, duration_ms: durationMs, source })
      .select("id, workflow_name, status, duration_ms, source, created_at")
      .single();

    if (!error && data) {
      return NextResponse.json({ run: data, live: true });
    }
  }

  return NextResponse.json({
    run: {
      id: `local-${Date.now()}`,
      workflow_name: workflowName,
      status,
      duration_ms: durationMs,
      source,
      created_at: new Date().toISOString(),
    },
    live: false,
  });
}

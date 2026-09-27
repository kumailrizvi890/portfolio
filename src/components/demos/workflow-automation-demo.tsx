"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PlayCircle } from "@phosphor-icons/react/dist/ssr";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Run = {
  id: string | number;
  workflow_name: string;
  status: "success" | "failed";
  duration_ms: number;
  source: string;
  created_at: string;
};

type Stats = { totalRuns: number; successRate: number; avgDurationMs: number };

const INK = "#a1a1aa";
const GRID = "#27272a";
const OK = "#0ca30c";
const DOWN = "#d03b3b";

export function WorkflowAutomationDemo() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [stats, setStats] = useState<Stats>({ totalRuns: 0, successRate: 0, avgDurationMs: 0 });
  const [live, setLive] = useState(false);
  const [triggering, setTriggering] = useState(false);

  async function load() {
    const res = await fetch("/api/workflow-status", { cache: "no-store" });
    const json = await res.json();
    setRuns(json.runs ?? []);
    setStats(json.stats ?? { totalRuns: 0, successRate: 0, avgDurationMs: 0 });
    setLive(Boolean(json.live));
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/workflow-status", { cache: "no-store" });
      const json = await res.json();
      if (cancelled) return;
      setRuns(json.runs ?? []);
      setStats(json.stats ?? { totalRuns: 0, successRate: 0, avgDurationMs: 0 });
      setLive(Boolean(json.live));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function trigger() {
    setTriggering(true);
    try {
      await fetch("/api/workflow-status", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      await load();
    } finally {
      setTriggering(false);
    }
  }

  const chartData = useMemo(() => {
    const byWorkflow = new Map<string, { success: number; failed: number }>();
    for (const run of runs) {
      const entry = byWorkflow.get(run.workflow_name) ?? { success: 0, failed: 0 };
      if (run.status === "success") entry.success += 1;
      else entry.failed += 1;
      byWorkflow.set(run.workflow_name, entry);
    }
    const labels = Array.from(byWorkflow.keys());
    return {
      labels,
      datasets: [
        {
          label: "Success",
          data: labels.map((l) => byWorkflow.get(l)!.success),
          backgroundColor: OK,
          borderRadius: 4,
          maxBarThickness: 28,
        },
        {
          label: "Failed",
          data: labels.map((l) => byWorkflow.get(l)!.failed),
          backgroundColor: DOWN,
          borderRadius: 4,
          maxBarThickness: 28,
        },
      ],
    };
  }, [runs]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-mono text-muted-2">
          {live ? "Reading live from Supabase" : "Supabase not configured in this environment, showing synthetic history"}
        </p>
        <button
          type="button"
          onClick={trigger}
          disabled={triggering}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-transform hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
        >
          <PlayCircle size={16} weight="fill" />
          {triggering ? "Running..." : "Trigger a workflow run"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Total runs" value={stats.totalRuns.toString()} />
        <StatTile label="Success rate" value={`${stats.successRate}%`} />
        <StatTile label="Avg duration" value={`${stats.avgDurationMs.toLocaleString()}ms`} />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h3 className="font-mono text-xs uppercase tracking-wider text-muted-2 mb-4">Runs by workflow</h3>
        <div className="h-72">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  stacked: true,
                  ticks: { color: INK, font: { family: "var(--font-mono)", size: 11 } },
                  grid: { display: false },
                },
                y: {
                  stacked: true,
                  beginAtZero: true,
                  ticks: { color: INK, precision: 0 },
                  grid: { color: GRID },
                },
              },
              plugins: {
                legend: {
                  position: "top",
                  align: "end",
                  labels: { color: INK, boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: "circle" },
                },
                tooltip: {
                  backgroundColor: "#18181b",
                  borderColor: "#27272a",
                  borderWidth: 1,
                  titleColor: "#fafafa",
                  bodyColor: "#a1a1aa",
                  padding: 10,
                },
              },
            }}
          />
        </div>
      </div>

      <div>
        <h3 className="font-mono text-xs uppercase tracking-wider text-muted-2 mb-3">Recent runs</h3>
        <ul className="divide-y divide-border rounded-2xl border border-border bg-surface overflow-hidden">
          {runs.slice(0, 8).map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <span className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${r.status === "success" ? "bg-status-ok" : "bg-status-down"}`} />
                <span className="text-foreground font-mono text-xs sm:text-sm">{r.workflow_name}</span>
              </span>
              <span className="text-muted-2 text-xs font-mono hidden sm:inline">{r.source}</span>
              <span className="text-muted text-xs font-mono">{r.duration_ms}ms</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-xs text-muted-2 font-mono uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground tabular-nums">{value}</p>
    </div>
  );
}

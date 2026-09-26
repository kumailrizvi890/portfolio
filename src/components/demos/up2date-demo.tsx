"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "@phosphor-icons/react/dist/ssr";
import { trackRun } from "@/components/demo-run-counter";

type WindowInfo = { label: string; opens: string; closes: string; basis: string };
type KeywordAnalysis = { matched: string[]; missing: string[]; score: number };

const CATEGORIES = [
  { key: "big-tech-swe", label: "Big tech SWE" },
  { key: "ai-ml-research", label: "AI / ML research" },
  { key: "infra-platform", label: "Infra / platform" },
  { key: "product-management", label: "APM / PM" },
  { key: "finance-quant", label: "Quant / finance" },
];

const ROLES = [
  { key: "ai-engineer", label: "AI engineer" },
  { key: "swe-infra", label: "SWE, infra" },
  { key: "full-stack", label: "Full-stack" },
];

export function Up2DateDemo() {
  const [category, setCategory] = useState(CATEGORIES[0].key);
  const [roleKey, setRoleKey] = useState(ROLES[0].key);
  const [resumeText, setResumeText] = useState("");
  const [windowInfo, setWindowInfo] = useState<WindowInfo | null>(null);
  const [keywordAnalysis, setKeywordAnalysis] = useState<KeywordAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const res = await fetch("/api/predict-window", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, roleKey, resumeText }),
      });
      const json = await res.json();
      setWindowInfo(json.window);
      setKeywordAnalysis(json.keywordAnalysis);
      trackRun("up2date");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Internship category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-accent"
          >
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Target role for keyword match</label>
          <select
            value={roleKey}
            onChange={(e) => setRoleKey(e.target.value)}
            className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-accent"
          >
            {ROLES.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          Paste resume text <span className="text-muted-2 font-normal">(optional, for keyword match)</span>
        </label>
        <textarea
          rows={5}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste a resume or project description to score against the target role's keywords..."
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent"
        />
      </div>

      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-transform hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? "Predicting..." : "Predict window"}
      </button>

      {windowInfo && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted-2">{windowInfo.label}</h3>
            <p className="mt-3 text-2xl font-semibold text-foreground">
              {windowInfo.opens} <span className="text-muted-2 text-base font-normal">to</span> {windowInfo.closes}
            </p>
            <p className="mt-3 text-sm text-muted leading-relaxed">{windowInfo.basis}</p>
          </div>

          {keywordAnalysis && (
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-baseline justify-between">
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted-2">Keyword match</h3>
                <span className="text-2xl font-semibold text-accent">{keywordAnalysis.score}%</span>
              </div>
              <div className="mt-4 space-y-3">
                {keywordAnalysis.matched.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {keywordAnalysis.matched.map((k) => (
                      <span key={k} className="inline-flex items-center gap-1 rounded-full border border-status-ok/40 bg-status-ok/10 px-2.5 py-1 text-xs text-status-ok">
                        <CheckCircle size={12} weight="fill" />
                        {k}
                      </span>
                    ))}
                  </div>
                )}
                {keywordAnalysis.missing.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {keywordAnalysis.missing.map((k) => (
                      <span key={k} className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-2">
                        <XCircle size={12} />
                        {k}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

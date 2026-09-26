"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WarningCircle, ShieldCheck, ShieldWarning } from "@phosphor-icons/react/dist/ssr";
import { trackRun } from "@/components/demo-run-counter";

type Verdict = "safe" | "suspicious" | "scam";

type Result = {
  verdict: Verdict;
  score: number;
  signals: string[];
  rationale: string;
};

const PRESETS = [
  {
    label: "Phishing example",
    subject: "URGENT: Your account will be suspended within 24 hours",
    sender: "security@paypal-alerts.com",
    body:
      "Dear Customer, we detected unusual activity. Click here to verify your account immediately or it will be suspended. Act now to avoid permanent closure!!!",
  },
  {
    label: "Prize scam example",
    subject: "You have been selected to claim your prize!",
    sender: "winner-notice@gmail.com",
    body:
      "Congratulations! You've won a refund of $4,750. To claim your prize, send a small processing fee via gift card or wire transfer within 24 hours.",
  },
  {
    label: "Normal email example",
    subject: "Notes from today's design review",
    sender: "priya@acmehq.com",
    body:
      "Hey team, attaching the notes from today's review. Let's sync tomorrow at 2pm to go over the open questions on the onboarding flow.",
  },
];

const VERDICT_STYLES: Record<Verdict, { icon: typeof ShieldCheck; text: string; ring: string }> = {
  safe: { icon: ShieldCheck, text: "text-status-ok", ring: "border-status-ok/40 bg-status-ok/10" },
  suspicious: { icon: ShieldWarning, text: "text-status-warn", ring: "border-status-warn/40 bg-status-warn/10" },
  scam: { icon: WarningCircle, text: "text-status-down", ring: "border-status-down/40 bg-status-down/10" },
};

export function QmailDemo() {
  const [subject, setSubject] = useState(PRESETS[0].subject);
  const [sender, setSender] = useState(PRESETS[0].sender);
  const [body, setBody] = useState(PRESETS[0].body);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function loadPreset(i: number) {
    setSubject(PRESETS[i].subject);
    setSender(PRESETS[i].sender);
    setBody(PRESETS[i].body);
    setResult(null);
  }

  async function classify() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/scam-classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, sender, body }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Classification failed");
        setResult(null);
        return;
      }
      setResult(json);
      trackRun("qmail");
    } catch {
      setError("Network error reaching the classifier.");
    } finally {
      setLoading(false);
    }
  }

  const VerdictIcon = result ? VERDICT_STYLES[result.verdict].icon : null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-4">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, i) => (
            <button
              key={p.label}
              type="button"
              onClick={() => loadPreset(i)}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:border-muted-2 hover:text-foreground transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground" htmlFor="sender">
            From
          </label>
          <input
            id="sender"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent font-mono"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground" htmlFor="subject">
            Subject
          </label>
          <input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground" htmlFor="body">
            Body
          </label>
          <textarea
            id="body"
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent"
          />
        </div>

        <button
          type="button"
          onClick={classify}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-transform hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Classifying..." : "Classify this email"}
        </button>
        {error && <p className="text-sm text-status-down">{error}</p>}
      </div>

      <div className="lg:col-span-2">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key={result.verdict + result.score}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-6 ${VERDICT_STYLES[result.verdict].ring}`}
            >
              <div className={`flex items-center gap-2 font-medium ${VERDICT_STYLES[result.verdict].text}`}>
                {VerdictIcon && <VerdictIcon size={20} weight="fill" />}
                <span className="uppercase tracking-wide text-sm">{result.verdict}</span>
                <span className="ml-auto font-mono text-sm">{result.score}/100</span>
              </div>
              <p className="mt-3 text-sm text-foreground leading-relaxed">{result.rationale}</p>
              <ul className="mt-4 space-y-1.5">
                {result.signals.map((s) => (
                  <li key={s} className="text-xs text-muted flex gap-2">
                    <span className="text-muted-2">-</span>
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
              Load a preset or write your own email, then classify it. This runs the real classifier code, live.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

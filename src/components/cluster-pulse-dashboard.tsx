"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { CheckCircle, WarningCircle, XCircle, Pulse } from "@phosphor-icons/react/dist/ssr";
import { useFleetStatus, type FleetResponse, type ServiceStatus } from "@/lib/use-fleet-status";

const STATUS_LABEL: Record<ServiceStatus["status"], string> = {
  ok: "Healthy",
  warn: "Degraded",
  down: "Down",
};

const STATUS_BADGE: Record<ServiceStatus["status"], string> = {
  ok: "border-status-ok/30 bg-status-ok/10 text-status-ok",
  warn: "border-status-warn/30 bg-status-warn/10 text-status-warn",
  down: "border-status-down/30 bg-status-down/10 text-status-down",
};

const STATUS_DOT: Record<ServiceStatus["status"], string> = {
  ok: "bg-status-ok",
  warn: "bg-status-warn",
  down: "bg-status-down",
};

const VERDICT: Record<
  FleetResponse["riskBand"],
  { label: string; copy: string; ring: string; text: string; Icon: typeof CheckCircle }
> = {
  low: {
    label: "Safe to ship",
    copy: "Nothing here would block a deploy right now.",
    ring: "var(--status-ok)",
    text: "text-status-ok",
    Icon: CheckCircle,
  },
  elevated: {
    label: "Proceed with caution",
    copy: "A couple of services are drifting outside their normal range — worth a second look before shipping.",
    ring: "var(--status-warn)",
    text: "text-status-warn",
    Icon: WarningCircle,
  },
  high: {
    label: "Hold the deploy",
    copy: "At least one service is past the threshold that would page an on-call engineer.",
    ring: "var(--status-down)",
    text: "text-status-down",
    Icon: XCircle,
  },
};

function RiskGauge({ score, band }: { score: number; band: FleetResponse["riskBand"] }) {
  const pct = Math.max(0, Math.min(100, score));
  const ring = VERDICT[band].ring;
  return (
    <div
      role="img"
      aria-label={`Deploy risk score ${score} out of 100, ${band} risk`}
      className="relative h-24 w-24 shrink-0 rounded-full p-[5px] transition-[background] duration-500"
      style={{ background: `conic-gradient(${ring} ${pct}%, var(--surface-2) 0)` }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-surface">
        <span className="text-2xl font-bold tabular-nums text-foreground">{score}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-2">/ 100</span>
      </div>
    </div>
  );
}

function LoadSpikeButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`glow-btn ${active ? "is-active" : ""}`}>
      <span className="relative z-[1]">{active ? "Stop the simulation" : "Simulate a load spike"}</span>
      <style jsx>{`
        .glow-btn {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border-radius: 9999px;
          padding: 0.7rem 1.4rem;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #fff;
          background: linear-gradient(
            to top,
            #ffe9c2 0px,
            #ffd27a 2px,
            #f5a524 5px,
            #dd8f1c 8px,
            #a06a16 11px,
            #6b4610 14px,
            #402c0c 18px,
            #1c1409 24px,
            #111113 34px,
            #111113 100%
          );
          box-shadow:
            inset 0 1px 0 rgba(255, 220, 160, 0.12),
            inset 1px 0 0 rgba(255, 255, 255, 0.06),
            inset -1px 0 0 rgba(255, 255, 255, 0.06),
            0 0 8px rgba(245, 165, 36, 0.16),
            0 2px 6px -3px rgba(245, 165, 36, 0.55);
          transition: transform 0.2s ease, filter 0.2s ease;
        }
        .glow-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background: linear-gradient(90deg, rgba(255, 224, 170, 0.35), rgba(255, 224, 170, 0) 13px),
            linear-gradient(270deg, rgba(255, 224, 170, 0.35), rgba(255, 224, 170, 0) 13px);
          -webkit-mask: linear-gradient(
            to top,
            #000 0,
            #000 6px,
            rgba(0, 0, 0, 0.4) 12px,
            rgba(0, 0, 0, 0.15) 18px,
            rgba(0, 0, 0, 0.08) 24px,
            rgba(0, 0, 0, 0.02) 30px,
            rgba(0, 0, 0, 0.02) 100%
          );
          mask: linear-gradient(
            to top,
            #000 0,
            #000 6px,
            rgba(0, 0, 0, 0.4) 12px,
            rgba(0, 0, 0, 0.15) 18px,
            rgba(0, 0, 0, 0.08) 24px,
            rgba(0, 0, 0, 0.02) 30px,
            rgba(0, 0, 0, 0.02) 100%
          );
        }
        .glow-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.1);
        }
        .glow-btn:active {
          transform: translateY(0);
        }
        .glow-btn.is-active {
          background: linear-gradient(
            to top,
            #ffd9d9 0px,
            #ff9d9d 2px,
            #d03b3b 5px,
            #a72f2f 8px,
            #742020 11px,
            #481414 14px,
            #240b0b 18px,
            #120707 24px,
            #111113 34px,
            #111113 100%
          );
          box-shadow:
            inset 0 1px 0 rgba(255, 180, 180, 0.12),
            inset 1px 0 0 rgba(255, 255, 255, 0.06),
            inset -1px 0 0 rgba(255, 255, 255, 0.06),
            0 0 8px rgba(208, 59, 59, 0.18),
            0 2px 6px -3px rgba(208, 59, 59, 0.55);
        }
      `}</style>
    </button>
  );
}

export function ClusterPulseDashboard() {
  const [stress, setStress] = useState(false);
  const { data, error } = useFleetStatus(stress);
  const reduce = useReducedMotion();

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
        Cluster Pulse&rsquo;s API is warming up. Give it a moment and refresh &mdash; Vercel&rsquo;s Go functions
        occasionally take an extra second on a cold start.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 animate-pulse space-y-4">
        <div className="h-6 w-48 rounded bg-surface-2" />
        <div className="h-24 w-24 rounded-full bg-surface-2" />
        <div className="h-16 w-full rounded bg-surface-2" />
      </div>
    );
  }

  const verdict = VERDICT[data.riskBand];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-border bg-surface"
    >
      {/* a single, static wash of the brand accent - not a spinning glow, just quiet texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full opacity-[0.07] blur-3xl"
        style={{ background: "var(--accent)" }}
      />

      <div className="relative p-6 sm:p-8">
        {/* live badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-mono text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-ok opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-status-ok" />
          </span>
          Live simulation &middot; {data.clusterCount} clusters &middot; 3 regions
        </div>

        {/* plain-english framing, up front, before any jargon */}
        <div className="mt-5 max-w-2xl">
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-2">What you&rsquo;re looking at</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            This is a live simulation of a small backend fleet &mdash; six services spread across three regions.
            It&rsquo;s the same kind of dashboard a platform engineer checks before approving a deploy: is everything
            healthy enough to ship? The verdict below updates every few seconds, computed live by a real Go service.
          </p>
        </div>

        {/* the verdict, this is the whole story at a glance */}
        <div className="mt-6 flex flex-col items-start gap-5 rounded-2xl border border-border bg-background/40 p-5 sm:flex-row sm:items-center">
          <RiskGauge score={data.deployRiskScore} band={data.riskBand} />
          <div>
            <div className={`flex items-center gap-2 text-lg font-semibold ${verdict.text}`}>
              <verdict.Icon size={22} weight="fill" />
              {verdict.label}
            </div>
            <p className="mt-1 text-sm text-muted">{verdict.copy}</p>
            <p className="mt-1 font-mono text-xs text-muted-2">deploy risk score: {data.deployRiskScore} / 100</p>
          </div>
        </div>

        {/* incident callout, translated for a non-engineer, verbatim backend note kept below */}
        {data.incidentNote && (
          <div className="mt-4 rounded-xl border border-status-down/30 bg-status-down/10 p-4">
            <p className="text-sm font-medium text-status-down">
              Heads up &mdash; this would normally wake someone up.
            </p>
            <p className="mt-1 text-xs text-status-down/80">
              What that means: a service&rsquo;s failure rate just crossed the threshold that pages an on-call
              engineer. The real backend message: <span className="font-mono">{data.incidentNote}</span>
            </p>
          </div>
        )}

        {/* the interactive moment */}
        <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm text-muted">
            Curious what a bad rollout looks like? Click below to simulate a traffic spike and watch the risk score
            react, live, in the Go function powering this page.
          </p>
          <LoadSpikeButton active={stress} onClick={() => setStress((v) => !v)} />
        </div>

        {/* per-service detail, friendly first line + technical detail demoted underneath */}
        <ul className="mt-6 space-y-2">
          <AnimatePresence initial={false}>
            {data.services.map((svc) => (
              <motion.li
                key={svc.name}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2 rounded-xl border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${STATUS_BADGE[svc.status]}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[svc.status]}`} />
                    {STATUS_LABEL[svc.status]}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-foreground">{svc.name}</div>
                    <div className="font-mono text-[11px] text-muted-2">{svc.region}</div>
                  </div>
                </div>
                <div className="font-mono text-[11px] text-muted-2 sm:text-right">
                  {svc.latencyMs}ms typical &middot; {svc.p99Ms}ms worst-case &middot; {svc.errorRatePct}% errors
                  &middot; {svc.replicas} replicas
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <p className="mt-4 flex items-center gap-1.5 font-mono text-[11px] text-muted-2">
          <Pulse size={12} />
          last updated {new Date(data.generatedAt).toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type ServiceStatus = {
  name: string;
  region: string;
  status: "ok" | "warn" | "down";
  latencyMs: number;
  p99Ms: number;
  errorRatePct: number;
  replicas: number;
};

type FleetResponse = {
  generatedAt: string;
  clusterCount: number;
  deployRiskScore: number;
  riskBand: "low" | "elevated" | "high";
  incidentNote: string | null;
  services: ServiceStatus[];
};

const STATUS_DOT: Record<ServiceStatus["status"], string> = {
  ok: "bg-status-ok",
  warn: "bg-status-warn",
  down: "bg-status-down",
};

const RISK_TEXT: Record<FleetResponse["riskBand"], string> = {
  low: "text-status-ok",
  elevated: "text-status-warn",
  high: "text-status-down",
};

export function ClusterPulseWidget({
  compact = false,
  interactive = false,
}: {
  compact?: boolean;
  interactive?: boolean;
}) {
  const [data, setData] = useState<FleetResponse | null>(null);
  const [error, setError] = useState(false);
  const [stress, setStress] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function poll() {
      try {
        const res = await fetch(`/api/fleet-status${stress ? "?stress=1" : ""}`, { cache: "no-store" });
        if (!res.ok) throw new Error("bad response");
        const json = (await res.json()) as FleetResponse;
        if (!cancelled) {
          setData(json);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }
    poll();
    const id = setInterval(poll, stress ? 2500 : 6000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [stress]);

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
        Cluster Pulse’s API is warming up (or this preview is a static export). Open the full demo to retry.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 animate-pulse space-y-3">
        <div className="h-4 w-1/3 rounded bg-surface-2" />
        <div className="h-3 w-full rounded bg-surface-2" />
        <div className="h-3 w-5/6 rounded bg-surface-2" />
        <div className="h-3 w-2/3 rounded bg-surface-2" />
      </div>
    );
  }

  const services = compact ? data.services.slice(0, 4) : data.services;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 font-mono text-sm">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
        <div className="flex items-center gap-2 text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-ok opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-status-ok" />
          </span>
          live &middot; {data.clusterCount} clusters
        </div>
        <span className={`text-xs font-medium ${RISK_TEXT[data.riskBand]}`}>
          deploy risk: {data.deployRiskScore} ({data.riskBand})
        </span>
      </div>

      {interactive && (
        <button
          type="button"
          onClick={() => setStress((v) => !v)}
          className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            stress
              ? "border-status-down/50 bg-status-down/10 text-status-down"
              : "border-border text-muted hover:border-muted-2 hover:text-foreground"
          }`}
        >
          {stress ? "Stop load-spike simulation" : "Simulate a load spike"}
        </button>
      )}

      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {services.map((svc) => (
            <motion.li
              key={svc.name}
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between gap-3 text-xs sm:text-sm"
            >
              <span className="flex items-center gap-2 text-foreground">
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[svc.status]}`} />
                {svc.name}
              </span>
              <span className="text-muted-2">{svc.region}</span>
              <span className="text-muted tabular-nums">{svc.latencyMs}ms p50</span>
              {!compact && <span className="text-muted-2 tabular-nums hidden sm:inline">{svc.p99Ms}ms p99</span>}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {data.incidentNote && !compact && (
        <p className="mt-3 rounded-lg border border-status-down/30 bg-status-down/10 px-3 py-2 text-xs text-status-down">
          {data.incidentNote}
        </p>
      )}
    </div>
  );
}

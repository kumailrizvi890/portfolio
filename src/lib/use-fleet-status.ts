"use client";

import { useEffect, useState } from "react";

export type ServiceStatus = {
  name: string;
  region: string;
  status: "ok" | "warn" | "down";
  latencyMs: number;
  p99Ms: number;
  errorRatePct: number;
  replicas: number;
};

export type FleetResponse = {
  generatedAt: string;
  clusterCount: number;
  deployRiskScore: number;
  riskBand: "low" | "elevated" | "high";
  incidentNote: string | null;
  services: ServiceStatus[];
};

/**
 * Shared poller for api/fleet-status.go, used by both the small hero teaser
 * widget and the full Cluster Pulse dashboard so there's one fetch/interval
 * implementation instead of two copies drifting apart.
 */
export function useFleetStatus(stress: boolean) {
  const [data, setData] = useState<FleetResponse | null>(null);
  const [error, setError] = useState(false);

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

  return { data, error };
}

import type { Metadata } from "next";
import { DemoShell } from "@/components/demo-shell";
import { ClusterPulseWidget } from "@/components/cluster-pulse-widget";

export const metadata: Metadata = {
  title: "Cluster Pulse",
  description: "A Go microservice simulating fleet health and rollout risk, live.",
};

export default function ClusterPulsePage() {
  return (
    <DemoShell
      slug="cluster-pulse"
      name="Cluster Pulse"
      tagline="Fleet health, latency, and rollout risk for a simulated cluster fleet"
      tech={["Go", "Vercel Functions", "Observability"]}
      repoHref="https://github.com/kumailrizvi890/portfolio/blob/main/api/fleet-status.go"
      howItWorks={
        <>
          <p>
            <code className="text-accent">api/fleet-status.go</code> is a real Go serverless function (Vercel&apos;s
            Go runtime, not a rewrite in Node). It simulates six services across three regions with a smooth,
            time-seeded wave function so numbers drift believably instead of jumping randomly on every refresh.
          </p>
          <p>
            Hit &quot;Simulate a load spike&quot; below and the widget switches to a 2.5s poll and passes{" "}
            <code className="text-accent">?stress=1</code> to the same Go handler, which multiplies the latency and
            error-rate jitter for every service. The risk score and status dots you see are computed from that
            request, in Go, right now.
          </p>
          <p>No real Kubernetes cluster exists behind this. The metrics are simulated; the service, the API contract, and the risk-scoring logic are real.</p>
        </>
      }
    >
      <ClusterPulseWidget interactive />
    </DemoShell>
  );
}

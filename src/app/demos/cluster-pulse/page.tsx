import type { Metadata } from "next";
import { DemoShell } from "@/components/demo-shell";
import { ClusterPulseDashboard } from "@/components/cluster-pulse-dashboard";

export const metadata: Metadata = {
  title: "Cluster Pulse",
  description: "A Go microservice simulating fleet health and rollout risk, live.",
};

export default function ClusterPulsePage() {
  return (
    <DemoShell
      slug="cluster-pulse"
      name="Cluster Pulse"
      tagline="A plain-English deploy-safety check for a simulated cluster fleet"
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
            Click &quot;Simulate a load spike&quot; above and the page switches to a 2.5s poll and passes{" "}
            <code className="text-accent">?stress=1</code> to the same Go handler, which multiplies the latency and
            error-rate jitter for every service. The verdict, the gauge, and the status badges you see are all
            computed from that request, in Go, right now &mdash; nothing is hardcoded on the frontend.
          </p>
          <p>
            No real Kubernetes cluster exists behind this. The metrics are simulated; the service, the API contract,
            and the risk-scoring logic are real.
          </p>
        </>
      }
    >
      <ClusterPulseDashboard />
    </DemoShell>
  );
}

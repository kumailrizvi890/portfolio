import type { Metadata } from "next";
import { DemoShell } from "@/components/demo-shell";
import { WorkflowAutomationDemo } from "@/components/demos/workflow-automation-demo";

export const metadata: Metadata = {
  title: "Ops Automation",
  description: "Live workflow run dashboard backed by Supabase.",
};

export default function WorkflowAutomationPage() {
  return (
    <DemoShell
      slug="workflow-automation"
      name="Ops Automation"
      tagline="A live dashboard over real scheduled-workflow run history in Supabase"
      tech={["TypeScript", "Supabase", "Chart.js"]}
      repoHref="https://github.com/kumailrizvi890/Auto-Intern"
      howItWorks={
        <>
          <p>
            The button below actually inserts a row into a <code className="text-accent">workflow_runs</code>{" "}
            table in Supabase (via <code className="text-accent">api/workflow-status/route.ts</code>) and
            re-fetches, so the chart, stat tiles, and recent-runs list you see update from a real database
            round trip, not local state.
          </p>
          <p>
            If this deployment doesn&apos;t have Supabase credentials configured, the same route falls back to
            generated history so the dashboard still renders, and says so above the chart.
          </p>
        </>
      }
    >
      <WorkflowAutomationDemo />
    </DemoShell>
  );
}

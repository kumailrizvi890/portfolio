import type { Metadata } from "next";
import { DemoShell } from "@/components/demo-shell";
import { QmailDemo } from "@/components/demos/qmail-demo";

export const metadata: Metadata = {
  title: "Qmail",
  description: "Live scam-detection classifier from the Qmail project.",
};

export default function QmailPage() {
  return (
    <DemoShell
      slug="qmail"
      name="Qmail"
      tagline="The scam-detection classifier from the original PWA, live"
      tech={["Python", "Vercel Functions", "Heuristic scoring"]}
      repoHref="https://github.com/kumailrizvi890/qmail"
      howItWorks={
        <>
          <p>
            <code className="text-accent">api/scam-classify.py</code> is a real weighted lexical and structural
            classifier: it checks for urgency language, money-movement requests, credential harvesting, sender
            and domain mismatches, and punctuation abuse, and combines them into a 0 to 100 score.
          </p>
          <p>
            The production Qmail app swaps this for an OpenAI call to classify with more nuance. This demo uses
            a deterministic heuristic instead of a live LLM call, so it works instantly for anyone clicking
            around here, with no API key or per-request cost.
          </p>
        </>
      }
    >
      <QmailDemo />
    </DemoShell>
  );
}

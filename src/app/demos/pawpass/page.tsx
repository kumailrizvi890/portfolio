import type { Metadata } from "next";
import { DemoShell } from "@/components/demo-shell";
import { PawPassDemo } from "@/components/demos/pawpass-demo";

export const metadata: Metadata = {
  title: "PawPass",
  description: "Live retrieval-augmented chatbot over a seeded shelter dataset.",
};

export default function PawPassPage() {
  return (
    <DemoShell
      slug="pawpass"
      name="PawPass"
      tagline="Ask the shelter's RAG chatbot about a real (seeded) pet roster"
      tech={["Python", "Retrieval", "Vercel Functions"]}
      repoHref="https://github.com/kumailrizvi890/PawPass"
      howItWorks={
        <>
          <p>
            <code className="text-accent">api/rag-chat.py</code> runs real retrieval: your question is tokenized,
            scored against every pet record by keyword overlap, and the top matches are used to compose a grounded
            answer that quotes the actual seeded records, including the latest care-log entry.
          </p>
          <p>
            The production PawPass app swaps the fixed six-pet seed set for a real shelter database and the
            keyword scoring for a vector index plus a Gemini call. The retrieve-then-ground shape is identical,
            this version just doesn&apos;t need an API key to demo publicly.
          </p>
        </>
      }
    >
      <PawPassDemo />
    </DemoShell>
  );
}

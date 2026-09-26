import type { Metadata } from "next";
import { DemoShell } from "@/components/demo-shell";
import { Up2DateDemo } from "@/components/demos/up2date-demo";

export const metadata: Metadata = {
  title: "UP2DATE",
  description: "Internship posting window predictor and resume keyword matcher.",
};

export default function Up2DatePage() {
  return (
    <DemoShell
      slug="up2date"
      name="UP2DATE"
      tagline="Predict when a category of internships opens, and score a resume against it"
      tech={["TypeScript", "Domain heuristics"]}
      howItWorks={
        <>
          <p>
            The posting-window prediction is grounded in how each hiring category actually cycles (quant and
            finance post earliest, platform and infra teams post latest after Q4 headcount planning). It&apos;s
            a lookup over real seasonal patterns, presented plainly rather than with invented false precision.
          </p>
          <p>
            The keyword matcher does simple, transparent substring scoring between your pasted text and a fixed
            keyword set per target role, the same idea as the original DubHacks project&apos;s resume optimizer,
            without needing an LLM in the loop for a public demo.
          </p>
        </>
      }
    >
      <Up2DateDemo />
    </DemoShell>
  );
}

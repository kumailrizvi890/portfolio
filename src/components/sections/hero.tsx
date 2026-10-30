"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, HandGrabbing } from "@phosphor-icons/react/dist/ssr";
import { ClusterPulseWidget } from "@/components/cluster-pulse-widget";
import { heroCopy } from "@/lib/data";

// WebGL touches APIs the server cannot render, and the headline carries the
// actual hiring signal, so the scene loads client-only after the text is up.
const ProjectSphere = dynamic(
  () => import("@/components/project-sphere").then((m) => m.ProjectSphere),
  { ssr: false },
);

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden border-b border-border">
      {/* The sphere sits behind everything and is the only thing in this
          layer. It is interactive, so it must not be pointer-events-none. */}
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <ProjectSphere reduced={!!reduce} />
        </Suspense>
      </div>

      {/*
        Contrast scrim.

        The old version defended white text over busy screenshots with a
        text-shadow, which is not a scrim and failed outright where a light
        screenshot sat under the headline. This is a real gradient: opaque
        behind the copy column, clearing to nothing on the right so the sphere
        still reads. On mobile the column is full width, so it darkens from the
        bottom instead of the left.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/20 md:bg-gradient-to-r md:from-background md:via-background/80 md:to-transparent"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 items-center px-4 pt-24 pb-16 sm:px-6 md:pt-28 md:pb-24">
        <div className="grid w-full gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
              {heroCopy.eyebrow}
            </p>

            {/*
              Headline sizing is capped with a clamp rather than a jump between
              breakpoints. At 375px the old value overflowed the viewport and
              clipped the last character; this never exceeds the column.
            */}
            <h1 className="mt-4 text-[clamp(2rem,7vw,3.75rem)] font-semibold leading-[1.04] tracking-tighter text-foreground">
              I build systems, then I make you{" "}
              <em className="italic">watch</em> them run.
            </h1>

            <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-muted sm:text-lg">
              {heroCopy.subtext}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-transform hover:brightness-110 active:scale-[0.98]"
              >
                See it run
                <ArrowUpRight size={16} weight="bold" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-muted-2 active:scale-[0.98]"
              >
                Get in touch
              </a>
            </div>

            {/*
              Drag affordance. Not a scroll cue: nobody needs to be told a page
              scrolls, but a draggable WebGL object is genuinely non-obvious,
              and without this most visitors never discover the sphere is
              interactive at all. Hidden when the pointer is coarse, where
              drag is the assumed gesture anyway.
            */}
            {!reduce && (
              <p className="mt-8 hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-2 [@media(hover:hover)]:flex">
                <HandGrabbing size={13} weight="bold" aria-hidden="true" />
                Drag the sphere, or click a screen to open it
              </p>
            )}
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:max-w-sm md:justify-self-end"
          >
            <div className="rounded-2xl border border-border/70 bg-surface/60 p-1 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md">
              <p className="px-4 pt-3 pb-1 font-mono text-xs text-muted-2">
                live from <span className="text-muted">/demos/cluster-pulse</span>
              </p>
              <div className="p-1">
                <ClusterPulseWidget compact />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

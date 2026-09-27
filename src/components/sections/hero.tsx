"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ClusterPulseWidget } from "@/components/cluster-pulse-widget";
import { heroCopy } from "@/lib/data";

// The 3D scene touches WebGL/canvas APIs the server can't render and isn't
// needed for first paint or SEO, so it's loaded client-only, after the text
// (which carries the actual hiring signal) is already on screen.
const HeroScene = dynamic(() => import("@/components/hero-scene").then((m) => m.HeroScene), {
  ssr: false,
});

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* full-bleed 3D backdrop, weighted right - anti-center-bias split */}
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <Suspense fallback={null}>
          <HeroScene reduced={!!reduce} />
        </Suspense>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent md:via-background/40" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pt-16 pb-20 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pt-24 md:pb-32">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
            {heroCopy.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl lg:text-[3.75rem] leading-[1.05]">
            I build systems, then I make you <em className="italic">watch</em> them run.
          </h1>
          <p className="mt-5 max-w-[42ch] text-base text-muted leading-relaxed sm:text-lg">
            {heroCopy.subtext}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
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
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="md:justify-self-end md:max-w-sm w-full"
        >
          <div className="rounded-2xl border border-border/70 bg-surface/60 p-1 backdrop-blur-md shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]">
            <p className="px-4 pt-3 pb-1 text-xs text-muted-2 font-mono">
              live from <span className="text-muted">/demos/cluster-pulse</span>
            </p>
            <div className="p-1">
              <ClusterPulseWidget compact />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

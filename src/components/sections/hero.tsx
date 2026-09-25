"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ClusterPulseWidget } from "@/components/cluster-pulse-widget";
import { heroCopy } from "@/lib/data";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-16 pb-20 sm:px-6 md:grid-cols-2 md:items-center md:pt-20 md:pb-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
            {heroCopy.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.05]">
            {heroCopy.headline}
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
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-2 text-xs text-muted-2 font-mono">
            live from <span className="text-muted">/demos/cluster-pulse</span>
          </p>
          <ClusterPulseWidget compact />
        </motion.div>
      </div>
    </section>
  );
}

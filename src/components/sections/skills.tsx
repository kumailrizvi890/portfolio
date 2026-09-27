"use client";

import { motion, useReducedMotion } from "motion/react";
import { skills } from "@/lib/data";

export function Skills() {
  const reduce = useReducedMotion();

  return (
    <section id="skills" className="border-b border-border py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          What I actually reach for
        </motion.h2>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((group, i) => (
            <motion.div
              key={group.category}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-background p-6 transition-colors hover:bg-surface"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(120px_circle_at_20%_0%,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_70%)]" />
              <h3 className="relative font-mono text-xs uppercase tracking-wider text-muted-2">
                {group.category}
              </h3>
              <ul className="relative mt-4 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-border px-2.5 py-1 text-xs text-muted transition-colors group-hover:border-muted-2"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

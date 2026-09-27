"use client";

import { motion, useReducedMotion } from "motion/react";
import { projects } from "@/lib/data";
import { ProjectCard } from "@/components/project-card";

export function WorkGrid() {
  const reduce = useReducedMotion();

  return (
    <section id="work" className="border-b border-border py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Every project below is running right now
        </motion.h2>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 max-w-[60ch] text-sm text-muted sm:text-base"
        >
          Click through. Send a scam email to Qmail&rsquo;s classifier, ask PawPass about a shelter dog, or
          watch Cluster Pulse score a rollout in real time.
        </motion.p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4 md:grid-flow-row-dense md:auto-rows-[minmax(13rem,auto)]">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

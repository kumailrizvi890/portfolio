"use client";

import { motion, useReducedMotion } from "motion/react";
import { awards, coursework, leadership, profile, workExperience } from "@/lib/data";

function TimelineGroup({
  title,
  items,
  delay = 0,
}: {
  title: string;
  items: { org: string; role: string; period: string; detail: string }[];
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3 className="font-mono text-xs uppercase tracking-wider text-muted-2">{title}</h3>
      <div className="relative mt-4 space-y-6 border-l border-border pl-5">
        {items.map((item) => (
          <div key={item.org + item.role} className="relative">
            <span className="absolute -left-[1.4rem] top-1.5 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_0_rgba(245,165,36,0.6)]" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <p className="font-medium text-foreground">{item.role}</p>
              <p className="font-mono text-xs text-muted-2">{item.period}</p>
            </div>
            <p className="text-sm text-accent">{item.org}</p>
            <p className="mt-1.5 text-sm text-muted leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function Experience() {
  const reduce = useReducedMotion();

  return (
    <section id="experience" className="border-b border-border py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Education, work, and what I do outside of code
        </motion.h2>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-12">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted-2">Education</h3>
              <div className="mt-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="font-medium text-foreground">{profile.degree}</p>
                  <p className="font-mono text-xs text-muted-2">GPA {profile.gpa}</p>
                </div>
                <p className="text-sm text-accent">
                  {profile.school}, expected {profile.graduation}
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {coursework.map((c) => (
                    <li key={c} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <TimelineGroup title="Work experience" items={workExperience} delay={0.08} />
          </div>

          <div className="space-y-12">
            <TimelineGroup title="Leadership" items={leadership} />

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted-2">Awards</h3>
              <ul className="mt-4 space-y-2">
                {awards.map((a) => (
                  <li key={a} className="text-sm text-muted leading-relaxed border-l-2 border-accent/40 pl-3">
                    {a}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

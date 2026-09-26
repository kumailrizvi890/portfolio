"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, GithubLogo, Trophy } from "@phosphor-icons/react/dist/ssr";
import type { Project } from "@/lib/data";

const SIZE_CLASSES: Record<Project["size"], string> = {
  lg: "md:col-span-2 md:row-span-2",
  md: "md:col-span-1 md:row-span-1",
  sm: "md:col-span-1 md:row-span-1",
};

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-muted-2 ${SIZE_CLASSES[project.size]}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
          {project.accentStatus && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-status-ok" aria-label="live status: healthy" />
          )}
        </div>
        <p className="mt-1 text-sm text-muted">{project.tagline}</p>

        {project.size === "lg" && (
          <p className="mt-4 max-w-[52ch] text-sm text-muted leading-relaxed">{project.description}</p>
        )}

        {project.award && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-accent">
            <Trophy size={14} weight="fill" />
            {project.award}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, project.size === "lg" ? 4 : 3).map((t) => (
            <span
              key={t}
              className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-2 font-mono"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4 text-sm">
        {project.demoHref && (
          <Link
            href={project.demoHref}
            className="inline-flex items-center gap-1 font-medium text-foreground hover:text-accent transition-colors"
          >
            Live demo
            <ArrowUpRight size={14} weight="bold" />
          </Link>
        )}
        {project.repoHref && (
          <a
            href={project.repoHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-muted hover:text-foreground transition-colors"
          >
            <GithubLogo size={14} />
            Code
          </a>
        )}
      </div>
    </motion.div>
  );
}

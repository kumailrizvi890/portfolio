"use client";

import Link from "next/link";
import { motion, useReducedMotion, useMotionValue, useTransform, useSpring } from "motion/react";
import { ArrowUpRight, GithubLogo, Trophy } from "@phosphor-icons/react/dist/ssr";
import type { Project } from "@/lib/data";

const SIZE_CLASSES: Record<Project["size"], string> = {
  lg: "md:col-span-2 md:row-span-2",
  md: "md:col-span-1 md:row-span-1",
  sm: "md:col-span-1 md:row-span-1",
};

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotion();

  // Pointer-driven 3D tilt. Continuous pointer values live in motion values,
  // never React state - state would re-render the tree on every pixel of
  // mouse movement and stutter on lower-end devices.
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const springX = useSpring(mx, { stiffness: 200, damping: 20 });
  const springY = useSpring(my, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(springY, [0, 1], [7, -7]);
  const rotateY = useTransform(springX, [0, 1], [-7, 7]);
  const glowX = useTransform(springX, (v) => `${v * 100}%`);
  const glowY = useTransform(springY, (v) => `${v * 100}%`);
  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(280px circle at ${x} ${y}, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%)`,
  );

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function handlePointerLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 800 }}
      className={SIZE_CLASSES[project.size]}
    >
      <motion.div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY, transformStyle: "preserve-3d" }}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-muted-2"
      >
        {!reduce && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: glowBackground }}
          />
        )}

        <div className="relative" style={{ transform: "translateZ(24px)" }}>
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

        <div className="relative mt-6 flex items-center gap-4 text-sm" style={{ transform: "translateZ(24px)" }}>
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
    </motion.div>
  );
}

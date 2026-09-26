import Link from "next/link";
import { ArrowLeft, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { DemoRunCounter } from "@/components/demo-run-counter";
import type { ReactNode } from "react";

export function DemoShell({
  slug,
  name,
  tagline,
  tech,
  repoHref,
  howItWorks,
  children,
}: {
  slug: string;
  name: string;
  tagline: string;
  tech: string[];
  repoHref?: string;
  howItWorks: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/#work" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors">
        <ArrowLeft size={14} />
        Back to work
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{name}</h1>
          <p className="mt-2 text-muted">{tagline}</p>
        </div>
        {repoHref && (
          <a
            href={repoHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-muted hover:border-muted-2 hover:text-foreground transition-colors"
          >
            <GithubLogo size={16} />
            View code
          </a>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tech.map((t) => (
          <span key={t} className="rounded-full border border-border px-2.5 py-1 text-[11px] font-mono text-muted-2">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-3">
        <DemoRunCounter slug={slug} />
      </div>

      <div className="mt-8">{children}</div>

      <div className="mt-12 rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted-2">How this demo actually works</h2>
        <div className="mt-3 text-sm text-muted leading-relaxed space-y-2">{howItWorks}</div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react/dist/ssr";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#skills", label: "Skills" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm font-medium tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground text-xs font-bold">
            KR
          </span>
          <span className="hidden sm:inline text-muted">kumail rizvi</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/resume-kumail-rizvi.pdf"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-transform active:scale-[0.98] hover:brightness-110"
          >
            Resume
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <List size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-background px-4 pb-4 pt-2 flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-2 py-2.5 text-sm text-muted hover:bg-surface hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/resume-kumail-rizvi.pdf"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground"
          >
            Resume
          </a>
        </nav>
      )}
    </header>
  );
}

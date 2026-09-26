"use client";

import { useEffect, useState } from "react";

export function DemoRunCounter({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/track?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setCount(json.count ?? 0);
      })
      .catch(() => {
        if (!cancelled) setCount(null);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (count === null) return null;

  return (
    <p className="font-mono text-xs text-muted-2">
      {count === 0 ? "Be the first to run this demo" : `Run ${count} time${count === 1 ? "" : "s"} so far, straight from Supabase`}
    </p>
  );
}

export async function trackRun(slug: string) {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, event: "run" }),
    });
  } catch {
    // best-effort
  }
}

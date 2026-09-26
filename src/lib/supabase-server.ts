import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client. Deliberately uses the anon key, not the
// service role secret: every table it touches ships its own narrow RLS
// policy (see supabase/migrations), so there's no reason to hold a
// bypass-everything credential for a public portfolio demo. This file is
// never imported into a "use client" component. Returns null when env vars
// aren't configured yet so demos degrade gracefully instead of throwing
// during build or preview.
let cached: SupabaseClient | null | undefined;

export function getSupabaseServer(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    cached = null;
    return cached;
  }

  cached = createClient(url, key, {
    auth: { persistSession: false },
  });
  return cached;
}

/**
 * Fire-and-forget event counter for the "N times this demo has been run"
 * indicator on each demo page. Never throws: a missing/misconfigured
 * Supabase project should never break a demo, it just means the counter
 * stays at zero.
 */
export async function trackDemoEvent(slug: string, eventType: string = "run") {
  const client = getSupabaseServer();
  if (!client) return;
  try {
    await client.from("demo_events").insert({ demo_slug: slug, event_type: eventType });
  } catch {
    // best-effort only
  }
}

export async function getDemoEventCount(slug: string): Promise<number> {
  const client = getSupabaseServer();
  if (!client) return 0;
  try {
    const { count } = await client
      .from("demo_events")
      .select("id", { count: "exact", head: true })
      .eq("demo_slug", slug);
    return count ?? 0;
  } catch {
    return 0;
  }
}

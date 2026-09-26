import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? "").trim().slice(0, 200);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 4000);

  if (!name || !EMAIL_RE.test(email) || message.length < 5) {
    return NextResponse.json(
      { error: "Please provide a name, a valid email, and a short message." },
      { status: 400 },
    );
  }

  const client = getSupabaseServer();
  if (!client) {
    return NextResponse.json(
      { error: "The contact form isn't wired up in this environment yet." },
      { status: 503 },
    );
  }

  const { error } = await client.from("contact_submissions").insert({ name, email, message });
  if (error) {
    return NextResponse.json({ error: "Could not save your message. Please try emailing directly." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

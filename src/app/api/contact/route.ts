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

  // Push notification - awaited (not fire-and-forget). A visitor's message is already saved
  // above, so a Telegram failure here never fails their request; it's caught and logged
  // below instead. But it IS awaited, because a serverless function's runtime can be frozen
  // the instant its response is sent, and an un-awaited promise racing that teardown can get
  // silently killed mid-flight before its fetch to Telegram ever completes. Awaiting it (with
  // its own retry/backoff for ordinary transient blips) makes delivery reliable instead of
  // "usually works."
  try {
    await notifyTelegram({ name, email, message });
  } catch (err) {
    console.error("Telegram notify failed after retries:", err);
  }

  return NextResponse.json({ ok: true });
}

async function notifyTelegram({ name, email, message }: { name: string; email: string; message: string }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text =
    `New portfolio contact\n\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n\n` +
    `${message}`;

  const MAX_ATTEMPTS = 3;
  let lastErr: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      });

      if (res.ok) {
        console.log(`Telegram notify sent on attempt ${attempt}`);
        return;
      }

      lastErr = new Error(`Telegram API responded ${res.status}: ${await res.text().catch(() => "")}`);
    } catch (err) {
      lastErr = err;
    }

    if (attempt < MAX_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
    }
  }

  throw lastErr;
}

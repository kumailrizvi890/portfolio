import { NextRequest, NextResponse } from "next/server";
import { getDemoEventCount, trackDemoEvent } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }
  const count = await getDemoEventCount(slug);
  return NextResponse.json({ slug, count });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const slug = typeof body.slug === "string" ? body.slug : null;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }
  await trackDemoEvent(slug, typeof body.event === "string" ? body.event : "run");
  const count = await getDemoEventCount(slug);
  return NextResponse.json({ slug, count });
}

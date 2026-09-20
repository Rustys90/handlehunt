import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type SessionBody = {
  sessionId?: string;
  length?: number;
  index?: number;
  found?: Array<{ handle: string; confidence: number; method?: string }>;
  delayMs?: number;
  status?: "running" | "paused" | "complete";
};

export async function POST(request: NextRequest) {
  let body: SessionBody = {};
  try {
    body = (await request.json()) as SessionBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const sessionId = String(body.sessionId || "").slice(0, 64);
  if (!sessionId) {
    return NextResponse.json({ ok: false, error: "sessionId required" }, { status: 400 });
  }

  const length = body.length === 4 ? 4 : 3;
  const index = Math.max(0, Number(body.index) || 0);
  const found = Array.isArray(body.found)
    ? body.found
        .filter((f) => f && typeof f.handle === "string")
        .map((f) => ({
          handle: String(f.handle).slice(0, 30),
          confidence: Number(f.confidence) || 0,
          method: f.method ? String(f.method).slice(0, 40) : undefined,
        }))
        .slice(0, 200)
    : [];

  const payload = {
    session_id: sessionId,
    length,
    index,
    found,
    delay_ms: Math.max(300, Math.min(10_000, Number(body.delayMs) || 550)),
    status: body.status || "running",
    updated_at: new Date().toISOString(),
  };

  console.info("[hh-scan-session]", JSON.stringify({ ...payload, found: found.length }));

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/scan_sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.warn("[hh-scan-session] supabase forward failed", e);
    }
  }

  return NextResponse.json({ ok: true, sessionId, index, foundCount: found.length });
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId")?.slice(0, 64);
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const r = await fetch(
        `${supabaseUrl.replace(/\/$/, "")}/rest/v1/scan_sessions?session_id=eq.${encodeURIComponent(sessionId)}&select=*&limit=1`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );
      if (r.ok) {
        const rows = await r.json();
        if (Array.isArray(rows) && rows[0]) {
          return NextResponse.json({ ok: true, session: rows[0] });
        }
      }
    } catch {
      /* fall through */
    }
  }

  return NextResponse.json({
    ok: true,
    session: null,
    note: "No server checkpoint — client localStorage is source of truth until Supabase tables are applied.",
  });
}

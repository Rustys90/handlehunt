import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type LogBody = {
  username?: string;
  status?: string;
  confidence?: number;
  method?: string;
  signals?: string[];
  sessionId?: string;
  source?: string;
};

export async function POST(request: NextRequest) {
  let body: LogBody = {};
  try {
    body = (await request.json()) as LogBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const username = String(body.username || "").toLowerCase().trim().slice(0, 30);
  if (!username || !/^[a-z0-9._]{1,30}$/.test(username)) {
    return NextResponse.json({ ok: false, error: "username required" }, { status: 400 });
  }

  const entry = {
    username,
    status: String(body.status || "unknown").slice(0, 40),
    confidence: Number(body.confidence) || 0,
    method: body.method ? String(body.method).slice(0, 40) : undefined,
    signals: Array.isArray(body.signals)
      ? body.signals.map((s) => String(s).slice(0, 64)).slice(0, 12)
      : [],
    sessionId: body.sessionId ? String(body.sessionId).slice(0, 64) : undefined,
    source: body.source ? String(body.source).slice(0, 32) : "client",
    at: new Date().toISOString(),
  };

  console.info("[hh-signal]", JSON.stringify(entry));

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/check_signals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(entry),
      });
    } catch (e) {
      console.warn("[hh-signal] supabase forward failed", e);
    }
  }

  return NextResponse.json({ ok: true });
}

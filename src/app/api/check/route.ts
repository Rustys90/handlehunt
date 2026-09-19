import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")?.toLowerCase().trim();
  if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 });
  if (!/^[a-z0-9._]{1,30}$/.test(username)) {
    return NextResponse.json({ status: "invalid", confidence: 100, message: "Invalid format." });
  }
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 8000);
    const res = await fetch(`https://www.instagram.com/${username}/`, {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html" },
      signal: c.signal, redirect: "follow",
    });
    clearTimeout(t);
    const lower = (await res.text()).toLowerCase();
    if (res.status === 404 || lower.includes("sorry, this page isn't available"))
      return NextResponse.json({ status: "available", confidence: 55, message: "No public profile found. Estimate only." });
    if (res.status === 200 && (lower.includes("og:title") || lower.includes("profilepage")))
      return NextResponse.json({ status: "taken", confidence: 80, message: "A public profile appears to exist." });
    return NextResponse.json({ status: "unknown", confidence: 30, message: "Could not determine." });
  } catch {
    return NextResponse.json({ status: "unknown", confidence: 10, message: "Request failed." });
  }
}

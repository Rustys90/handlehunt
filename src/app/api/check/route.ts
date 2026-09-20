import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

type Status = "available" | "taken" | "unknown" | "invalid" | "reserved";

function scoreFromHtml(status: number, html: string, username: string): {
  status: Status;
  confidence: number;
  message: string;
  signals: string[];
} {
  const lower = html.toLowerCase();
  const signals: string[] = [];
  let takenScore = 0;
  let freeScore = 0;

  if (status === 404) {
    freeScore += 40;
    signals.push("http_404");
  }
  if (
    lower.includes("sorry, this page isn't available") ||
    lower.includes("sorry, this page isn&#39;t available") ||
    lower.includes("the link you followed may be broken")
  ) {
    freeScore += 45;
    signals.push("page_not_available");
  }
  if (lower.includes("user not found")) {
    freeScore += 20;
    signals.push("user_not_found_text");
  }

  if (status === 200) signals.push("http_200");

  if (lower.includes(`"username":"${username}"`) || lower.includes(`"username": "${username}"`)) {
    takenScore += 50;
    signals.push("json_username");
  }
  if (lower.includes("profilepage") || lower.includes("\"profile_id\"")) {
    takenScore += 35;
    signals.push("profile_page_marker");
  }
  if (lower.includes("og:title") && lower.includes(username)) {
    takenScore += 25;
    signals.push("og_title_username");
  }
  if (
    lower.includes('property="og:type" content="profile"') ||
    lower.includes('content="profile" property="og:type"')
  ) {
    takenScore += 30;
    signals.push("og_type_profile");
  }
  if (lower.includes("og:description")) {
    takenScore += 8;
    signals.push("og_description");
  }
  if (lower.includes("\"is_private\"") || lower.includes("\"edge_followed_by\"")) {
    takenScore += 40;
    signals.push("shared_data_graph");
  }

  if (takenScore >= 50 && takenScore > freeScore + 15) {
    return {
      status: "taken",
      confidence: Math.min(92, 55 + Math.floor(takenScore / 2)),
      message: "Public profile signals strongly suggest this handle is taken.",
      signals,
    };
  }
  if (freeScore >= 40 && freeScore > takenScore + 10) {
    return {
      status: "available",
      confidence: Math.min(75, 40 + Math.floor(freeScore / 2)),
      message:
        "No public profile found. Estimate only \u2014 not a registration guarantee. Verify on Instagram before acting.",
      signals,
    };
  }
  if (takenScore >= 25) {
    return {
      status: "taken",
      confidence: Math.min(72, 40 + Math.floor(takenScore / 2)),
      message: "Profile-like signals detected. Treat as likely taken.",
      signals,
    };
  }
  if (freeScore >= 25) {
    return {
      status: "available",
      confidence: Math.min(58, 28 + Math.floor(freeScore / 2)),
      message: "Weak empty-profile signals. Low-confidence estimate only.",
      signals,
    };
  }
  return {
    status: "unknown",
    confidence: 25,
    message:
      "Could not determine from public HTML. Instagram may be rate-limiting or challenging the request.",
    signals,
  };
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")?.toLowerCase().trim();
  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }
  if (!/^[a-z0-9._]{1,30}$/.test(username)) {
    return NextResponse.json({
      status: "invalid",
      confidence: 100,
      message: "Invalid Instagram username format.",
      signals: ["format"],
    });
  }
  if (username.startsWith(".") || username.endsWith(".") || username.includes("..")) {
    return NextResponse.json({
      status: "invalid",
      confidence: 100,
      message: "Username violates Instagram format rules.",
      signals: ["format_dots"],
    });
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9000);
    const res = await fetch(`https://www.instagram.com/${encodeURIComponent(username)}/`, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timer);
    const html = await res.text();
    return NextResponse.json(scoreFromHtml(res.status, html, username));
  } catch (e) {
    const aborted = e instanceof Error && e.name === "AbortError";
    return NextResponse.json({
      status: "unknown",
      confidence: 10,
      message: aborted ? "Request timed out." : "Request failed (network or block).",
      signals: [aborted ? "timeout" : "network_error"],
    });
  }
}

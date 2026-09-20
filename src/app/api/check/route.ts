import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const UA = "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 Instagram 312.0.0.0.0 Android";
const DESKTOP_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

type CheckResult = {
  status: "possibly_available" | "taken" | "held" | "invalid" | "unknown" | "rate_limited";
  confidence: number;
  message: string;
  method?: string;
  signals?: string[];
};

async function getCsrf(signal: AbortSignal): Promise<string | null> {
  try {
    const r = await fetch("https://www.instagram.com/api/v1/public/landing_info/", {
      headers: { "User-Agent": UA, Accept: "*/*" },
      signal,
    });
    const sc = r.headers.get("set-cookie") || "";
    const m = sc.match(/csrftoken=([^;]+)/i);
    if (m?.[1]) return m[1];
    const r2 = await fetch("https://www.instagram.com/", {
      headers: { "User-Agent": DESKTOP_UA, Accept: "text/html" },
      signal,
    });
    const sc2 = r2.headers.get("set-cookie") || "";
    const m2 = sc2.match(/csrftoken=([^;]+)/i);
    return m2?.[1] ?? null;
  } catch {
    return null;
  }
}

async function checkRegistration(username: string, signal: AbortSignal): Promise<CheckResult | null> {
  const token = await getCsrf(signal);
  if (!token) return null;
  const endpoints = [
    "https://www.instagram.com/api/v1/web/accounts/web_create_ajax/attempt/",
    "https://www.instagram.com/accounts/web_create_ajax/attempt/",
  ];
  for (const endpoint of endpoints) {
    try {
      const body = new URLSearchParams({
        username,
        email: "",
        first_name: "",
        opt_into_one_tap: "false",
      });
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "User-Agent": UA,
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRFToken": token,
          "X-Requested-With": "XMLHttpRequest",
          "X-IG-App-ID": "936619743392459",
          Origin: "https://www.instagram.com",
          Referer: "https://www.instagram.com/accounts/emailsignup/",
          Cookie: `csrftoken=${token}`,
          Accept: "*/*",
        },
        body: body.toString(),
        signal,
      });
      if (res.status === 429 || res.status === 403) {
        return {
          status: "rate_limited",
          confidence: 40,
          message: "Instagram rate-limited this check. Try again later or slow the scan.",
          method: "registration",
          signals: [`http_${res.status}`],
        };
      }
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("json") && !ct.includes("javascript")) continue;
      let json: any;
      try {
        json = await res.json();
      } catch {
        continue;
      }
      if (json?.status === "fail") {
        return {
          status: "rate_limited",
          confidence: 50,
          message: json.message || "Registration endpoint refused the request.",
          method: "registration",
          signals: ["status_fail"],
        };
      }
      const errors = json?.errors || {};
      const usernameErrors: any[] = errors.username || [];
      if (usernameErrors.length > 0) {
        const joined = usernameErrors
          .map((e: any) => String(e.message || e.code || "").toLowerCase())
          .join(" ");
        if (joined.includes("held") || joined.includes("14 day")) {
          return {
            status: "held",
            confidence: 85,
            message: "Username appears held / in 14-day cooldown.",
            method: "registration",
            signals: ["held"],
          };
        }
        if (joined.includes("taken") || joined.includes("isn't available") || joined.includes("already exists")) {
          return {
            status: "taken",
            confidence: 92,
            message: usernameErrors[0]?.message || "Username is taken.",
            method: "registration",
            signals: ["taken"],
          };
        }
        return {
          status: "taken",
          confidence: 70,
          message: usernameErrors[0]?.message || "Username error from registration.",
          method: "registration",
          signals: ["username_error"],
        };
      }
      if (json?.status === "ok" || json?.account_created === false) {
        return {
          status: "possibly_available",
          confidence: 78,
          message:
            "Registration endpoint returned no username errors. Confirm on Instagram.",
          method: "registration",
          signals: ["no_username_errors"],
        };
      }
    } catch {
      /* next endpoint */
    }
  }
  return null;
}

async function checkProfile(username: string, signal: AbortSignal): Promise<CheckResult> {
  try {
    const res = await fetch(`https://www.instagram.com/${encodeURIComponent(username)}/`, {
      headers: {
        "User-Agent": DESKTOP_UA,
        Accept: "text/html",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal,
      redirect: "follow",
    });
    const text = await res.text();
    const lower = text.toLowerCase();
    const signals = [`http_${res.status}`];
    if (
      res.status === 200 &&
      (lower.includes("profilepage") ||
        lower.includes("og:title") ||
        lower.includes('"username":"' + username))
    ) {
      signals.push("profile_markers");
      return {
        status: "taken",
        confidence: 82,
        message: "Public profile signals detected.",
        method: "profile",
        signals,
      };
    }
    if (
      res.status === 404 ||
      lower.includes("sorry, this page isn't available") ||
      lower.includes("page isn't available")
    ) {
      signals.push("no_public_profile");
      return {
        status: "possibly_available",
        confidence: 58,
        message: "No publicly accessible profile observed. Confirm on Instagram.",
        method: "profile",
        signals,
      };
    }
    return {
      status: "unknown",
      confidence: 25,
      message: "Could not determine status from profile page.",
      method: "profile",
      signals,
    };
  } catch {
    return {
      status: "unknown",
      confidence: 10,
      message: "Profile check failed.",
      method: "profile",
    };
  }
}

function merge(reg: CheckResult | null, profile: CheckResult): CheckResult {
  if (reg) {
    if (reg.status === "rate_limited") {
      if (profile.status === "possibly_available" || profile.status === "taken") {
        return { ...profile, confidence: Math.min(profile.confidence, 55), message: profile.message + " (registration rate-limited)" };
      }
      return reg;
    }
    if (reg.status === "possibly_available" && profile.status === "taken") {
      return { ...profile, confidence: Math.max(profile.confidence, 85), method: "both", signals: [...(reg.signals || []), ...(profile.signals || [])] };
    }
    if (reg.status === "possibly_available" && profile.status === "possibly_available") {
      return { ...reg, confidence: Math.min(95, reg.confidence + 10), method: "both", signals: [...(reg.signals || []), ...(profile.signals || [])] };
    }
    return reg;
  }
  if (profile.status === "possibly_available") {
    return { ...profile, confidence: Math.min(profile.confidence, 60) };
  }
  return profile;
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")?.toLowerCase().trim();
  if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 });
  if (!/^[a-z0-9._]{1,30}$/.test(username)) {
    return NextResponse.json({
      status: "invalid",
      confidence: 100,
      message: "Invalid Instagram username format.",
      method: "validation",
    } satisfies CheckResult);
  }
  if (username.startsWith(".") || username.endsWith(".") || username.includes("..") || username.startsWith("_") || username.endsWith("_")) {
    return NextResponse.json({
      status: "invalid",
      confidence: 95,
      message: "Username cannot start/end with period or underscore, or contain consecutive periods.",
      method: "validation",
    } satisfies CheckResult);
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const [reg, profile] = await Promise.all([
      checkRegistration(username, controller.signal),
      checkProfile(username, controller.signal),
    ]);
    const result = merge(reg, profile);
    const headers: Record<string, string> = { "Cache-Control": "no-store" };
    if (result.status === "rate_limited") headers["Retry-After"] = "45";
    return NextResponse.json(
      { ...result, username, checkedAt: new Date().toISOString(), proxyConfigured: Boolean(process.env.HH_PROXY_URL) },
      { headers }
    );
  } catch {
    return NextResponse.json({
      status: "unknown",
      confidence: 5,
      message: "Check failed (timeout or network error).",
      method: "error",
      username,
    } satisfies CheckResult & { username: string });
  } finally {
    clearTimeout(timeout);
  }
}

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * HandleHunt availability checker v2
 * Informed by:
 * - iojw/socialscan (registration endpoint + CSRF)
 * - FadeHack/instagram-username-finder (possibly_available language, conservative scoring)
 * - community web_create_ajax/attempt patterns (error codes)
 *
 * Never claims registration guarantee. No auto-claim logic.
 */

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const IG_APP_ID = "936619743392459";

const TAKEN_MSGS = [
  "this username isn\'t available",
  "a user with that username already exists",
  "username is taken",
  "username_is_taken",
];

type Status =
  | "available"
  | "possibly_available"
  | "taken"
  | "invalid"
  | "rate_limited"
  | "unknown";

type CheckResult = {
  status: Status;
  confidence: number;
  message: string;
  signals: string[];
  method?: string;
  igMessage?: string;
};

function isTakenMessage(msg: string): boolean {
  const m = msg.toLowerCase();
  return TAKEN_MSGS.some((t) => m.includes(t));
}

async function getCsrfAndCookies(): Promise<{ csrf: string; cookieHeader: string } | null> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 8000);
  try {
    // Warm-up: landing or signup page for csrftoken (socialscan + common practice)
    const res = await fetch("https://www.instagram.com/accounts/emailsignup/", {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(t);
    const setCookie = res.headers.getSetCookie?.() ?? [];
    const cookieParts: string[] = [];
    let csrf = "";
    for (const c of setCookie) {
      const [pair] = c.split(";");
      if (!pair) continue;
      cookieParts.push(pair.trim());
      if (pair.startsWith("csrftoken=")) csrf = pair.slice("csrftoken=".length);
    }
    // Fallback parse from body if needed
    if (!csrf) {
      const text = await res.text();
      const m = text.match(/"csrf_token":"([^"]+)"/) || text.match(/csrftoken=([^;\s"]+)/);
      if (m) csrf = m[1];
    }
    if (!csrf) return null;
    const cookieHeader =
      cookieParts.length > 0 ? cookieParts.join("; ") : `csrftoken=${csrf}`;
    return { csrf, cookieHeader };
  } catch {
    clearTimeout(t);
    return null;
  }
}

async function checkViaRegistration(username: string): Promise<CheckResult | null> {
  const auth = await getCsrfAndCookies();
  if (!auth) {
    return null;
  }

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 9000);
  try {
    // socialscan-style + modern /api/v1 path variants
    const endpoints = [
      "https://www.instagram.com/api/v1/web/accounts/web_create_ajax/attempt/",
      "https://www.instagram.com/accounts/web_create_ajax/attempt/",
    ];

    let lastFail: CheckResult | null = null;

    for (const endpoint of endpoints) {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "User-Agent": UA,
          Accept: "*/*",
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRFToken": auth.csrf,
          "X-Requested-With": "XMLHttpRequest",
          "X-IG-App-ID": IG_APP_ID,
          "X-Instagram-AJAX": "1",
          Referer: "https://www.instagram.com/accounts/emailsignup/",
          Origin: "https://www.instagram.com",
          Cookie: auth.cookieHeader,
        },
        body: new URLSearchParams({
          username,
          email: "",
          first_name: "",
          opt_into_one_tap: "false",
        }).toString(),
        signal: controller.signal,
        redirect: "follow",
      });

      if (res.status === 429 || res.status === 403) {
        lastFail = {
          status: "rate_limited",
          confidence: 20,
          message: "Instagram rate-limited the registration probe. Try again later.",
          signals: [`http_${res.status}`, "registration_probe"],
          method: "registration",
        };
        continue;
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        lastFail = {
          status: "unknown",
          confidence: 15,
          message: "Non-JSON response from registration probe (often a block page).",
          signals: ["non_json", "registration_probe"],
          method: "registration",
        };
        continue;
      }

      const json = (await res.json()) as {
        status?: string;
        message?: string;
        errors?: { username?: Array<{ message?: string; code?: string }> };
        username_suggestions?: string[];
      };

      if (json.status === "fail") {
        lastFail = {
          status: "rate_limited",
          confidence: 25,
          message: json.message || "Registration probe failed (platform deny).",
          signals: ["status_fail", "registration_probe"],
          method: "registration",
        };
        continue;
      }

      const usernameErrors = json.errors?.username;
      if (usernameErrors && usernameErrors.length > 0) {
        const err = usernameErrors[0];
        const code = (err.code || "").toLowerCase();
        const msg = err.message || "";

        if (
          code === "username_is_taken" ||
          code === "username_held_by_others" ||
          isTakenMessage(msg)
        ) {
          return {
            status: "taken",
            confidence: code === "username_held_by_others" ? 88 : 90,
            message:
              code === "username_held_by_others"
                ? "Instagram reports this username is held / restricted (often post-delete hold)."
                : "Registration server reports this username is not available.",
            signals: ["registration_endpoint", code || "taken_msg"],
            method: "registration",
            igMessage: msg || code,
          };
        }

        if (
          code === "username_invalid" ||
          code === "username_invalid_substring" ||
          code === "username_too_long" ||
          code === "username_has_special_char"
        ) {
          return {
            status: "invalid",
            confidence: 95,
            message: msg || "Instagram rejected this username format.",
            signals: ["registration_endpoint", code],
            method: "registration",
            igMessage: msg,
          };
        }

        // Other username errors \u2192 treat as unavailable / invalid conservatively
        return {
          status: isTakenMessage(msg) ? "taken" : "invalid",
          confidence: 70,
          message: msg || "Username rejected by registration server.",
          signals: ["registration_endpoint", code || "username_error"],
          method: "registration",
          igMessage: msg,
        };
      }

      // No username errors \u2192 registration path thinks it is free to attempt
      return {
        status: "possibly_available",
        confidence: 78,
        message:
          "Registration probe found no username conflict. POSSIBLY available \u2014 always verify on Instagram before acting.",
        signals: ["registration_endpoint", "no_username_error"],
        method: "registration",
      };
    }

    return lastFail;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function scoreProfileHtml(status: number, html: string, username: string): CheckResult {
  const lower = html.toLowerCase();
  const signals: string[] = [];
  let takenScore = 0;
  let freeScore = 0;

  if (status === 404) {
    freeScore += 40;
    signals.push("http_404");
  }
  if (
    lower.includes("sorry, this page isn\'t available") ||
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
  // FadeHack note: IG often returns 200 for missing profiles \u2014 never trust status alone

  if (lower.includes(`"username":"${username}"`) || lower.includes(`"username": "${username}"`)) {
    takenScore += 50;
    signals.push("json_username");
  }
  if (lower.includes("profilepage") || lower.includes('"profile_id"')) {
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
  if (lower.includes('"is_private"') || lower.includes('"edge_followed_by"')) {
    takenScore += 40;
    signals.push("shared_data_graph");
  }

  if (takenScore >= 50 && takenScore > freeScore + 15) {
    return {
      status: "taken",
      confidence: Math.min(90, 55 + Math.floor(takenScore / 2)),
      message: "Public profile signals strongly suggest this handle is taken.",
      signals,
      method: "profile_html",
    };
  }
  if (freeScore >= 40 && freeScore > takenScore + 10) {
    return {
      status: "possibly_available",
      confidence: Math.min(68, 35 + Math.floor(freeScore / 2)),
      message:
        "No public profile observed (POSSIBLY available). Not a registration guarantee \u2014 verify on Instagram.",
      signals,
      method: "profile_html",
    };
  }
  if (takenScore >= 25) {
    return {
      status: "taken",
      confidence: Math.min(72, 40 + Math.floor(takenScore / 2)),
      message: "Profile-like signals detected. Treat as likely taken.",
      signals,
      method: "profile_html",
    };
  }
  if (freeScore >= 25) {
    return {
      status: "possibly_available",
      confidence: Math.min(55, 25 + Math.floor(freeScore / 2)),
      message: "Weak empty-profile signals. Low-confidence estimate only.",
      signals,
      method: "profile_html",
    };
  }
  return {
    status: "unknown",
    confidence: 25,
    message:
      "Could not classify from public HTML. Instagram may be rate-limiting or challenging the request.",
    signals,
    method: "profile_html",
  };
}

async function checkViaProfile(username: string): Promise<CheckResult> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 9000);
  try {
    const res = await fetch(`https://www.instagram.com/${encodeURIComponent(username)}/`, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
      },
      signal: controller.signal,
      redirect: "follow",
    });
    const html = await res.text();
    return scoreProfileHtml(res.status, html, username);
  } catch (e) {
    const aborted = e instanceof Error && e.name === "AbortError";
    return {
      status: "unknown",
      confidence: 10,
      message: aborted ? "Profile request timed out." : "Profile request failed.",
      signals: [aborted ? "timeout" : "network_error"],
      method: "profile_html",
    };
  } finally {
    clearTimeout(t);
  }
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
    } satisfies CheckResult);
  }
  if (username.startsWith(".") || username.endsWith(".") || username.includes("..")) {
    return NextResponse.json({
      status: "invalid",
      confidence: 100,
      message: "Username violates Instagram format rules.",
      signals: ["format_dots"],
    } satisfies CheckResult);
  }

  // 1) Registration probe (higher fidelity when it works)
  const reg = await checkViaRegistration(username);
  if (reg && (reg.status === "taken" || reg.status === "invalid" || reg.status === "possibly_available")) {
    // Map possibly_available -> also keep "available" alias for older UI that checks available
    const body = {
      ...reg,
      // backward compat for scanner that looks for status === "available"
      status: reg.status === "possibly_available" ? "available" : reg.status,
      statusDetail: reg.status,
    };
    return NextResponse.json(body);
  }

  // 2) Profile HTML fallback (FadeHack-style)
  const profile = await checkViaProfile(username);
  const body = {
    ...profile,
    status: profile.status === "possibly_available" ? "available" : profile.status,
    statusDetail: profile.status,
    fallbackFrom: reg ? reg.status : "registration_unavailable",
  };
  return NextResponse.json(body);
}

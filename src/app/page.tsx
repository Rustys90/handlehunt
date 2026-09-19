"use client";
import { useCallback, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Loader2, Search, ExternalLink } from "lucide-react";

const HERO_VIDEO = "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/baby-track-video_crqby5.mp4";
const BOTTOM_VIDEO = "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/track-video_2_haxdch.mp4";
const TELEGRAM = "https://t.me/rareinsta";
const LOGO_PATH = "M60 120C26.8629 120 0 93.1371 0 60V0C22.5654 0 42.2213 12.4569 52.4662 30.8691C38.4788 34.2089 28.0787 46.7902 28.0787 61.8006V63.1443C28.0787 79.9648 41.7146 93.6006 58.5353 93.6006H59.8789L59.8785 61.8006C59.8785 79.3633 74.1159 93.6006 91.6787 93.6006L91.6787 61.8006C91.6787 44.2783 77.5071 30.0661 60 30.0008L60 0H62.5352C94.2722 0 120 25.7279 120 57.4648V60C120 93.1371 93.1371 120 60 120Z";

type Listing = { handle: string; price: string; status: "available" | "out"; note: string };
const LISTINGS: Listing[] = [
  { handle: "vyra", price: "$1,200", status: "available", note: "Brandable 4-letter" },
  { handle: "kade", price: "$980", status: "available", note: "Clean dictionary" },
  { handle: "noirx", price: "$640", status: "available", note: "Dark brand vibe" },
  { handle: "lune", price: "$1,450", status: "out", note: "Premium short" },
  { handle: "rift", price: "$720", status: "available", note: "Tech-ready" },
  { handle: "opal9", price: "$390", status: "available", note: "5-char gem" },
  { handle: "zeno", price: "$1,100", status: "available", note: "Name-style" },
  { handle: "xoe", price: "$4,800", status: "out", note: "Ultra short" },
];

function Logo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="white" aria-hidden>
      <path d={LOGO_PATH} />
    </svg>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });
  const cloudYDesktop = useTransform(scrollY, [0, 300], [0, -100]);
  const cloudYMobile = useTransform(scrollY, [0, 300], [0, -24]);
  const [query, setQuery] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ status: string; confidence: number; message: string } | null>(null);

  const runCheck = useCallback(async () => {
    const u = query.trim().toLowerCase().replace(/[^a-z0-9._]/g, "");
    if (!u) return;
    setChecking(true);
    setResult(null);
    try {
      const res = await fetch("/api/check?username=" + encodeURIComponent(u));
      setResult(await res.json());
    } catch {
      setResult({ status: "unknown", confidence: 0, message: "Check failed." });
    } finally {
      setChecking(false);
    }
  }, [query]);

  return (
    <main ref={containerRef} className="h-screen overflow-y-auto overflow-x-hidden font-manrope bg-black relative">
      <section className="relative h-screen w-full flex-shrink-0 overflow-hidden">
        <video className="absolute inset-0 z-10 w-full h-full object-cover" src={HERO_VIDEO} autoPlay loop muted playsInline />
        <div className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/50" />
        <div className="absolute top-[24px] left-[20px] md:top-[64px] md:left-[64px] z-40 flex flex-row gap-4 md:gap-6 items-center max-w-[calc(100vw-140px)]">
          <Logo size={48} />
          <p className="text-white text-[11px] md:text-[16px] leading-[1.2] font-semibold tracking-[0.02em] hidden md:block">
            Rare handles.<br />Live scan.<br />Marketplace.
          </p>
          <p className="text-white text-[11px] leading-[1.2] font-semibold block md:hidden w-[112px]">
            Scan rare<br />IG handles.<br />Buy smart.
          </p>
        </div>
        <div className="hidden md:flex absolute left-[64px] top-[200px] z-40 flex-col gap-6 max-w-[320px] text-white text-[14px] leading-relaxed">
          <p>HandleHunt estimates Instagram username availability and surfaces rare short handles. Listings are third-party offers.</p>
          <p>Meta prohibits buying or selling accounts and usernames in its Terms of Use.</p>
        </div>
        <a href="#scanner" className="absolute top-[24px] right-[20px] md:top-[64px] md:right-[64px] z-40 px-5 py-3 md:px-10 md:py-7 border border-white rounded-[100%] text-white text-[12px] md:text-[18px] font-italiana uppercase tracking-widest hover:bg-white/10 hover:backdrop-blur-[48px] transition-all duration-300 bg-black/10 backdrop-blur-sm">
          Get started
        </a>
        <div className="absolute bottom-[32px] left-[20px] right-[20px] md:left-auto md:bottom-[64px] md:right-[64px] md:max-w-[1200px] text-left md:text-right z-40">
          <div className="md:hidden flex flex-col gap-4 max-w-[280px] text-white text-[12px] mb-8">
            <p>Find short Instagram usernames still free — or listed by sellers.</p>
            <p>Not affiliated with Meta or Instagram.</p>
          </div>
          <h1 className="text-white text-[32px] leading-[1.1] md:text-[96px] font-italiana md:leading-[88px]">
            <span className="md:hidden">Hunt Rare<br />Instagram<br />Handles.</span>
            <span className="hidden md:inline">Rare Instagram<br />Handles.<br />Scan. Discover.<br />Claim.</span>
          </h1>
        </div>
      </section>

      <section className="relative min-h-screen w-full bg-[#FF0000] flex flex-col z-10">
        <motion.div className="hidden md:block absolute top-0 left-0 w-full z-[100] pointer-events-none -translate-y-1/2" style={{ y: cloudYDesktop }}>
          <div className="w-full h-[180px] opacity-90" style={{ background: "radial-gradient(ellipse 40% 80% at 20% 50%, rgba(255,255,255,0.95) 0%, transparent 70%), radial-gradient(ellipse 35% 70% at 50% 60%, rgba(255,255,255,0.9) 0%, transparent 70%), radial-gradient(ellipse 40% 80% at 80% 45%, rgba(255,255,255,0.95) 0%, transparent 70%)" }} />
        </motion.div>
        <motion.div className="md:hidden absolute top-0 left-0 w-full z-[100] pointer-events-none -translate-y-1/2" style={{ y: cloudYMobile }}>
          <div className="w-full h-[100px] opacity-90" style={{ background: "radial-gradient(ellipse 50% 90% at 30% 50%, rgba(255,255,255,0.95) 0%, transparent 70%), radial-gradient(ellipse 50% 90% at 70% 55%, rgba(255,255,255,0.9) 0%, transparent 70%)" }} />
        </motion.div>
        <div className="flex-1 flex flex-col items-center w-full pt-[100px] md:pt-[220px]">
          <div className="flex flex-col items-center w-full px-8 text-center z-20 relative max-w-[900px] mx-auto">
            <Logo size={80} />
            <p className="text-white text-[16px] max-w-[400px] leading-[1.6] mb-10 uppercase tracking-wider mx-auto mt-8">
              Built to cut through handle noise — scan availability estimates and browse rare short names in one place.
            </p>
            <div className="font-marck text-white text-[96px] md:text-[120px] leading-none mb-8">H.H.</div>
            <p className="text-white text-[16px] w-[400px] max-w-full font-light mb-6">Availability checks are estimates from public signals — not guarantees from Instagram.</p>
            <p className="text-white text-[16px] w-[400px] max-w-full font-light mb-16">Marketplace deals happen via Telegram. HandleHunt does not process payments or transfer accounts.</p>
          </div>
        </div>
        <div className="relative w-full shrink-0">
          <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-[#FF0000] to-transparent z-10 pointer-events-none" />
          <video className="w-full h-auto block object-contain" src={BOTTOM_VIDEO} autoPlay loop muted playsInline />
        </div>
      </section>

      <section id="scanner" className="relative w-full bg-black py-20 px-5 md:px-16 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">Scanner</p>
          <h2 className="font-italiana text-4xl md:text-5xl text-white mb-4">Check a handle</h2>
          <p className="text-white/70 text-sm mb-8 max-w-xl">Enter a username for an availability estimate from public signals — not an official Instagram result.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 border border-white/25 rounded-full px-5 py-3 bg-white/5">
              <span className="text-white/40">@</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runCheck()} placeholder="username" className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30" maxLength={30} />
            </div>
            <button type="button" onClick={runCheck} disabled={checking} className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-white text-black font-semibold text-sm uppercase tracking-wider disabled:opacity-60">
              {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Scan
            </button>
          </div>
          {result && (
            <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Result</p>
              <p className="text-xl font-italiana capitalize text-white">{result.status}</p>
              <p className="text-sm text-white/70 mt-1">Confidence ~{result.confidence}% — {result.message}</p>
            </div>
          )}
        </div>
      </section>

      <section id="marketplace" className="relative w-full bg-[#0a0a0a] py-20 border-t border-white/10">
        <div className="px-5 md:px-16 mb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">Marketplace</p>
          <h2 className="font-italiana text-4xl md:text-5xl text-white mb-3">Listed handles</h2>
          <p className="text-white/70 text-sm max-w-2xl">Swipe the carousel. Buy opens Telegram. Instagram forbids account/username sales in its Terms.</p>
        </div>
        <div className="market-track">
          {LISTINGS.map((item) => (
            <article key={item.handle} className="market-card rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/[0.03] p-6 flex flex-col min-h-[240px]">
              <div className="flex justify-between items-start mb-6">
                <span className="font-italiana text-3xl text-white">@{item.handle}</span>
                <span className={"text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border " + (item.status === "available" ? "border-emerald-400/40 text-emerald-300" : "border-white/20 text-white/40")}>
                  {item.status === "available" ? "Listed" : "Out of stock"}
                </span>
              </div>
              <p className="text-white/50 text-sm flex-1">{item.note}</p>
              <div className="flex items-center justify-between mt-6">
                <span className="text-white text-lg font-semibold">{item.price}</span>
                {item.status === "available" ? (
                  <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm uppercase tracking-wider px-4 py-2 rounded-full border border-white/30 hover:bg-white hover:text-black transition-colors">
                    Buy now <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-sm text-white/35 uppercase tracking-wider">Out of stock</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="bg-black border-t border-white/10 px-5 md:px-16 py-12 text-sm text-white/60">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 justify-between">
          <div>
            <p className="font-italiana text-white text-2xl mb-2">HandleHunt</p>
            <p className="max-w-sm">Discovery and listing venue only. Not affiliated with Meta or Instagram.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="/privacy" className="hover:text-white">Privacy Policy</a>
            <a href="/terms" className="hover:text-white">Terms of Use</a>
            <a href="/disclaimer" className="hover:text-white">Disclaimer</a>
            <a href={TELEGRAM} target="_blank" rel="noreferrer" className="hover:text-white">Telegram</a>
          </div>
        </div>
        <p className="max-w-5xl mx-auto mt-8 text-xs text-white/40">
          Buying or selling Instagram accounts/usernames may violate Instagram Terms of Use and can result in account loss.
        </p>
      </footer>
    </main>
  );
}

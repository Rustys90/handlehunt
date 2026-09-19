"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Loader2, Search, Play, Pause } from "lucide-react";
import ArcFlowCarousel, { type ArcCard } from "@/components/ui/arc-flow-carousel";

const HERO_VIDEO = "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/baby-track-video_crqby5.mp4";
const BOTTOM_VIDEO = "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/track-video_2_haxdch.mp4";
const TELEGRAM = "https://t.me/rareinsta";
const CHARSET = "abcdefghijklmnopqrstuvwxyz0123456789";
const BASE = CHARSET.length;
const LOGO_PATH = "M60 120C26.8629 120 0 93.1371 0 60V0C22.5654 0 42.2213 12.4569 52.4662 30.8691C38.4788 34.2089 28.0787 46.7902 28.0787 61.8006V63.1443C28.0787 79.9648 41.7146 93.6006 58.5353 93.6006H59.8789L59.8785 61.8006C59.8785 79.3633 74.1159 93.6006 91.6787 93.6006L91.6787 61.8006C91.6787 44.2783 77.5071 30.0661 60 30.0008L60 0H62.5352C94.2722 0 120 25.7279 120 57.4648V60C120 93.1371 93.1371 120 60 120Z";

const MARKET_CARDS: ArcCard[] = [
  { handle: "vyra", price: "$1,200", status: "available", note: "Brandable 4-letter", color: "#f3cdd6" },
  { handle: "kade", price: "$980", status: "available", note: "Clean dictionary", color: "#dcedc2" },
  { handle: "noirx", price: "$640", status: "available", note: "Dark brand vibe", color: "#c3e3f4" },
  { handle: "lune", price: "$1,450", status: "out", note: "Premium short", color: "#f0e4c0" },
  { handle: "rift", price: "$720", status: "available", note: "Tech-ready", color: "#dcd2f2" },
  { handle: "opal9", price: "$390", status: "available", note: "5-char gem", color: "#ffd6e8" },
  { handle: "zeno", price: "$1,100", status: "available", note: "Name-style", color: "#c8f0d8" },
  { handle: "xoe", price: "$4,800", status: "out", note: "Ultra short", color: "#d4e4ff" },
  { handle: "mira", price: "$1,350", status: "available", note: "Soft brandable", color: "#ffe0c2" },
  { handle: "kivu", price: "$560", status: "available", note: "Rare 4-char", color: "#e0d4ff" },
  { handle: "selo", price: "$890", status: "available", note: "Clean vowel mix", color: "#d2f5e8" },
  { handle: "qora", price: "$1,050", status: "out", note: "Q-series short", color: "#ffd0d0" },
  { handle: "nyx7", price: "$420", status: "available", note: "Dark + digit", color: "#c9d8ff" },
  { handle: "vex", price: "$3,200", status: "out", note: "3-char power", color: "#f5e6c8" },
];

function indexToHandle(index: number, length: number): string {
  let n = index; let s = "";
  for (let i = 0; i < length; i++) { s = CHARSET[n % BASE] + s; n = Math.floor(n / BASE); }
  return s;
}
function totalCombos(length: number) { return Math.pow(BASE, length); }
function Logo({ size = 48 }: { size?: number }) {
  return (<svg width={size} height={size} viewBox="0 0 120 120" fill="white" aria-hidden><path d={LOGO_PATH} /></svg>);
}
type Found = { handle: string; confidence: number; at: number };

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });
  const cloudYDesktop = useTransform(scrollY, [0, 300], [0, -100]);
  const cloudYMobile = useTransform(scrollY, [0, 300], [0, -24]);
  const [query, setQuery] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ status: string; confidence: number; message: string } | null>(null);
  const [scanLen, setScanLen] = useState<3 | 4>(3);
  const [scanning, setScanning] = useState(false);
  const [scanIndex, setScanIndex] = useState(0);
  const [found, setFound] = useState<Found[]>([]);
  const [lastChecked, setLastChecked] = useState("");
  const scanningRef = useRef(false);
  const indexRef = useRef(0);
  const lenRef = useRef<3 | 4>(3);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hh_scan_" + scanLen);
      if (raw) {
        const data = JSON.parse(raw);
        setScanIndex(data.index || 0);
        indexRef.current = data.index || 0;
        setFound(data.found || []);
      } else { setScanIndex(0); indexRef.current = 0; setFound([]); }
    } catch {}
    lenRef.current = scanLen;
  }, [scanLen]);

  const persist = useCallback((index: number, foundList: Found[]) => {
    try { localStorage.setItem("hh_scan_" + lenRef.current, JSON.stringify({ index, found: foundList.slice(0, 200) })); } catch {}
  }, []);

  const runCheck = useCallback(async () => {
    const u = query.trim().toLowerCase().replace(/[^a-z0-9._]/g, "");
    if (!u) return;
    setChecking(true); setResult(null);
    try {
      const res = await fetch("/api/check?username=" + encodeURIComponent(u));
      setResult(await res.json());
    } catch { setResult({ status: "unknown", confidence: 0, message: "Check failed." }); }
    finally { setChecking(false); }
  }, [query]);

  useEffect(() => {
    scanningRef.current = scanning;
    if (!scanning) return;
    let cancelled = false;
    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      const total = totalCombos(lenRef.current);
      let idx = indexRef.current;
      let localFound = [...found];
      while (scanningRef.current && !cancelled && idx < total) {
        const handle = indexToHandle(idx, lenRef.current);
        setLastChecked(handle); setScanIndex(idx);
        try {
          const res = await fetch("/api/check?username=" + encodeURIComponent(handle));
          const data = await res.json();
          if (data.status === "available" && (data.confidence || 0) >= 40) {
            localFound = [{ handle, confidence: data.confidence, at: Date.now() }, ...localFound].slice(0, 100);
            setFound(localFound);
          }
        } catch {}
        idx += 1; indexRef.current = idx;
        if (idx % 5 === 0) persist(idx, localFound);
        await delay(450);
      }
      persist(indexRef.current, localFound);
      if (idx >= total) setScanning(false);
    })();
    return () => { cancelled = true; scanningRef.current = false; };
  }, [scanning]);

  const total = totalCombos(scanLen);
  const pct = total > 0 ? ((scanIndex / total) * 100).toFixed(4) : "0";

  return (
    <main ref={containerRef} className="h-screen overflow-y-auto overflow-x-hidden font-manrope bg-black relative">
      <section className="relative h-screen w-full flex-shrink-0 overflow-hidden">
        <video className="absolute inset-0 z-10 w-full h-full object-cover" src={HERO_VIDEO} autoPlay loop muted playsInline />
        <div className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/50" />
        <div className="absolute top-[24px] left-[20px] md:top-[64px] md:left-[64px] z-40 flex flex-row gap-4 md:gap-6 items-center">
          <Logo size={48} />
          <p className="text-white text-[11px] md:text-[16px] leading-[1.2] font-semibold tracking-[0.02em] hidden md:block">Rare handles.<br />Live scan.<br />Marketplace.</p>
        </div>
        <a href="#scanner" className="absolute top-[24px] right-[20px] md:top-[64px] md:right-[64px] z-40 px-5 py-3 md:px-10 md:py-7 border border-white rounded-[100%] text-white text-[12px] md:text-[18px] font-italiana uppercase tracking-widest hover:bg-white/10 transition-all duration-300">Get started</a>
        <div className="absolute bottom-[32px] left-[20px] right-[20px] md:left-auto md:bottom-[64px] md:right-[64px] md:max-w-[1200px] text-left md:text-right z-40">
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
        <div className="flex-1 flex flex-col items-center w-full pt-[100px] md:pt-[220px]">
          <div className="flex flex-col items-center w-full px-8 text-center z-20 relative max-w-[900px] mx-auto">
            <Logo size={80} />
            <p className="text-white text-[16px] max-w-[400px] leading-[1.6] mb-10 uppercase tracking-wider mx-auto mt-8">3 & 4 character exhaustive scans · arc marketplace · Telegram</p>
            <div className="font-marck text-white text-[96px] md:text-[120px] leading-none mb-8">H.H.</div>
            <p className="text-white text-[16px] max-w-[400px] font-light mb-16">Scans pause when you leave. Progress is saved in this browser.</p>
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
          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <div className="flex-1 flex items-center gap-2 border border-white/25 rounded-full px-5 py-3 bg-white/5">
              <span className="text-white/40">@</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runCheck()} placeholder="username" className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30" maxLength={30} />
            </div>
            <button type="button" onClick={runCheck} disabled={checking} className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-white text-black font-semibold text-sm uppercase tracking-wider disabled:opacity-60">
              {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Scan
            </button>
          </div>
          {result && (
            <div className="mb-12 rounded-2xl border border-white/15 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Result</p>
              <p className="text-xl font-italiana capitalize text-white">{result.status}</p>
              <p className="text-sm text-white/70 mt-1">Confidence ~{result.confidence}% — {result.message}</p>
            </div>
          )}

          <h3 className="font-italiana text-3xl text-white mb-3">Exhaustive 3 / 4 character scan</h3>
          <p className="text-white/60 text-sm mb-6 max-w-xl">Every combination of a–z and 0–9. Runs only while this page is open.</p>
          <div className="flex flex-wrap gap-3 mb-6">
            {([3, 4] as const).map((n) => (
              <button key={n} type="button" disabled={scanning} onClick={() => setScanLen(n)} className={"px-5 py-2 rounded-full text-sm uppercase tracking-wider border " + (scanLen === n ? "bg-white text-black border-white" : "border-white/30 text-white")}>
                {n}-char
              </button>
            ))}
            <button type="button" onClick={() => setScanning((s) => !s)} className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#FF0000] text-white text-sm uppercase tracking-wider">
              {scanning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {scanning ? "Pause" : "Start scan"}
            </button>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5 mb-6">
            <p className="text-xs text-white/50 uppercase tracking-widest mb-2">Progress</p>
            <p className="text-white font-mono text-sm">@{lastChecked || "—"} · {scanIndex.toLocaleString()} / {total.toLocaleString()} ({pct}%)</p>
            <div className="mt-4 h-2.5 rounded-full bg-white/10 overflow-hidden relative">
              <div className="h-full rounded-full progress-fill relative overflow-hidden" style={{ width: Math.min(100, Math.max(scanning ? 1.2 : 0.5, Number(pct))) + "%" }}>
                <span className="progress-shine absolute inset-0" />
              </div>
            </div>
          </div>
          {found.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-white/50 mb-3">Possible available ({found.length})</p>
              <div className="flex flex-wrap gap-2">
                {found.map((f) => (
                  <span key={f.handle} className="px-3 py-1.5 rounded-full border border-emerald-400/30 text-emerald-200 text-sm font-mono">@{f.handle} · {f.confidence}%</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="marketplace" className="relative w-full bg-[#0a0a0a] pt-14 pb-8 border-t border-white/10 overflow-hidden">
        <div className="px-5 md:px-16 mb-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">Marketplace</p>
          <h2 className="font-italiana text-4xl md:text-5xl text-white mb-2">Listed handles</h2>
          <p className="text-white/70 text-sm max-w-2xl">Arc carousel — drag or scroll. Buy opens Telegram.</p>
        </div>
        <ArcFlowCarousel cards={MARKET_CARDS} />
      </section>

      <footer className="bg-black border-t border-white/10 px-5 md:px-16 py-12 text-sm text-white/60">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 justify-between">
          <div>
            <p className="font-italiana text-white text-2xl mb-2">HandleHunt</p>
            <p className="max-w-sm">Discovery venue only. Not affiliated with Meta or Instagram.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="/privacy" className="hover:text-white">Privacy Policy</a>
            <a href="/terms" className="hover:text-white">Terms of Use</a>
            <a href="/disclaimer" className="hover:text-white">Disclaimer</a>
            <a href={TELEGRAM} target="_blank" rel="noreferrer" className="hover:text-white">Telegram</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ExternalLink } from "lucide-react";

export type ArcCard = {
  handle: string;
  price: string;
  status: "available" | "out";
  note: string;
  color: string;
};

const TELEGRAM = "https://t.me/rareinsta";

type Props = { cards: ArcCard[] };

export default function ArcFlowCarousel({ cards }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const progress = useRef(0);
  const target = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const fn = () => setIsMobile(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const layout = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const items = Array.from(track.children) as HTMLElement[];
    const n = items.length;
    if (!n) return;
    const spacing = isMobile ? 16 : 12;
    const radius = isMobile ? 480 : 820;
    const cardW = isMobile ? 168 : 232;
    const half = cardW / 2;
    const center = Math.floor(n / 2);
    items.forEach((el, i) => {
      const base = (i - center) * spacing;
      const deg = base - progress.current * spacing;
      const rad = (deg * Math.PI) / 180;
      const x = Math.sin(rad) * radius;
      const y = (radius - Math.cos(rad) * radius) * 0.22;
      const scale = 1 - Math.min(0.28, Math.abs(deg) * 0.01);
      const opacity = Math.max(0.35, 1 - Math.abs(deg) * 0.028);
      gsap.set(el, {
        x: x - half,
        y: -y,
        rotation: deg * 0.85,
        scale,
        opacity,
        zIndex: Math.round(100 - Math.abs(deg)),
        transformOrigin: "50% 80%",
      });
    });
    const idx = Math.round(progress.current + center) % n;
    setActive(((idx % n) + n) % n);
  }, [isMobile, cards.length]);

  useLayoutEffect(() => { layout(); }, [layout]);

  useEffect(() => {
    const tick = () => {
      progress.current += (target.current - progress.current) * 0.1;
      layout();
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [layout]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let startX = 0, startProg = 0, dragging = false;
    const onDown = (e: PointerEvent) => {
      dragging = true; startX = e.clientX; startProg = target.current;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      target.current = startProg - (e.clientX - startX) / (isMobile ? 38 : 52);
    };
    const onUp = () => { dragging = false; target.current = Math.round(target.current); };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      target.current += e.deltaY > 0 ? 0.4 : -0.4;
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("wheel", onWheel);
    };
  }, [isMobile]);

  return (
    <div ref={rootRef} className="relative w-full select-none touch-pan-y" style={{ height: isMobile ? 360 : 440 }}>
      <div ref={trackRef} className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2" style={{ width: 0, height: 0 }}>
        {cards.map((card, i) => (
          <div key={card.handle + i} className="absolute top-0 left-0 will-change-transform" style={{ width: isMobile ? 168 : 232 }}>
            <div
              className="rounded-2xl md:rounded-3xl p-4 md:p-5 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.45)] border border-white/20 overflow-hidden relative"
              style={{
                height: isMobile ? 200 : 248,
                background: `linear-gradient(145deg, ${card.color} 0%, ${card.color}cc 45%, #1a1a1a 160%)`,
              }}
            >
              <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: "radial-gradient(ellipse at 20% 0%, rgba(255,255,255,0.55), transparent 55%)" }} />
              <div className="relative flex justify-between items-start">
                <span className="text-[10px] uppercase tracking-wider text-black/55 font-semibold">{String(i + 1).padStart(2, "0")}</span>
                <span className={"text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold " + (card.status === "available" ? "bg-black/15 text-black/80" : "bg-black/10 text-black/45")}>
                  {card.status === "available" ? "Listed" : "Out"}
                </span>
              </div>
              <div className="relative">
                <p className="text-black text-2xl md:text-[28px] leading-none mb-1.5 font-semibold" style={{ fontFamily: "Italiana, serif" }}>@{card.handle}</p>
                <p className="text-black/60 text-xs md:text-sm">{card.note}</p>
              </div>
              <div className="relative flex items-center justify-between gap-2">
                <span className="text-black font-bold text-base md:text-lg">{card.price}</span>
                {card.status === "available" ? (
                  <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-full bg-black text-white font-semibold hover:bg-black/85 active:scale-95 transition">
                    Buy now <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-full bg-black/15 text-black/50 font-semibold">Out of stock</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="absolute bottom-1 left-0 right-0 text-center text-white/40 text-xs pointer-events-none">
        Drag or scroll · {cards[active]?.handle ? `@${cards[active].handle}` : ""}
      </p>
    </div>
  );
}

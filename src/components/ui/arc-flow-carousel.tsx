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
    const spacing = isMobile ? 14 : 11;
    const radius = isMobile ? 520 : 900;
    const cardW = isMobile ? 160 : 220;
    const half = cardW / 2;
    const center = Math.floor(n / 2);
    items.forEach((el, i) => {
      const base = (i - center) * spacing;
      const deg = base - progress.current * spacing;
      const rad = (deg * Math.PI) / 180;
      const x = Math.sin(rad) * radius;
      const y = radius - Math.cos(rad) * radius;
      const scale = 1 - Math.min(0.35, Math.abs(deg) * 0.012);
      const opacity = Math.max(0.25, 1 - Math.abs(deg) * 0.035);
      gsap.set(el, {
        x: x - half,
        y: -y * 0.35,
        rotation: deg,
        scale,
        opacity,
        zIndex: Math.round(100 - Math.abs(deg)),
        transformOrigin: "50% 100%",
      });
    });
    const idx = Math.round(progress.current + center) % n;
    setActive(((idx % n) + n) % n);
  }, [isMobile, cards.length]);

  useLayoutEffect(() => {
    layout();
  }, [layout]);

  useEffect(() => {
    const tick = () => {
      progress.current += (target.current - progress.current) * 0.08;
      layout();
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [layout]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let startX = 0;
    let startProg = 0;
    let dragging = false;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      startX = e.clientX;
      startProg = target.current;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      target.current = startProg - (e.clientX - startX) / (isMobile ? 40 : 55);
    };
    const onUp = () => {
      dragging = false;
      target.current = Math.round(target.current);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      target.current += e.deltaY > 0 ? 0.35 : -0.35;
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
    <div ref={rootRef} className="relative w-full select-none touch-pan-y" style={{ height: isMobile ? 320 : 420 }}>
      <div ref={trackRef} className="absolute left-1/2 bottom-[20%] -translate-x-1/2" style={{ width: 0, height: 0 }}>
        {cards.map((card, i) => (
          <div key={card.handle + i} className="absolute top-0 left-0 will-change-transform" style={{ width: isMobile ? 160 : 220 }}>
            <div
              className="rounded-2xl md:rounded-3xl p-4 md:p-5 flex flex-col justify-between shadow-2xl border border-black/5"
              style={{ height: isMobile ? 180 : 230, background: card.color }}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase tracking-wider text-black/50">{String(i + 1).padStart(2, "0")}</span>
                <span className={"text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full " + (card.status === "available" ? "bg-black/10 text-black/70" : "bg-black/5 text-black/40")}>
                  {card.status === "available" ? "Listed" : "Out"}
                </span>
              </div>
              <div>
                <p className="text-black text-2xl md:text-3xl leading-none mb-1" style={{ fontFamily: "Italiana, serif" }}>@{card.handle}</p>
                <p className="text-black/55 text-xs md:text-sm">{card.note}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-black font-semibold text-sm md:text-base">{card.price}</span>
                {card.status === "available" ? (
                  <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full bg-black text-white hover:bg-black/80">
                    Buy <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] uppercase tracking-wider text-black/35">Out of stock</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="absolute bottom-2 left-0 right-0 text-center text-white/40 text-xs">
        Drag or scroll · {cards[active]?.handle ? `@${cards[active].handle}` : ""}
      </p>
    </div>
  );
}

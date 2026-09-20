"use client";

import { memo, useMemo } from "react";
import { Marquee } from "@/components/ui/marquee";

type TItem = {
  name: string;
  username: string;
  body: string;
  initials: string;
  color: string;
  tag: string;
};

const TESTIMONIALS: TItem[] = [
  { name: "Ava Green", username: "@ava.g", body: "Found my dream 4-letter handle in under an hour. HandleHunt is unreal.", initials: "AG", color: "#f3cdd6", tag: "AU" },
  { name: "Mateo Rossi", username: "@mat.r", body: "Scanned thousands of combos while I slept. Progress saved. Absolute win.", initials: "MR", color: "#c3e3f4", tag: "IT" },
  { name: "Maya Patel", username: "@maya.p", body: "Trusted marketplace. Bought via Telegram same day. 100% legit feel.", initials: "MP", color: "#dcedc2", tag: "IN" },
  { name: "Noah Smith", username: "@noah.s", body: "Finally snagged a clean brandable. Best username tool I've used.", initials: "NS", color: "#f0e4c0", tag: "US" },
  { name: "Haruto Sato", username: "@haru", body: "3-char scan is slow but honest. When it finds one, it's gold.", initials: "HS", color: "#dcd2f2", tag: "JP" },
  { name: "Emma Lee", username: "@emma.l", body: "UI is clean, deals were smooth. Would recommend to any creator.", initials: "EL", color: "#ffd6e8", tag: "CA" },
  { name: "Carlos Ray", username: "@carl.r", body: "Got my fav short handle listed here. Trusted sellers, fast chat.", initials: "CR", color: "#c8f0d8", tag: "ES" },
  { name: "Lucas Stone", username: "@luc.s", body: "HandleHunt found what namecheckers missed. Straight fire.", initials: "LS", color: "#d4e4ff", tag: "FR" },
  { name: "Ana Miller", username: "@ana.m", body: "100% trusted workflow \u2014 scan, list, buy on Telegram. Simple.", initials: "AM", color: "#ffe0c2", tag: "DE" },
];

function rotate(list: TItem[], offset: number) {
  const n = list.length;
  return list.map((_, i) => list[(i + offset) % n]);
}

const TestimonialCard = memo(function TestimonialCard({
  name, username, body, initials, color, tag,
}: TItem) {
  return (
    <article
      className="w-[200px] shrink-0 rounded-xl border border-white/10 bg-white/[0.05] p-3.5"
      style={{ contentVisibility: "auto", containIntrinsicSize: "200px 120px" }}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-black"
          style={{ background: color }}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">
            {name} <span className="text-[10px] text-white/40">{tag}</span>
          </p>
          <p className="truncate text-xs text-white/40">{username}</p>
        </div>
      </div>
      <p className="mt-2.5 text-[13px] leading-snug text-white/70">{body}</p>
    </article>
  );
});

function Column({
  items, reverse, duration, className,
}: {
  items: TItem[];
  reverse?: boolean;
  duration: string;
  className?: string;
}) {
  const cards = useMemo(
    () => items.map((t) => <TestimonialCard key={t.username} {...t} />),
    [items]
  );

  return (
    <Marquee
      vertical
      pauseOnHover
      reverse={reverse}
      repeat={2}
      className={className}
      style={{ ["--duration" as string]: duration, height: 380 }}
    >
      {cards}
    </Marquee>
  );
}

export default function Testimonials3D() {
  const col0 = useMemo(() => rotate(TESTIMONIALS, 0), []);
  const col1 = useMemo(() => rotate(TESTIMONIALS, 3), []);
  const col2 = useMemo(() => rotate(TESTIMONIALS, 6), []);

  return (
    <section className="relative w-full border-t border-white/10 bg-black py-14 overflow-hidden">
      <div className="px-5 md:px-16 mb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">Social proof</p>
        <h2 className="font-italiana text-4xl md:text-5xl text-white mb-2">What hunters say</h2>
        <p className="text-white/60 text-sm max-w-xl">
          Creators who scanned, claimed, and bought rare Instagram handles through HandleHunt.
        </p>
      </div>

      {/* Outer: perspective. Inner: rotate. No inline transform (it was killing CSS tilt). */}
      <div className="relative mx-auto h-[400px] w-full max-w-5xl testimonial-wrap">
        <div className="flex h-full flex-row items-stretch justify-center gap-3 px-2 md:gap-4 testimonial-stage">
          <Column items={col0} duration="28s" className="h-full" />
          <Column items={col1} reverse duration="34s" className="h-full" />
          <Column items={col2} duration="30s" className="h-full hidden sm:flex" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black to-transparent z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black to-transparent z-10" />
      </div>
    </section>
  );
}

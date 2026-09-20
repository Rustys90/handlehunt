"use client";

import { memo, useMemo } from "react";
import { Marquee } from "@/components/ui/marquee";

type TItem = {
  name: string;
  username: string;
  body: string;
  initials: string;
  color: string;
  country: string;
};

const TESTIMONIALS: TItem[] = [
  {
    name: "Ava Green",
    username: "@ava.g",
    body: "Found my dream 4-letter handle in under an hour. HandleForge is unreal.",
    initials: "AG",
    color: "#f3cdd6",
    country: "\ud83c\udde6\ud83c\uddfa Australia",
  },
  {
    name: "Mateo Rossi",
    username: "@mat.r",
    body: "Scanned thousands of combos while I slept. Progress saved. Absolute win.",
    initials: "MR",
    color: "#c3e3f4",
    country: "\ud83c\uddee\ud83c\uddf9 Italy",
  },
  {
    name: "Maya Patel",
    username: "@maya.p",
    body: "Trusted marketplace. Bought via Telegram same day. 100% legit feel.",
    initials: "MP",
    color: "#dcedc2",
    country: "\ud83c\uddee\ud83c\uddf3 India",
  },
  {
    name: "Noah Smith",
    username: "@noah.s",
    body: "Finally snagged a clean brandable. Best username tool I've used.",
    initials: "NS",
    color: "#f0e4c0",
    country: "\ud83c\uddfa\ud83c\uddf8 USA",
  },
  {
    name: "Haruto Sato",
    username: "@haru",
    body: "3-char scan is slow but honest. When it finds one, it's gold.",
    initials: "HS",
    color: "#dcd2f2",
    country: "\ud83c\uddef\ud83c\uddf5 Japan",
  },
  {
    name: "Emma Lee",
    username: "@emma.l",
    body: "UI is clean, deals were smooth. Would recommend to any creator.",
    initials: "EL",
    color: "#ffd6e8",
    country: "\ud83c\udde8\ud83c\udde6 Canada",
  },
  {
    name: "Carlos Ray",
    username: "@carl.r",
    body: "Got my fav short handle listed here. Trusted sellers, fast chat.",
    initials: "CR",
    color: "#c8f0d8",
    country: "\ud83c\uddea\ud83c\uddf8 Spain",
  },
  {
    name: "Lucas Stone",
    username: "@luc.s",
    body: "HandleForge found what namecheckers missed. Straight fire.",
    initials: "LS",
    color: "#d4e4ff",
    country: "\ud83c\uddeb\ud83c\uddf7 France",
  },
  {
    name: "Ana Miller",
    username: "@ana.m",
    body: "100% trusted workflow \u2014 scan, list, buy on Telegram. Simple.",
    initials: "AM",
    color: "#ffe0c2",
    country: "\ud83c\udde9\ud83c\uddea Germany",
  },
];

function rotate(list: TItem[], offset: number) {
  const n = list.length;
  return list.map((_, i) => list[(i + offset) % n]);
}

const TestimonialCard = memo(function TestimonialCard({
  name,
  username,
  body,
  initials,
  color,
  country,
}: TItem) {
  return (
    <article
      className="w-[200px] shrink-0 rounded-xl border border-white/15 bg-gradient-to-b from-white/[0.09] to-white/[0.02] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
      style={{ contentVisibility: "auto", containIntrinsicSize: "200px 140px" }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-black ring-1 ring-white/20"
          style={{ background: color }}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{name}</p>
          <p className="truncate text-xs text-white/45">{username}</p>
        </div>
      </div>
      <p className="mt-3 text-[13px] leading-snug text-white/75">{body}</p>
      <p className="mt-2 text-[11px] text-white/40">{country}</p>
    </article>
  );
});

function Column({
  items,
  reverse,
  duration,
  className,
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
      style={{ ["--duration" as string]: duration, height: "100%" }}
    >
      {cards}
    </Marquee>
  );
}

export default function Testimonials3D() {
  const col0 = useMemo(() => rotate(TESTIMONIALS, 0), []);
  const col1 = useMemo(() => rotate(TESTIMONIALS, 2), []);
  const col2 = useMemo(() => rotate(TESTIMONIALS, 4), []);
  const col3 = useMemo(() => rotate(TESTIMONIALS, 6), []);

  return (
    <section className="relative w-full border-t border-white/10 bg-black py-14 overflow-hidden">
      <div className="px-5 md:px-16 mb-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">Social proof</p>
        <h2 className="font-italiana text-4xl md:text-5xl text-white mb-2">What hunters say</h2>
        <p className="text-white/60 text-sm max-w-xl">
          Creators who scanned, claimed, and bought rare Instagram handles through HandleForge.
        </p>
      </div>

      {/* Same structure as original demo: perspective container + heavy 3D transform */}
      <div className="relative mx-auto flex h-96 w-full max-w-[900px] flex-row items-center justify-center overflow-hidden gap-1.5 testimonial-wrap">
        <div className="flex flex-row items-center gap-1.5 h-full testimonial-stage">
          <Column items={col0} duration="40s" className="h-full" />
          <Column items={col1} reverse duration="40s" className="h-full" />
          <Column items={col2} duration="40s" className="h-full hidden sm:flex" />
          <Column items={col3} reverse duration="40s" className="h-full hidden md:flex" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black z-10" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-black z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-black z-10" />
      </div>
    </section>
  );
}

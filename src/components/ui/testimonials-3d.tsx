"use client";

import { Marquee } from "@/components/ui/marquee";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  { name: "Ava Green", username: "@ava.g", body: "Found my dream 4-letter handle in under an hour. HandleHunt is unreal.", initials: "AG", color: "#f3cdd6", tag: "\U0001F1E6\U0001F1FA" },
  { name: "Mateo Rossi", username: "@mat.r", body: "Scanned thousands of combos while I slept. Progress saved. Absolute win.", initials: "MR", color: "#c3e3f4", tag: "\U0001F1EE\U0001F1F9" },
  { name: "Maya Patel", username: "@maya.p", body: "Trusted marketplace. Bought via Telegram same day. 100% legit feel.", initials: "MP", color: "#dcedc2", tag: "\U0001F1EE\U0001F1F3" },
  { name: "Noah Smith", username: "@noah.s", body: "Finally snagged a clean brandable. Best username tool I\u2019ve used.", initials: "NS", color: "#f0e4c0", tag: "\U0001F1FA\U0001F1F8" },
  { name: "Haruto Sato", username: "@haru", body: "3-char scan is slow but honest. When it finds one, it\u2019s gold.", initials: "HS", color: "#dcd2f2", tag: "\U0001F1EF\U0001F1F5" },
  { name: "Emma Lee", username: "@emma.l", body: "UI is clean, deals were smooth. Would recommend to any creator.", initials: "EL", color: "#ffd6e8", tag: "\U0001F1E8\U0001F1E6" },
  { name: "Carlos Ray", username: "@carl.r", body: "Got my fav short handle listed here. Trusted sellers, fast chat.", initials: "CR", color: "#c8f0d8", tag: "\U0001F1EA\U0001F1F8" },
  { name: "Lucas Stone", username: "@luc.s", body: "HandleHunt found what namecheckers missed. Straight fire.", initials: "LS", color: "#d4e4ff", tag: "\U0001F1EB\U0001F1F7" },
  { name: "Ana Miller", username: "@ana.m", body: "100% trusted workflow \u2014 scan, list, buy on Telegram. Simple.", initials: "AM", color: "#ffe0c2", tag: "\U0001F1E9\U0001F1EA" },
];

function TestimonialCard({ name, username, body, initials, color, tag }: (typeof testimonials)[number]) {
  return (
    <Card className="w-[220px] shrink-0 border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02]">
      <CardContent className="p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-black" style={{ background: color }}>
            {initials}
          </div>
          <div className="flex min-w-0 flex-col">
            <figcaption className="flex items-center gap-1 text-sm font-medium text-white">
              <span className="truncate">{name}</span>
              <span className="text-xs">{tag}</span>
            </figcaption>
            <p className="truncate text-xs font-medium text-white/45">{username}</p>
          </div>
        </div>
        <blockquote className="mt-3 text-sm leading-relaxed text-white/75">{body}</blockquote>
      </CardContent>
    </Card>
  );
}

export default function Testimonials3D() {
  return (
    <section className="relative w-full border-t border-white/10 bg-black py-16 overflow-hidden">
      <div className="px-5 md:px-16 mb-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">Social proof</p>
        <h2 className="font-italiana text-4xl md:text-5xl text-white mb-2">What hunters say</h2>
        <p className="text-white/60 text-sm max-w-xl">Creators who scanned, claimed, and bought rare Instagram handles through HandleHunt.</p>
      </div>
      <div className="relative mx-auto flex h-[380px] w-full max-w-5xl flex-row items-center justify-center overflow-hidden [perspective:320px]">
        <div className="flex flex-row items-center gap-3" style={{ transform: "translateX(-40px) translateY(0) translateZ(-80px) rotateX(18deg) rotateY(-8deg) rotateZ(12deg)" }}>
          <Marquee vertical pauseOnHover repeat={3} className="[--duration:38s] h-[420px]">
            {testimonials.map((t) => (<TestimonialCard key={t.username + "a"} {...t} />))}
          </Marquee>
          <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:42s] h-[420px]">
            {testimonials.map((t) => (<TestimonialCard key={t.username + "b"} {...t} />))}
          </Marquee>
          <Marquee vertical pauseOnHover repeat={3} className="[--duration:36s] h-[420px] hidden sm:flex">
            {testimonials.map((t) => (<TestimonialCard key={t.username + "c"} {...t} />))}
          </Marquee>
          <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:44s] h-[420px] hidden md:flex">
            {testimonials.map((t) => (<TestimonialCard key={t.username + "d"} {...t} />))}
          </Marquee>
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-black" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-black" />
      </div>
    </section>
  );
}

"use client";

import React, { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  ariaLabel?: string;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 2,
  ariaLabel,
  ...props
}: MarqueeProps) {
  const count = Math.max(2, repeat);

  return (
    <div
      {...props}
      data-slot="marquee"
      className={cn(
        "group flex overflow-hidden p-2 [--duration:32s] [--gap:0.75rem] [gap:var(--gap)]",
        vertical ? "flex-col" : "flex-row",
        className
      )}
      aria-label={ariaLabel}
      role="presentation"
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0}
          className={cn(
            "flex shrink-0 justify-around [gap:var(--gap)] will-change-transform",
            vertical ? "flex-col animate-marquee-vertical" : "flex-row animate-marquee",
            pauseOnHover ? "group-hover:[animation-play-state:paused]" : undefined,
            reverse ? "[animation-direction:reverse]" : undefined
          )}
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// Working public assets (Cloudinary cloud from the prompt is disabled)
const WORLD_BG =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80";
const PORTAL_BG =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80";
const CLOUDS_BG =
  "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&q=70";
const TELEGRAM = "https://t.me/rareinsta";

function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const curtainLRef = useRef<HTMLDivElement>(null);
  const curtainRRef = useRef<HTMLDivElement>(null);

  const [p, setP] = useState(0);
  const [uiVisible, setUiVisible] = useState(false);
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [entranceDone, setEntranceDone] = useState(false);

  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseSmooth = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);

  const onScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const max = el.scrollHeight - window.innerHeight;
    setP(clamp(max > 0 ? window.scrollY / max : 0, 0, 1));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  useEffect(() => {
    const t1 = setTimeout(() => setCurtainsOpen(true), 120);
    const t2 = setTimeout(() => setUiVisible(true), 650);
    const t3 = setTimeout(() => setEntranceDone(true), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseTarget.current = {
        x: (e.clientX - cx) / cx,
        y: (e.clientY - cy) / cy,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      mouseSmooth.current.x += (mouseTarget.current.x - mouseSmooth.current.x) * 0.07;
      mouseSmooth.current.y += (mouseTarget.current.y - mouseSmooth.current.y) * 0.07;
      const mx = mouseSmooth.current.x;
      const my = mouseSmooth.current.y;
      const el = containerRef.current;
      const max = el ? el.scrollHeight - window.innerHeight : 1;
      const e = easeInOut(clamp(max > 0 ? window.scrollY / max : 0, 0, 1));

      if (worldRef.current) {
        worldRef.current.style.transform =
          "translate(" + -mx * 6 + "px," + -my * 6 + "px) scale(" + lerp(1, 1.18, e) + ")";
      }
      if (cloudsRef.current) {
        cloudsRef.current.style.transform =
          "translate(" + -mx * 9 + "px," + -my * 3.6 + "px) scale(" + lerp(1, 1.35, e) + ")";
      }
      if (portalRef.current) {
        portalRef.current.style.transform =
          "translate(" + -mx * 7 + "px," + -my * 7 + "px) scale(" + lerp(1, 6.5, e) + ")";
      }
      if (curtainLRef.current) {
        const ox = curtainsOpen ? -70 : 0;
        curtainLRef.current.style.transform =
          "translate(" +
          (ox + lerp(0, 40, e) - mx * 10) +
          "%," +
          -my * 3 +
          "px) scale(" +
          lerp(1, 1.15, e) +
          ")";
      }
      if (curtainRRef.current) {
        const ox = curtainsOpen ? 70 : 0;
        curtainRRef.current.style.transform =
          "translate(" +
          (ox + lerp(0, -40, e) - mx * 10) +
          "%," +
          -my * 3 +
          "px) scale(" +
          lerp(1, 1.15, e) +
          ")";
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [curtainsOpen]);

  useEffect(() => {
    const style = entranceDone ? "none" : "transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)";
    if (curtainLRef.current) curtainLRef.current.style.transition = style;
    if (curtainRRef.current) curtainRRef.current.style.transition = style;
  }, [entranceDone, curtainsOpen]);

  const scene1 = clamp(1 - p / 0.22, 0, 1);
  const scene2 = clamp((p - 0.68) / 0.16, 0, 1);
  const portalOpacity = p < 0.55 ? 1 : clamp(1 - (p - 0.55) / 0.25, 0, 1);
  const cloudsOpacity = lerp(0.55, 0.95, clamp(p / 0.08, 0, 1));

  return (
    <div ref={containerRef} style={{ height: "480vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#0a0608",
        }}
      >
        {/* World */}
        <div ref={worldRef} style={{ position: "absolute", inset: 0, transformOrigin: "50% 50%" }}>
          <img
            src={WORLD_BG}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(10,6,8,0.35) 0%, rgba(10,6,8,0.15) 40%, rgba(10,6,8,0.55) 100%)",
            }}
          />
        </div>

        {/* Soft cloud layer */}
        <div
          ref={cloudsRef}
          style={{
            position: "absolute",
            bottom: "-5%",
            left: "-5%",
            right: "-5%",
            height: "55%",
            zIndex: 10,
            opacity: cloudsOpacity,
            transformOrigin: "50% 100%",
            pointerEvents: "none",
          }}
        >
          <img
            src={CLOUDS_BG}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center bottom",
              mixBlendMode: "screen",
              opacity: 0.55,
            }}
          />
        </div>

        {/* Portal / mid scene */}
        <div
          ref={portalRef}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 15,
            opacity: portalOpacity,
            transformOrigin: "52% 38%",
          }}
        >
          <img
            src={PORTAL_BG}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 52% 38%, transparent 0%, rgba(10,6,8,0.45) 70%)",
            }}
          />
        </div>

        {/* Bottom vignette */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "42%",
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            zIndex: 16,
            pointerEvents: "none",
          }}
        />

        {/* CSS velvet curtains (no external PNG) */}
        <div
          ref={curtainLRef}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "56%",
            zIndex: 18,
            transformOrigin: "left center",
            background:
              "linear-gradient(90deg, #1a0806 0%, #3a1510 35%, #5c1f18 55%, #2a0c08 85%, transparent 100%)",
            boxShadow: "inset -40px 0 60px rgba(0,0,0,0.45)",
            borderRight: "1px solid rgba(120,40,30,0.25)",
          }}
        />
        <div
          ref={curtainRRef}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: "56%",
            zIndex: 18,
            transformOrigin: "right center",
            background:
              "linear-gradient(270deg, #1a0806 0%, #3a1510 35%, #5c1f18 55%, #2a0c08 85%, transparent 100%)",
            boxShadow: "inset 40px 0 60px rgba(0,0,0,0.45)",
            borderLeft: "1px solid rgba(120,40,30,0.25)",
          }}
        />

        {/* Top fade */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "38vh",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
            zIndex: 45,
            pointerEvents: "none",
          }}
        />

        {/* Nav */}
        <nav
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 20px",
          }}
        >
          <span
            style={{
              fontFamily: "Imprima, sans-serif",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: 0.9,
            }}
          >
            Scan
          </span>
          <span
            style={{
              fontFamily: "Viaoda Libre, serif",
              fontSize: 18,
              letterSpacing: "0.08em",
            }}
          >
            HandleHunt
          </span>
          <a
            href={TELEGRAM}
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "Imprima, sans-serif",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#fff",
              textDecoration: "none",
              opacity: 0.9,
            }}
          >
            Buy
          </a>
        </nav>

        {/* Scene 1 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            opacity: scene1 * (uiVisible ? 1 : 0),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 24,
            transition: "opacity 0.9s ease",
            pointerEvents: scene1 > 0.05 ? "auto" : "none",
          }}
        >
          <div
            style={{
              fontFamily: "Viaoda Libre, serif",
              color: "#fff",
              textShadow: "0 2px 28px rgba(0,0,0,0.85)",
            }}
          >
            <div style={{ fontSize: "clamp(26px, 7vw, 42px)", letterSpacing: "0.12em" }}>
              HUNT <span style={{ color: "rgba(255,220,180,0.75)" }}>›</span> <em>RARE</em>
            </div>
            <div
              style={{
                fontSize: "clamp(48px, 14vw, 86px)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              HANDLES
            </div>
          </div>
          <p
            style={{
              fontFamily: "Imprima, sans-serif",
              fontSize: 16,
              lineHeight: 1.65,
              color: "rgba(255,245,235,0.9)",
              maxWidth: 320,
              marginTop: 18,
              textShadow: "0 1px 14px rgba(0,0,0,0.8)",
            }}
          >
            Scan 3–5 character Instagram usernames. Find what is still free. Buy rare ones on the
            marketplace.
          </p>
          <div
            style={{
              marginTop: 36,
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              opacity: 0.65,
            }}
          >
            DESCEND
          </div>
        </div>

        {/* Scene 2 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 46,
            opacity: scene2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "12vh",
            textAlign: "center",
            pointerEvents: scene2 > 0.2 ? "auto" : "none",
          }}
        >
          <h2
            style={{
              fontFamily: "Viaoda Libre, serif",
              fontSize: "clamp(28px, 8vw, 56px)",
              color: "#fff",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              margin: 0,
              maxWidth: "92%",
            }}
          >
            CLAIM WHAT IS STILL FREE
          </h2>
          <p
            style={{
              fontFamily: "Imprima, sans-serif",
              fontSize: 16,
              lineHeight: 1.6,
              maxWidth: 360,
              color: "rgba(255,255,255,0.85)",
              marginTop: 16,
            }}
          >
            Short handles move fast. Scan live, save projects, buy from the marketplace.
          </p>
          <a
            href={TELEGRAM}
            target="_blank"
            rel="noreferrer"
            style={{
              marginTop: 28,
              padding: "14px 28px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.35)",
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              fontFamily: "Imprima, sans-serif",
              fontSize: 13,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Open Marketplace
          </a>
        </div>
      </div>
    </div>
  );
}

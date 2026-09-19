"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const PORTAL_BG = "https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779707217/image_1_vdzwae.png";
const CURTAIN_LEFT = "https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706559/curtain_left_znkmva.png";
const CURTAIN_RIGHT = "https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706564/curtain_right_paeyym.png";
const WORLD_BG = "https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706392/image_2_gkcdlx.png";
const BOTTOM_CLOUDS = "https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706555/bottom_clouds_xskut6.png";
const TELEGRAM = "https://t.me/rareinsta";

function clamp(v: number, a: number, b: number) { return Math.min(b, Math.max(a, v)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function easeInOut(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

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
    const t1 = setTimeout(() => setCurtainsOpen(true), 100);
    const t2 = setTimeout(() => setUiVisible(true), 600);
    const t3 = setTimeout(() => setEntranceDone(true), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseTarget.current = { x: (e.clientX - cx) / cx, y: (e.clientY - cy) / cy };
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
      if (worldRef.current) worldRef.current.style.transform = "translate(" + (-mx * 6) + "px," + (-my * 6) + "px) scale(" + lerp(1, 1.18, e) + ")";
      if (cloudsRef.current) cloudsRef.current.style.transform = "translate(" + (-mx * 9) + "px," + (-my * 3.6) + "px) scale(" + lerp(1, 1.4, e) + ")";
      if (portalRef.current) portalRef.current.style.transform = "translate(" + (-mx * 7) + "px," + (-my * 7) + "px) scale(" + lerp(1, 7.5, e) + ")";
      if (curtainLRef.current) {
        const ox = curtainsOpen ? -62 : 0;
        curtainLRef.current.style.transform = "translate(" + (ox + lerp(0, 150, e) - mx * 14) + "%," + (-my * 4.2) + "px) scale(" + lerp(1, 1.3, e) + ")";
      }
      if (curtainRRef.current) {
        const ox = curtainsOpen ? 62 : 0;
        curtainRRef.current.style.transform = "translate(" + (ox + lerp(0, -150, e) - mx * 14) + "%," + (-my * 4.2) + "px) scale(" + lerp(1, 1.3, e) + ")";
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafRef.current); };
  }, [curtainsOpen]);

  useEffect(() => {
    const style = entranceDone ? "none" : "transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)";
    if (curtainLRef.current) curtainLRef.current.style.transition = style;
    if (curtainRRef.current) curtainRRef.current.style.transition = style;
  }, [entranceDone, curtainsOpen]);

  const scene1 = clamp(1 - p / 0.22, 0, 1);
  const scene2 = clamp((p - 0.68) / 0.16, 0, 1);
  const portalOpacity = p < 0.65 ? 1 : clamp(1 - (p - 0.65) / 0.2, 0, 1);
  const cloudsOpacity = lerp(0.7, 1, clamp(p / 0.05, 0, 1));

  return (
    <div ref={containerRef} style={{ height: "480vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#0a0608" }}>
        <div ref={worldRef} style={{ position: "absolute", inset: 0, transformOrigin: "50% 50%" }}>
          <img src={WORLD_BG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, #2a1810 0%, #0a0608 70%)", zIndex: -1 }} />
        </div>
        <div ref={cloudsRef} style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10, opacity: cloudsOpacity, transformOrigin: "50% 100%" }}>
          <img src={BOTTOM_CLOUDS} alt="" style={{ width: "100%", height: "auto", display: "block" }} />
        </div>
        <div ref={portalRef} style={{ position: "absolute", inset: 0, zIndex: 15, opacity: portalOpacity, transformOrigin: "52% 38%" }}>
          <img src={PORTAL_BG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "40%", background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)", zIndex: 16, pointerEvents: "none" }} />
        <div ref={curtainLRef} style={{ position: "absolute", inset: 0, zIndex: 16, transformOrigin: "left center" }}>
          <img src={CURTAIN_LEFT} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "right center" }} />
        </div>
        <div ref={curtainRRef} style={{ position: "absolute", inset: 0, zIndex: 16, transformOrigin: "right center" }}>
          <img src={CURTAIN_RIGHT} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "left center" }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "42vh", background: "linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)", zIndex: 45, pointerEvents: "none" }} />
        <nav style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px" }}>
          <span style={{ fontFamily: "Imprima, sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.9 }}>Scan</span>
          <span style={{ fontFamily: "Viaoda Libre, serif", fontSize: 18, letterSpacing: "0.08em" }}>HandleHunt</span>
          <a href={TELEGRAM} target="_blank" rel="noreferrer" style={{ fontFamily: "Imprima, sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff", textDecoration: "none", opacity: 0.9 }}>Buy</a>
        </nav>
        <div style={{ position: "absolute", inset: 0, zIndex: 20, opacity: scene1 * (uiVisible ? 1 : 0), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24, transition: "opacity 0.9s ease" }}>
          <div style={{ fontFamily: "Viaoda Libre, serif", color: "#fff", textShadow: "0 2px 24px rgba(0,0,0,0.7)" }}>
            <div style={{ fontSize: "clamp(26px, 7vw, 42px)", letterSpacing: "0.12em" }}>HUNT <span style={{ color: "rgba(255,220,180,0.7)" }}>›</span> <em>RARE</em></div>
            <div style={{ fontSize: "clamp(48px, 14vw, 86px)", letterSpacing: "-0.02em", lineHeight: 1 }}>HANDLES</div>
          </div>
          <p style={{ fontFamily: "Imprima, sans-serif", fontSize: 16, lineHeight: 1.6, color: "rgba(255,245,235,0.88)", maxWidth: 320, marginTop: 18 }}>Scan 3–5 character Instagram usernames. Find what is still free. Buy rare ones on the marketplace.</p>
          <div style={{ marginTop: 36, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.65 }}>DESCEND</div>
        </div>
        <div style={{ position: "absolute", inset: 0, zIndex: 46, opacity: scene2, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "12vh", textAlign: "center", pointerEvents: scene2 > 0.2 ? "auto" : "none" }}>
          <h2 style={{ fontFamily: "Viaoda Libre, serif", fontSize: "clamp(28px, 8vw, 56px)", color: "#fff", textShadow: "0 2px 20px rgba(0,0,0,0.4)", margin: 0 }}>CLAIM WHAT IS STILL FREE</h2>
          <p style={{ fontFamily: "Imprima, sans-serif", fontSize: 16, lineHeight: 1.6, maxWidth: 360, color: "rgba(255,255,255,0.82)", marginTop: 16 }}>Short handles move fast. Scan live, save projects, buy from the marketplace.</p>
          <a href={TELEGRAM} target="_blank" rel="noreferrer" style={{ marginTop: 28, padding: "14px 28px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.08)", color: "#fff", fontFamily: "Imprima, sans-serif", fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none" }}>Open Marketplace</a>
        </div>
      </div>
    </div>
  );
}

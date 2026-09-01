"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type TrailBit = { id: number; x: number; y: number; char: "0" | "1" };
type Ripple = { id: number; x: number; y: number };

/**
 * Targeting-reticle cursor for the Hackurity page.
 *
 * A solid, high-contrast crosshair (tan, dark halo) tracks the pointer 1:1, a
 * lagged bracket ring springs in behind it and locks blue over interactive
 * elements, and a short binary trail streams out as you move. The native cursor
 * is hidden only while this component is mounted (it toggles a class on <html>).
 * Renders nothing on touch / coarse-pointer devices.
 */
export default function CyberCursor() {
  const [enabled, setEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);
  const [visible, setVisible] = useState(false);
  const [bits, setBits] = useState<TrailBit[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const seed = useRef(0);

  // Raw pointer position — the crosshair sticks to this exactly.
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  // The bracket ring trails with a spring for that "acquiring lock" feel.
  const ringX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.7 });
  const ringY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.7 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(rm.matches);
    const onRm = () => setReducedMotion(rm.matches);
    rm.addEventListener("change", onRm);

    setEnabled(true);
    document.documentElement.classList.add("cyber-cursor-active");

    let lastBit = 0;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const el = e.target as HTMLElement | null;
      setHovering(
        !!el?.closest(
          'a, button, input, select, textarea, label, summary, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])'
        )
      );

      if (!rm.matches) {
        const now = e.timeStamp;
        if (now - lastBit > 85) {
          lastBit = now;
          const id = ++seed.current;
          setBits((prev) => [
            ...prev.slice(-16),
            { id, x: e.clientX, y: e.clientY, char: Math.random() > 0.5 ? "1" : "0" },
          ]);
          window.setTimeout(
            () => setBits((prev) => prev.filter((b) => b.id !== id)),
            620
          );
        }
      }
    };

    const onDown = (e: MouseEvent) => {
      setDown(true);
      const id = ++seed.current;
      setRipples((prev) => [...prev.slice(-4), { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(
        () => setRipples((prev) => prev.filter((r) => r.id !== id)),
        550
      );
    };
    const onUp = () => setDown(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      rm.removeEventListener("change", onRm);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("cyber-cursor-active");
    };
  }, [x, y]);

  if (!enabled) return null;

  const accent = hovering ? "#6366f1" : "#d2b48c";
  const ring = hovering ? 48 : 32;
  const halo = "drop-shadow(0 0 2px rgba(0,0,0,0.95))";

  const corners = [
    { k: "tl", css: { top: 0, left: 0, borderTop: "2px solid", borderLeft: "2px solid" } },
    { k: "tr", css: { top: 0, right: 0, borderTop: "2px solid", borderRight: "2px solid" } },
    { k: "bl", css: { bottom: 0, left: 0, borderBottom: "2px solid", borderLeft: "2px solid" } },
    { k: "br", css: { bottom: 0, right: 0, borderBottom: "2px solid", borderRight: "2px solid" } },
  ] as const;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[99999] hidden overflow-hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 160ms linear" }}
    >
      {/* Binary exhaust trail */}
      {bits.map((b) => (
        <motion.span
          key={b.id}
          initial={{ opacity: 0.75, scale: 1 }}
          animate={{ opacity: 0, scale: 0.55, y: -22 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ left: b.x, top: b.y, filter: halo }}
          className="absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] font-bold text-cyber-blue"
        >
          {b.char}
        </motion.span>
      ))}

      {/* Click ripple */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ opacity: 0.6, width: 10, height: 10 }}
          animate={{ opacity: 0, width: 64, height: 64 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ left: r.x, top: r.y, borderColor: accent }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rotate-45 border"
        />
      ))}

      {/* Lagged bracket ring */}
      <motion.div style={{ x: ringX, y: ringY }} className="absolute left-0 top-0">
        <motion.div
          animate={{ width: ring, height: ring, marginLeft: -ring / 2, marginTop: -ring / 2 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="absolute left-0 top-0"
        >
          <motion.div
            animate={reducedMotion ? { rotate: down ? 45 : 0 } : { rotate: 360 }}
            transition={
              reducedMotion
                ? { type: "spring", stiffness: 200, damping: 18 }
                : { duration: hovering ? 4 : 13, repeat: Infinity, ease: "linear" }
            }
            className="h-full w-full"
          >
            {corners.map((c) => (
              <span
                key={c.k}
                className="absolute h-2.5 w-2.5"
                style={{ borderColor: accent, filter: halo, ...c.css }}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 1:1 crosshair + core */}
      <motion.div style={{ x, y }} className="absolute left-0 top-0">
        <div className="absolute left-0 top-0 -ml-6 -mt-6 flex h-12 w-12 items-center justify-center">
          <span
            className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2"
            style={{ background: `linear-gradient(90deg,transparent,${accent},transparent)`, filter: halo }}
          />
          <span
            className="absolute left-1/2 top-1/2 h-6 w-px -translate-x-1/2 -translate-y-1/2"
            style={{ background: `linear-gradient(180deg,transparent,${accent},transparent)`, filter: halo }}
          />
          <motion.span
            animate={{ scale: down ? 0.45 : 1, backgroundColor: accent }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="block h-[7px] w-[7px] rounded-full"
            style={{ boxShadow: "0 0 0 2px rgba(0,0,0,0.9), 0 0 10px currentColor", color: accent }}
          />
          {hovering && (
            <motion.span
              initial={{ opacity: 0, x: 3 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute left-[26px] top-[6px] whitespace-nowrap font-mono text-[9px] font-bold tracking-[0.22em] text-cyber-blue"
              style={{ filter: halo }}
            >
              // LOCK
            </motion.span>
          )}
        </div>
      </motion.div>
    </div>
  );
}

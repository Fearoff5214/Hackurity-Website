"use client";
import { useEffect, useRef } from "react";

/**
 * Cursor-reactive binary flow background.
 * - Idle: bits drift gently upward and twinkle (Hackurity look).
 * - On mouse move: the whole field is pulled toward the cursor direction and
 *   bits near the pointer brighten, then it eases back to the idle drift.
 * Colour scheme matches the Hackurity theme (indigo + tan, magenta glitter).
 */

type Bit = {
  x: number;
  y: number;
  size: number;
  speed: number;
  phase: number;
  twinkle: number;
  char: string;
  hue: "blue" | "tan";
  depth: number;
};

type Spark = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
};

export default function BinaryFlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let bits: Bit[] = [];
    let sparks: Spark[] = [];
    let frameId = 0;

    // Pointer state
    const pointer = { x: -9999, y: -9999, active: false };
    // Flow direction that the field eases toward (idle = upward drift)
    const flow = { x: 0, y: -1 };
    const target = { x: 0, y: -1 };
    let energy = 0; // 0 = idle, 1 = fully cursor-driven

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = width < 640 ? 6200 : 3900;
      const count = Math.round((width * height) / density);
      bits = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 8 + Math.random() * 7,
        speed: 0.08 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.006 + Math.random() * 0.02,
        char: Math.random() > 0.5 ? "1" : "0",
        hue: Math.random() > 0.32 ? "blue" : "tan",
        depth: 0.45 + Math.random() * 0.9,
      }));

      const sparkCount = width < 640 ? 18 : 38;
      sparks = Array.from({ length: sparkCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.7 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    let lastX = 0;
    let lastY = 0;
    let idleTimer = 0;

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;

      const len = Math.hypot(dx, dy);
      if (len > 0.6) {
        target.x = dx / len;
        target.y = dy / len;
        energy = Math.min(1, energy + Math.min(len / 55, 0.4));
      }

      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        pointer.active = false;
        target.x = 0;
        target.y = -1;
      }, 550);
    };

    const wrap = (bit: Bit) => {
      const pad = 24;
      if (bit.x < -pad) bit.x = width + pad;
      if (bit.x > width + pad) bit.x = -pad;
      if (bit.y < -pad) {
        bit.y = height + pad;
        bit.char = Math.random() > 0.5 ? "1" : "0";
      }
      if (bit.y > height + pad) bit.y = -pad;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Ease flow direction and energy
      flow.x += (target.x - flow.x) * 0.05;
      flow.y += (target.y - flow.y) * 0.05;
      if (!pointer.active) energy *= 0.965;

      const pullRadius = Math.min(width, height) * 0.32;

      for (const bit of bits) {
        bit.phase += bit.twinkle;
        const twinkle = Math.sin(bit.phase) * 0.5 + 0.5;

        // Base idle drift + cursor-driven flow
        const drive = 0.55 + energy * 2.6;
        bit.x += flow.x * bit.speed * bit.depth * drive;
        bit.y += flow.y * bit.speed * bit.depth * drive;
        wrap(bit);

        // Local brightening near the pointer
        let proximity = 0;
        if (pointer.active) {
          const dist = Math.hypot(bit.x - pointer.x, bit.y - pointer.y);
          if (dist < pullRadius) proximity = 1 - dist / pullRadius;
        }

        const alpha = Math.min(
          0.95,
          0.12 + twinkle * 0.45 + proximity * 0.5 * (0.4 + energy),
        );
        const color = bit.hue === "blue" ? "99,102,241" : "210,180,140";
        const size = bit.size + proximity * 2.5;

        ctx.font = `${size}px "JetBrains Mono", Consolas, monospace`;
        ctx.shadowBlur = 10 + proximity * 12;
        ctx.shadowColor = `rgba(${color},${alpha * 0.85})`;
        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.fillText(bit.char, bit.x, bit.y);
      }

      for (const spark of sparks) {
        spark.phase += 0.035;
        spark.x += spark.vx + flow.x * energy * 1.4;
        spark.y += spark.vy + flow.y * energy * 1.4;
        if (spark.x < -10) spark.x = width + 10;
        if (spark.x > width + 10) spark.x = -10;
        if (spark.y < -10) spark.y = height + 10;
        if (spark.y > height + 10) spark.y = -10;

        const alpha = 0.2 + (Math.sin(spark.phase) * 0.5 + 0.5) * 0.6;
        ctx.beginPath();
        ctx.shadowBlur = 14;
        ctx.shadowColor = `rgba(217,70,239,${alpha})`;
        ctx.fillStyle = `rgba(240,120,255,${alpha})`;
        ctx.arc(spark.x, spark.y, spark.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      frameId = requestAnimationFrame(draw);
    };

    build();
    if (reduceMotion) {
      // Draw a single static frame only.
      ctx.clearRect(0, 0, width, height);
      for (const bit of bits) {
        const color = bit.hue === "blue" ? "99,102,241" : "210,180,140";
        ctx.font = `${bit.size}px "JetBrains Mono", Consolas, monospace`;
        ctx.fillStyle = `rgba(${color},0.28)`;
        ctx.fillText(bit.char, bit.x, bit.y);
      }
    } else {
      frameId = requestAnimationFrame(draw);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    const onResize = () => build();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(idleTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(99,102,241,0.18)_0%,transparent_55%),radial-gradient(circle_at_85%_28%,rgba(210,180,140,0.12)_0%,transparent_52%),radial-gradient(circle_at_50%_105%,rgba(217,70,239,0.10)_0%,transparent_58%)]" />
      <div className="cyber-grid absolute inset-0 opacity-70" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-80" />
      <div className="absolute inset-0 bg-black/45" />
    </div>
  );
}

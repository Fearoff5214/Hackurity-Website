"use client";

import React, { useEffect, useRef } from "react";

/**
 * Animated site background.
 * - Glowing binary "stars" (1s and 0s) that twinkle and drift upward.
 * - Magenta glitter sparks that float around the page.
 * - Soft blue / tan gradient glows on the sides and centre (pure CSS layers).
 * Rendered fixed behind all content, fully non-interactive.
 */

type Star = {
  x: number;
  y: number;
  size: number;
  speed: number;
  phase: number;
  twinkle: number;
  bit: string;
  hue: "blue" | "tan";
};

type Spark = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
};

export default function BinaryStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let sparks: Spark[] = [];
    let frame = 0;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = width < 640 ? 5500 : 3600;
      const starCount = Math.round((width * height) / density);
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 8 + Math.random() * 7,
        speed: 0.08 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.006 + Math.random() * 0.02,
        bit: Math.random() > 0.5 ? "1" : "0",
        hue: Math.random() > 0.32 ? "blue" : "tan",
      }));

      const sparkCount = width < 640 ? 22 : 44;
      sparks = Array.from({ length: sparkCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.7 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);

      // Binary stars
      for (const star of stars) {
        star.phase += star.twinkle;
        const alpha = 0.14 + (Math.sin(star.phase) * 0.5 + 0.5) * 0.5;
        star.y -= star.speed;
        if (star.y < -20) {
          star.y = height + 20;
          star.x = Math.random() * width;
          star.bit = Math.random() > 0.5 ? "1" : "0";
        }

        const color = star.hue === "blue" ? "99,102,241" : "210,180,140";
        ctx.font = `${star.size}px "JetBrains Mono", Consolas, monospace`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${color},${alpha * 0.85})`;
        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.fillText(star.bit, star.x, star.y);
      }

      // Magenta glitter
      for (const spark of sparks) {
        spark.phase += 0.035;
        spark.x += spark.vx;
        spark.y += spark.vy;
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
      if (!reduceMotion || frame < 2) {
        animationId = requestAnimationFrame(draw);
      }
    };

    let animationId = 0;
    build();
    animationId = requestAnimationFrame(draw);

    const onResize = () => build();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base gradient wash: blue + tan, with a whisper of magenta */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(99,102,241,0.16)_0%,transparent_55%),radial-gradient(circle_at_85%_28%,rgba(210,180,140,0.12)_0%,transparent_52%),radial-gradient(circle_at_50%_105%,rgba(217,70,239,0.10)_0%,transparent_58%)]" />
      {/* Side glows */}
      <div className="absolute left-0 top-0 h-full w-[22%] bg-gradient-to-r from-cyber-blue/12 to-transparent blur-2xl" />
      <div className="absolute right-0 top-0 h-full w-[22%] bg-gradient-to-l from-cyber-tan/10 to-transparent blur-2xl" />
      {/* Animated binary starfield */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-80" />
      {/* Readability veil so text stays crisp */}
      <div className="absolute inset-0 bg-cyber-black/45" />
    </div>
  );
}

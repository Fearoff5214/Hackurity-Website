"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

// Corner Crosshairs Component (Tan color)
export function CornerCrosshairs() {
  return (
    <>
      <span className="absolute top-2 left-2 text-[13px] text-cyber-tan/40 select-none pointer-events-none font-mono">+</span>
      <span className="absolute top-2 right-2 text-[13px] text-cyber-tan/40 select-none pointer-events-none font-mono">+</span>
      <span className="absolute bottom-2 left-2 text-[13px] text-cyber-tan/40 select-none pointer-events-none font-mono">+</span>
      <span className="absolute bottom-2 right-2 text-[13px] text-cyber-tan/40 select-none pointer-events-none font-mono">+</span>
    </>
  );
}

// Technical Bracket Frame (Tan color)
export function BracketFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative p-4 border border-cyber-blue/10 bg-cyber-black/80 bracket-container ${className}`}>
      {/* Corner angle brackets in Tan */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyber-tan pointer-events-none" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyber-tan pointer-events-none" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyber-tan pointer-events-none" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyber-tan pointer-events-none" />
      {children}
    </div>
  );
}

// Typing text effect (Blue/Tan cursor)
export function TypewriterText({ text, delay = 0.03, startDelay = 0, className = "" }: { text: string; delay?: number; startDelay?: number; className?: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let timeoutId: NodeJS.Timeout;
    const runTyping = () => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText((prev) => prev + text.charAt(index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, delay * 1000);
      return () => clearInterval(interval);
    };

    if (startDelay > 0) {
      timeoutId = setTimeout(runTyping, startDelay * 1000);
    } else {
      runTyping();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [text, delay, startDelay, isInView]);

  return (
    <span ref={ref} className={`${className}`}>
      {displayedText}
      <span className="inline-block w-1.5 h-4 ml-0.5 bg-cyber-blue animate-[terminal-cursor_1s_step-end_infinite]" />
    </span>
  );
}

// Flashing status dot (Tan color status dot)
export function StatusDot({ statusText = "SYSTEM ACTIVE", active = true }: { statusText?: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 border border-cyber-tan/20 bg-cyber-dark/85 font-mono text-[13px] tracking-widest text-cyber-tan">
      <span className="relative flex h-2 w-2">
        {active && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-tan opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${active ? "bg-cyber-tan" : "bg-red-500"}`}></span>
      </span>
      <span>{statusText}</span>
    </div>
  );
}

// Sine Wave Loader Canvas Component (Blue color wave)
export function SineWaveLoader({ width = 120, height = 24 }: { width?: number; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw grid lines in canvas background
      ctx.strokeStyle = "rgba(255, 71, 87, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < width; i += 10) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
      }
      for (let i = 0; i < height; i += 8) {
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
      }
      ctx.stroke();

      // Draw primary glowing sine wave (Blue)
      ctx.strokeStyle = "#ff4757";
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 4;
      ctx.shadowColor = "#ff4757";
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin(x * 0.08 + offset) * 6;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Draw second dim wave
      ctx.strokeStyle = "rgba(255, 71, 87, 0.2)";
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin(x * 0.12 - offset * 1.5) * 4;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      offset += 0.05;
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [width, height]);

  return <canvas ref={canvasRef} width={width} height={height} className="opacity-80" />;
}

// Simulated Loading Bar Component (Blue/Tan glow)
export function SimulatedLoadingBar({ value = 75, label = "CORE TEMP" }: { value?: number; label?: string }) {
  return (
    <div className="w-full font-mono text-[13px] text-cyber-gray">
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span className="text-cyber-tan font-bold">{value}%</span>
      </div>
      <div className="h-2 w-full bg-cyber-dark border border-cyber-blue/20 relative">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="h-full bg-cyber-blue shadow-[0_0_8px_#ff4757]"
        />
        {/* Dash lines over loading bar */}
        <div className="absolute inset-0 bg-transparent flex justify-between pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-full w-[1px] bg-cyber-black/40" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Dual-tone circuit-trace backdrop — green traces on the left half, red on the
// right, used behind the hero to sell the "defend vs. attack" split.
export function CircuitField() {
  const uid = React.useId().replace(/:/g, "");
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.28]">
      <div className="absolute inset-y-0 left-0 w-1/2 text-cyber-tan">
        <svg className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <pattern id={`circuit-l-${uid}`} width="64" height="64" patternUnits="userSpaceOnUse">
              <path
                d="M0 32H20M20 32V12H44M44 12H64M0 48H28M28 48V60H64M32 0V20H52V64"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <circle cx="20" cy="32" r="2" fill="currentColor" />
              <circle cx="44" cy="12" r="2" fill="currentColor" />
              <circle cx="28" cy="48" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#circuit-l-${uid})`} />
        </svg>
      </div>
      <div className="absolute inset-y-0 right-0 w-1/2 text-cyber-blue">
        <svg className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <pattern id={`circuit-r-${uid}`} width="64" height="64" patternUnits="userSpaceOnUse">
              <path
                d="M64 32H44M44 32V12H20M20 12H0M64 48H36M36 48V60H0M32 0V20H12V64"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <circle cx="44" cy="32" r="2" fill="currentColor" />
              <circle cx="20" cy="12" r="2" fill="currentColor" />
              <circle cx="36" cy="48" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#circuit-r-${uid})`} />
        </svg>
      </div>
    </div>
  );
}

// Split shield-and-padlock emblem — green half (defend) / red half (attack)
// with a padlock centered on the seam.
export function ShieldLockEmblem({ className = "h-40 w-40 md:h-52 md:w-52" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden="true">
      <path d="M100 8 L20 34 V110 C20 158 55 192 100 212 V8Z" fill="#2ecc71" fillOpacity="0.06" stroke="#2ecc71" strokeWidth="2.5" />
      <path d="M100 8 L180 34 V110 C180 158 145 192 100 212 V8Z" fill="#ff4757" fillOpacity="0.06" stroke="#ff4757" strokeWidth="2.5" />
      <path d="M100 8V212" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="3 4" />
      <rect x="78" y="110" width="44" height="36" rx="4" fill="#0b0b16" stroke="#ffffff" strokeOpacity="0.9" strokeWidth="2.5" />
      <path d="M86 110V96a14 14 0 0 1 28 0v14" fill="none" stroke="#ffffff" strokeOpacity="0.9" strokeWidth="2.5" />
      <circle cx="100" cy="126" r="4" fill="#ffffff" fillOpacity="0.9" />
      <path d="M100 130v8" stroke="#ffffff" strokeOpacity="0.9" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// Small bordered icon badge used for the bug / lock / terminal row under the hero eyebrow.
export function IconBadge({ children, tone = "tan" }: { children: React.ReactNode; tone?: "tan" | "blue" }) {
  const border = tone === "tan" ? "border-cyber-tan/40 text-cyber-tan" : "border-cyber-blue/40 text-cyber-blue";
  return (
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center border bg-cyber-black/50 ${border}`}>
      {children}
    </span>
  );
}

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const BugGlyph = () => (
  <svg {...iconProps} className="h-5 w-5">
    <rect x="8" y="7" width="8" height="11" rx="4" />
    <path d="M9 8l-2-2M15 8l2-2M9 16l-3 2M15 16l3 2M12 7V4M8 11H4M20 11h-4M8 14H5M19 14h-3" />
  </svg>
);

export const LockGlyph = () => (
  <svg {...iconProps} className="h-5 w-5">
    <rect x="5" y="10.5" width="14" height="9.5" rx="1.5" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    <circle cx="12" cy="15" r="1.4" />
  </svg>
);

export const TerminalGlyph = () => (
  <svg {...iconProps} className="h-5 w-5">
    <rect x="3" y="4" width="18" height="16" rx="1.5" />
    <path d="M7 9l4 3-4 3M13 15h4" />
  </svg>
);

export const CalendarGlyph = () => (
  <svg {...iconProps} className="h-5 w-5">
    <rect x="3.5" y="5" width="17" height="16" rx="1.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);

export const PinGlyph = () => (
  <svg {...iconProps} className="h-5 w-5">
    <path d="M12 21s7-6.5 7-11.5a7 7 0 1 0-14 0C5 14.5 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.4" />
  </svg>
);

export const PeopleGlyph = () => (
  <svg {...iconProps} className="h-5 w-5">
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="10" r="2.2" />
    <path d="M3.5 20c0-3 2.4-5.2 5.5-5.2S14.5 17 14.5 20" />
    <path d="M14.8 20c.2-2.4 1.7-4.1 3.6-4.1S21.8 17.6 22 20" />
  </svg>
);

export const CodeGlyph = () => (
  <svg {...iconProps} className="h-5 w-5">
    <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" />
  </svg>
);

// Technical Data Table Rows (Tan/Blue headers and highlights)
export function TechTable({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return (
    <div className="w-full border border-cyber-blue/10 bg-cyber-dark/40 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-cyber-tan/25 bg-cyber-tan/5 text-[13px] tracking-wider text-cyber-tan font-bold font-mono">
        <span>// {title}</span>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-cyber-tan/60 rounded-full" />
          <span className="w-1.5 h-1.5 bg-cyber-tan/30 rounded-full animate-ping" />
        </div>
      </div>
      <table className="w-full text-left font-mono text-xs select-none">
        <thead>
          <tr className="border-b border-cyber-blue/10 bg-cyber-black text-cyber-gray/50 text-[13px] uppercase">
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: rowIndex * 0.08 }}
              viewport={{ once: true, margin: "-50px" }}
              className="border-b border-cyber-blue/5 hover:bg-cyber-blue/5 transition-colors group"
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={`px-3 py-2 ${cellIndex === 0 ? "text-white font-bold" : cellIndex === row.length - 1 ? "text-cyber-tan font-bold text-glow-tan" : "text-cyber-gray"}`}>
                  {cellIndex === 0 && <span className="text-cyber-blue/20 group-hover:text-cyber-blue mr-1 transition-colors">▶</span>}
                  {cell}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

// Corner Crosshairs Component (Tan color)
export function CornerCrosshairs() {
  return (
    <>
      <span className="absolute top-2 left-2 text-[10px] text-cyber-tan/40 select-none pointer-events-none font-mono">+</span>
      <span className="absolute top-2 right-2 text-[10px] text-cyber-tan/40 select-none pointer-events-none font-mono">+</span>
      <span className="absolute bottom-2 left-2 text-[10px] text-cyber-tan/40 select-none pointer-events-none font-mono">+</span>
      <span className="absolute bottom-2 right-2 text-[10px] text-cyber-tan/40 select-none pointer-events-none font-mono">+</span>
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
    <div className="flex items-center gap-2 px-3 py-1 border border-cyber-tan/20 bg-cyber-dark/85 font-mono text-[10px] tracking-widest text-cyber-tan">
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
      ctx.strokeStyle = "rgba(99, 102, 241, 0.05)";
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
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 4;
      ctx.shadowColor = "#6366f1";
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
      ctx.strokeStyle = "rgba(99, 102, 241, 0.2)";
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
    <div className="w-full font-mono text-[10px] text-cyber-gray">
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
          className="h-full bg-cyber-blue shadow-[0_0_8px_#6366f1]"
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

// Technical Data Table Rows (Tan/Blue headers and highlights)
export function TechTable({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return (
    <div className="w-full border border-cyber-blue/10 bg-cyber-dark/40 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-cyber-tan/25 bg-cyber-tan/5 text-[10px] tracking-wider text-cyber-tan font-bold font-mono">
        <span>// {title}</span>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-cyber-tan/60 rounded-full" />
          <span className="w-1.5 h-1.5 bg-cyber-tan/30 rounded-full animate-ping" />
        </div>
      </div>
      <table className="w-full text-left font-mono text-xs select-none">
        <thead>
          <tr className="border-b border-cyber-blue/10 bg-cyber-black text-cyber-gray/50 text-[10px] uppercase">
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

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Build window opens 14 Oct 2026, 09:00 IST.
const TARGET = new Date("2026-10-14T09:00:00+05:30").getTime();

function useCountdown() {
  // Start at 0 on both server and client so the first paint always matches —
  // the real value is filled in after mount, avoiding a hydration mismatch
  // from the server/client clocks ticking a second or two apart.
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, TARGET - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const seconds = Math.floor(remaining / 1000);
  return [
    { label: "DAYS", value: Math.floor(seconds / 86400) },
    { label: "HRS", value: Math.floor((seconds % 86400) / 3600) },
    { label: "MIN", value: Math.floor((seconds % 3600) / 60) },
    { label: "SEC", value: seconds % 60 },
  ];
}

export default function HackurityCountdown() {
  const units = useCountdown();

  return (
    <div className="border border-cyber-tan/25 bg-cyber-black/40 p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-cyber-tan/25 pb-2 font-mono text-[13px] tracking-[0.2em] uppercase">
        <span className="font-bold text-cyber-tan">// T-MINUS TO BUILD WINDOW</span>
        <span className="border border-cyber-tan/40 bg-cyber-tan/10 px-2 py-0.5 font-bold text-white">14 OCT · 09:00 IST</span>
      </div>
      <div className="grid grid-cols-4 gap-px bg-white/10">
        {units.map((unit, i) => {
          const tone = i < 2 ? "tan" : "blue";
          return (
            <div
              key={unit.label}
              className={`flex flex-col items-center gap-1 bg-cyber-black/70 px-1 py-2.5 border-t-2 ${
                tone === "tan" ? "border-cyber-tan/70" : "border-cyber-blue/70"
              }`}
            >
              <motion.span
                key={unit.value}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`font-heading text-xl md:text-2xl tabular-nums ${
                  tone === "tan" ? "text-cyber-tan" : "text-cyber-blue"
                }`}
              >
                {String(unit.value).padStart(2, "0")}
              </motion.span>
              <span className="font-mono text-[11px] tracking-widest text-cyber-gray">{unit.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

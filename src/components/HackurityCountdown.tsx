"use client";

import { useEffect, useState } from "react";

// Build window opens 15 Oct 2026, 09:00 IST.
const TARGET = new Date("2026-10-15T09:00:00+05:30").getTime();

function useCountdown() {
  const [remaining, setRemaining] = useState(() => Math.max(0, TARGET - Date.now()));

  useEffect(() => {
    const id = window.setInterval(() => setRemaining(Math.max(0, TARGET - Date.now())), 1000);
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
    <div className="border border-cyber-blue/20 bg-cyber-black/40 p-3">
      <div className="mb-2 flex items-center justify-between font-mono text-[12px] tracking-[0.2em] text-cyber-tan/80 uppercase">
        <span>// T-MINUS TO BUILD WINDOW</span>
        <span className="hidden sm:inline text-cyber-blue/70">15 OCT 09:00 IST</span>
      </div>
      <div className="grid grid-cols-4 gap-px bg-cyber-blue/15">
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center gap-1 bg-cyber-black/70 px-1 py-2.5">
            <span className="font-heading text-xl text-white md:text-2xl tabular-nums">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="font-mono text-[11px] tracking-widest text-cyber-gray">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

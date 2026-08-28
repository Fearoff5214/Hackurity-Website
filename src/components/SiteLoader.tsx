"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "Establishing secure connection",
  "Authenticating visitor",
  "Decrypting mission archive",
  "Loading operations facility",
];

export default function SiteLoader() {
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const progressTimer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) return 100;
        const step = current > 80 ? 2 : 4 + Math.random() * 5;
        return Math.min(100, current + step);
      });
    }, 70);

    const lineTimer = window.setInterval(() => {
      setLineIndex((index) => Math.min(BOOT_LINES.length - 1, index + 1));
    }, 620);

    return () => {
      window.clearInterval(progressTimer);
      window.clearInterval(lineTimer);
    };
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    const exit = window.setTimeout(() => setDone(true), 420);
    return () => window.clearTimeout(exit);
  }, [progress]);

  useEffect(() => {
    document.body.style.overflow = done ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="site-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "brightness(2)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cyber-black px-6"
        >
          {/* Scan sweep */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-cyber-blue/10 to-transparent"
            animate={{ top: ["-15%", "110%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 cyber-grid opacity-60" />

          <div className="relative flex w-full max-w-md flex-col items-center gap-6">
            <svg
              viewBox="0 0 100 100"
              className="h-14 w-14 fill-none stroke-cyber-tan stroke-[6] drop-shadow-[0_0_10px_rgba(210,180,140,0.5)]"
            >
              <motion.polygon
                points="50,15 85,80 15,80"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <polygon points="50,40 70,80 30,80" className="stroke-[4] opacity-60" />
            </svg>

            <div className="text-center">
              <motion.h1
                initial={{ letterSpacing: "0.6em", opacity: 0 }}
                animate={{ letterSpacing: "0.25em", opacity: 1 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="font-heading text-sm text-white uppercase sm:text-base"
              >
                HACKURITY
              </motion.h1>
              <div className="mt-2 flex items-center justify-center gap-2.5">
                <span className="font-mono text-[11px] tracking-[0.35em] text-cyber-gray lowercase sm:text-xs">
                  powered by
                </span>
                <img src="/sponsors/IBMBOB.jpg" alt="IBM Bob" className="h-9 w-auto object-contain sm:h-10" />
              </div>
            </div>

            <div className="w-full">
              <div className="mb-2 flex items-end justify-between font-mono text-[11px] text-cyber-gray">
                <span className="text-cyber-blue">
                  &gt; {BOOT_LINES[lineIndex]}
                  <span className="ml-0.5 animate-pulse text-cyber-tan">▌</span>
                </span>
                <span className="font-bold text-cyber-tan">{Math.round(progress)}%</span>
              </div>
              <div className="h-1 w-full bg-cyber-blue-dim">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyber-blue to-cyber-tan"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <div className="mt-3 flex justify-between font-mono text-[9px] tracking-widest text-cyber-gray/60">
                <span>AES-256 // CHANNEL SECURE</span>
                <span>NODE_HACKURITY_045</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
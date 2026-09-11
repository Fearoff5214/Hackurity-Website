"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "@/components/SiteNav";
import { useScrollSpy } from "@/components/useScrollSpy";

// Fixed vertical dot-nav rail on the right edge — desktop only. Mirrors the
// HUD-style side rail seen on ChainGPT: one dot per section, the active one
// grows and glows, a connecting trunk line fills up to the active dot, and
// hovering (or being active) reveals the section label to the left.
const RAIL_SECTIONS = navLinks.filter((link) => link.href.startsWith("#"));

export default function SideDotNav() {
  const [currentSection] = useScrollSpy(RAIL_SECTIONS, RAIL_SECTIONS[0]?.name ?? "");
  const [hovered, setHovered] = useState<string | null>(null);

  const activeIndex = Math.max(0, RAIL_SECTIONS.findIndex((link) => link.name === currentSection));
  const fillPercent = RAIL_SECTIONS.length > 1 ? (activeIndex / (RAIL_SECTIONS.length - 1)) * 100 : 0;

  return (
    <nav
      aria-label="Section navigation"
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:right-8"
    >
      <div className="relative flex flex-col items-center gap-5 py-2">
        {/* trunk track + fill */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-cyber-blue/15" />
        <motion.div
          className="absolute left-1/2 top-0 w-px origin-top -translate-x-1/2 bg-cyber-tan/70"
          initial={false}
          animate={{ height: `${fillPercent}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
        />

        {RAIL_SECTIONS.map((link) => {
          const isActive = currentSection === link.name;
          const showLabel = hovered === link.name || isActive;
          return (
            <a
              key={link.name}
              href={link.href}
              onMouseEnter={() => setHovered(link.name)}
              onMouseLeave={() => setHovered(null)}
              aria-label={link.label}
              aria-current={isActive ? "true" : undefined}
              className="pointer-events-auto relative flex h-3 w-3 items-center justify-center"
            >
              <AnimatePresence>
                {showLabel && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-full mr-3 whitespace-nowrap border border-cyber-tan/25 bg-cyber-black/85 px-2 py-1 font-mono text-[11px] font-bold tracking-[0.2em] text-cyber-tan uppercase backdrop-blur-sm"
                  >
                    {`[${link.name}]`}
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.span
                aria-hidden="true"
                className={`relative rounded-full border ${isActive ? "border-cyber-tan bg-cyber-tan" : "border-cyber-blue/40 bg-cyber-black"}`}
                animate={{
                  width: isActive ? 9 : 6,
                  height: isActive ? 9 : 6,
                  boxShadow: isActive ? "0 0 10px rgba(210,180,140,0.7)" : "0 0 0px rgba(210,180,140,0)",
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
            </a>
          );
        })}
      </div>
    </nav>
  );
}

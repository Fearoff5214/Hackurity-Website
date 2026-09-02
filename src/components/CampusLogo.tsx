"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * Small REVA University emblem pinned to the top-right, just under the navbar.
 * Hovering (or tapping, on touch) flips it over to the Cybersecurity Club shield.
 * No plate, border or glow — the mark sits directly on the page.
 */
export default function CampusLogo() {
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);
  const showBack = hovered !== tapped;

  return (
    <motion.button
      type="button"
      aria-label={showBack ? "REVA Cybersecurity Club" : "REVA University"}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => setTapped((value) => !value)}
      initial={{ opacity: 0, y: -8, scale: 0.7 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
      whileTap={{ scale: 0.9 }}
      className="fixed right-[50px] top-[102px] z-40 h-14 w-14 bg-transparent [perspective:700px] md:right-[62px] md:top-[106px] md:h-16 md:w-16"
    >
      <motion.span
        className="relative block h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: showBack ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      >
        <img
          src="/brand/logo-icon.png"
          alt=""
          className="absolute inset-0 h-full w-full object-contain [backface-visibility:hidden] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
        />
        <img
          src="/brand/club-logo-icon.png"
          alt=""
          className="absolute inset-0 h-full w-full object-contain [transform:rotateY(180deg)] [backface-visibility:hidden] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
        />
      </motion.span>
    </motion.button>
  );
}

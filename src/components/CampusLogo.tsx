"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import { motion } from "framer-motion";

type CampusLogoProps = {
  /** Which mark faces forward. Defaults to the REVA University emblem. */
  primary?: "reva" | "club";
};

/**
 * Small emblem pinned to the top-left, just under the navbar. Spins
 * continuously, alternating between the two marks. No plate, border or
 * glow — the mark sits directly on the page.
 */
export default function CampusLogo({ primary = "reva" }: CampusLogoProps) {
  const frontIsClub = primary === "club";

  return (
    <motion.div
      role="img"
      aria-label="REVA University and REVA Cybersecurity Club"
      initial={{ opacity: 0, y: -8, scale: 0.7 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
      className="fixed left-[62px] top-[106px] z-40 hidden h-16 w-16 bg-transparent [perspective:700px] md:block"
    >
      <motion.span
        className="relative block h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        <img
          src={frontIsClub ? "/brand/club-logo-icon.png" : "/brand/logo-icon.png"}
          alt=""
          className="absolute inset-0 h-full w-full object-contain [backface-visibility:hidden] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
        />
        <img
          src={frontIsClub ? "/brand/logo-icon.png" : "/brand/club-logo-icon.png"}
          alt=""
          className="absolute inset-0 h-full w-full object-contain [transform:rotateY(180deg)] [backface-visibility:hidden] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
        />
      </motion.span>
    </motion.div>
  );
}

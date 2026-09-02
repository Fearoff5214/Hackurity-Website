"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import { motion } from "framer-motion";

type CampusLogoProps = {
  /** Which mark faces forward before any hover/tap. Defaults to the REVA University emblem. */
  primary?: "reva" | "club";
};

/**
 * Small emblem pinned to the top-right, just under the navbar. Hovering (or
 * tapping, on touch) flips it over to the other mark. No plate, border or
 * glow — the mark sits directly on the page.
 */
export default function CampusLogo({ primary = "reva" }: CampusLogoProps) {
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);
  const showBack = hovered !== tapped;
  const frontIsClub = primary === "club";

  return (
    <motion.button
      type="button"
      aria-label={showBack !== frontIsClub ? "REVA Cybersecurity Club" : "REVA University"}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => setTapped((value) => !value)}
      initial={{ opacity: 0, y: -8, scale: 0.7 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
      whileTap={{ scale: 0.9 }}
      className="fixed right-[62px] top-[106px] z-40 hidden h-16 w-16 bg-transparent [perspective:700px] md:block"
    >
      <motion.span
        className="relative block h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: showBack ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
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
    </motion.button>
  );
}

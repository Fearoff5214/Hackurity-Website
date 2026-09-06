"use client";

import { motion } from "framer-motion";

type Domain = { id: string; name: string; brief: string; sponsor?: string };

export default function TrackCard({ domain, index }: { domain: Domain; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, rotateX: -18, scale: 0.94, y: 24 }}
      whileInView={{ opacity: 1, rotateX: 0, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ type: "spring", stiffness: 120, damping: 16, delay: index * 0.12 }}
      className="relative flex flex-col gap-2.5 border border-cyber-blue/15 bg-cyber-black/70 p-4 md:p-5 hover:border-cyber-tan/50 transition-colors"
    >
      <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-cyber-tan" />
      <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-cyber-tan" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-cyber-tan" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-cyber-tan" />
      <div className="flex items-start justify-between gap-3">
        <span className="text-cyber-tan font-bold uppercase tracking-widest text-[13px] md:text-sm leading-tight">◆ {domain.name}</span>
        <span className="shrink-0 text-[11px] text-cyber-blue/70">{domain.id}</span>
      </div>
      <span className="text-[12.5px] md:text-[13.5px] leading-relaxed">{domain.brief}</span>
    </motion.li>
  );
}

// Sponsor-backed bonus track — pulled out of the regular grid and given its
// own full-width, solid-fill treatment so it reads as an add-on from the
// sponsor rather than just a fourth tile identical to the other three.
export function SponsoredTrackBanner({ domain, index }: { domain: Domain; index: number }) {
  const trackLabel = domain.id.replace(/^TRK-/, "TRACK ");
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ type: "spring", stiffness: 120, damping: 16, delay: index * 0.12 }}
      className="border border-cyber-blue/40 bg-cyber-blue/90 p-4 md:p-5 text-white"
    >
      <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-white/80">
        {trackLabel}
        {domain.sponsor ? ` · SPONSORED BY ${domain.sponsor.toUpperCase()}` : ""}
      </span>
      <h3 className="mt-1 font-heading text-lg md:text-xl uppercase leading-tight">{domain.name}</h3>
      <p className="mt-1 font-mono text-[12.5px] md:text-[13.5px] italic leading-relaxed text-white/85">
        {domain.brief}
      </p>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";

type Domain = { id: string; name: string; brief: string };

export default function TrackCard({ domain, index }: { domain: Domain; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, rotateX: -18, scale: 0.94, y: 24 }}
      whileInView={{ opacity: 1, rotateX: 0, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ type: "spring", stiffness: 120, damping: 16, delay: index * 0.12 }}
      className="relative flex flex-col gap-3 border border-cyber-blue/15 bg-cyber-black/70 p-5 md:p-6 hover:border-cyber-tan/50 transition-colors"
    >
      <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-cyber-tan" />
      <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-cyber-tan" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-cyber-tan" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-cyber-tan" />
      <div className="flex items-start justify-between gap-3">
        <span className="text-cyber-tan font-bold uppercase tracking-widest text-[15px] md:text-base leading-tight">◆ {domain.name}</span>
        <span className="shrink-0 text-[12px] text-cyber-blue/70">{domain.id}</span>
      </div>
      <span className="text-[14px] md:text-[15px] leading-relaxed">{domain.brief}</span>
    </motion.li>
  );
}

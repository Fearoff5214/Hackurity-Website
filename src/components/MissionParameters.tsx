"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedCorners, CornerCrosshairs } from "@/components/TechElements";
import { useRowScrollProgress } from "@/components/useRowScrollProgress";

const glyphProps = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ClockGlyph = () => (
  <svg {...glyphProps} className="h-6 w-6"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>
);
const SquadGlyph = () => (
  <svg {...glyphProps} className="h-6 w-6"><circle cx="9" cy="8" r="3" /><circle cx="17" cy="10" r="2.2" /><path d="M3.5 20c0-3 2.4-5.2 5.5-5.2S14.5 17 14.5 20" /><path d="M14.8 20c.2-2.4 1.7-4.1 3.6-4.1S21.8 17.6 22 20" /></svg>
);
const TracksGlyph = () => (
  <svg {...glyphProps} className="h-6 w-6"><path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" /></svg>
);
const CashGlyph = () => (
  <svg {...glyphProps} className="h-6 w-6"><rect x="2.5" y="6" width="19" height="12" rx="1.5" /><circle cx="12" cy="12" r="3" /><path d="M6 9v6M18 9v6" /></svg>
);
const PinGlyphSmall = () => (
  <svg {...glyphProps} className="h-6 w-6"><path d="M12 21s7-6.5 7-11.5a7 7 0 1 0-14 0C5 14.5 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.4" /></svg>
);

type Spec = { id: string; icon: React.ReactNode; value: string; label: string; blurb: string };

const SPECS: Spec[] = [
  { id: "P-01", icon: <ClockGlyph />, value: "24 HRS", label: "DURATION", blurb: "One continuous overnight build window — no pausing the clock." },
  { id: "P-02", icon: <SquadGlyph />, value: "3–4", label: "TEAM SIZE", blurb: "Operators per squad. Everyone on the roster has to pull weight." },
  { id: "P-03", icon: <TracksGlyph />, value: "04", label: "TRACKS", blurb: "Problem domains to pick from — AI security, IoT, Web3, and an IBM-sponsored digital inclusion track." },
  { id: "P-04", icon: <CashGlyph />, value: "₹800", label: "ENTRY", blurb: "Per team, all-inclusive. Covers the full 24-hour run." },
  { id: "P-05", icon: <PinGlyphSmall />, value: "14–15 OCT", label: "DATE", blurb: "REVA University, Bengaluru. Mark the calendar now." },
];

function SpecRow({ spec, index }: { spec: Spec; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  return (
    <div
      ref={ref}
      className="relative flex items-start gap-3 border border-cyber-blue/10 bg-cyber-dark/30 p-3 transition-colors duration-300 hover:border-cyber-tan/40"
    >
      <AnimatedCorners size={10} tone="tan" />
      <motion.span
        initial={{ opacity: 0, scale: 0.7 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.35, delay: 0.05 + index * 0.03 }}
        className="flex h-9 w-9 shrink-0 items-center justify-center border border-cyber-tan/30 bg-cyber-tan/5 text-cyber-tan"
      >
        {spec.icon}
      </motion.span>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-base text-white">{spec.value}</span>
          <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-cyber-tan/70">{spec.label}</span>
        </div>
        <p className="mt-1 font-mono text-[12px] leading-relaxed text-cyber-gray">{spec.blurb}</p>
      </div>
      <span className="ml-auto shrink-0 font-mono text-[10px] tracking-widest text-cyber-blue/40">{spec.id}</span>
    </div>
  );
}

// Pinned readout panel. Which spec it shows (`activeIndex`) comes from
// useRowScrollProgress — measured directly off each row's real position on
// screen, so it can't drift out of sync with what's actually in view. Native
// `position: sticky` is unreliable here because the page applies a CSS
// `zoom` to <main>, which breaks Chromium's sticky containing-block math, so
// the vertical offset is still computed manually rather than relying on it.
function ActiveSpecReadout({
  activeIndex,
  trackHeight,
  rowOffsets,
}: {
  activeIndex: number;
  trackHeight: number;
  rowOffsets: number[];
}) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const [badgeHeight, setBadgeHeight] = useState(0);

  useEffect(() => {
    const el = badgeRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setBadgeHeight(entry.contentRect.height));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const top = Math.min(rowOffsets[activeIndex] ?? 0, Math.max(trackHeight - badgeHeight, 0));
  const spec = SPECS[activeIndex];

  return (
    <motion.div
      ref={badgeRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, top }}
      transition={{ opacity: { duration: 0.4 }, top: { type: "spring", stiffness: 220, damping: 28 } }}
      className="relative md:absolute md:inset-x-0"
    >
      <div className="relative border border-cyber-tan/30 bg-cyber-black/70 p-4 backdrop-blur-sm">
        <AnimatedCorners size={14} tone="tan" />
        <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-cyber-blue/70 uppercase">// active_spec</p>
        <span className="mt-3 flex h-10 w-10 items-center justify-center border border-cyber-tan/40 bg-cyber-tan/10 text-cyber-tan">
          {spec.icon}
        </span>
        <p className="mt-3 font-heading text-xl text-white">{spec.value}</p>
        <h4 className="font-mono text-[11px] font-bold tracking-[0.25em] text-cyber-tan uppercase">{spec.label}</h4>
        <p className="mt-2 font-mono text-[11px] leading-relaxed text-cyber-gray">{spec.blurb}</p>
        <p className="mt-3 font-mono text-[10px] tracking-widest text-cyber-gray/50">
          {String(activeIndex + 1).padStart(2, "0")}/{String(SPECS.length).padStart(2, "0")}
        </p>
      </div>
    </motion.div>
  );
}

export default function MissionParameters() {
  const listRef = useRef<HTMLDivElement>(null);
  const [trackHeight, setTrackHeight] = useState(0);
  const [rowOffsets, setRowOffsets] = useState<number[]>([]);

  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;
    const measure = () => {
      setTrackHeight(listEl.offsetHeight);
      setRowOffsets(Array.from(listEl.children).map((child) => (child as HTMLElement).offsetTop));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(listEl);
    return () => observer.disconnect();
  }, []);

  const { activeIndex } = useRowScrollProgress(listRef, SPECS.length);

  return (
    <section
      id="mission_parameters"
      className="crosshair-corner relative border border-cyber-blue/10 bg-cyber-dark/30 backdrop-blur-md p-5 md:p-7"
    >
      <CornerCrosshairs />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col gap-2 max-w-2xl"
      >
        <span className="text-[11px] font-bold tracking-widest text-cyber-tan uppercase">// SYSTEM_SEQUENCE_NODE_PARAMS</span>
        <h2 className="font-heading text-lg md:text-xl tracking-tight text-white uppercase">MISSION PARAMETERS</h2>
        <p className="font-mono text-[11px] leading-relaxed text-cyber-gray">
          Everything you need to know at a glance. Scroll and the readout tracks whichever spec is in frame.
        </p>
      </motion.div>

      <div
        className="relative mt-5 w-full md:grid md:gap-5"
        style={{ gridTemplateColumns: "260px 1fr" }}
      >
        <div className="relative hidden md:block">
          <ActiveSpecReadout activeIndex={activeIndex} trackHeight={trackHeight} rowOffsets={rowOffsets} />
        </div>

        <div ref={listRef} className="flex flex-col gap-3">
          {SPECS.map((spec, i) => (
            <SpecRow key={spec.id} spec={spec} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

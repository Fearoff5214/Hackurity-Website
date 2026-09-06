"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { EVENT_SCHEDULE, type EventScheduleItem } from "@/data/eventSchedule";
import { useRowScrollProgress } from "@/components/useRowScrollProgress";

function GatewayRow({ gate, index }: { gate: EventScheduleItem; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.55"],
  });
  const revealX = useTransform(scrollYProgress, [0, 1], [-24, 0]);
  const revealOpacity = useTransform(scrollYProgress, [0, 1], [0.25, 1]);
  const revealScale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

  return (
    <li ref={ref} className="relative pl-12 md:pl-16 pb-8 last:pb-0">
      {/* Node marker on the trunk */}
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="absolute left-[14px] md:left-[22px] top-1.5 -translate-x-1/2 w-2.5 h-2.5 rotate-45 border border-cyber-tan bg-cyber-black transition-shadow duration-300"
      >
        <span className="absolute inset-[2px] bg-cyber-tan/70" />
      </motion.span>

      {/* Connector tick */}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.12 }}
        className="absolute left-[15px] md:left-[23px] top-[9px] h-px w-6 md:w-8 origin-left bg-cyber-blue/40"
      />

      <motion.div
        style={{ x: revealX, opacity: revealOpacity, scale: revealScale }}
        whileHover={{
          y: -3,
          scale: 1.015,
          boxShadow: "0 8px 24px -8px rgba(212, 181, 132, 0.25), 0 0 0 1px rgba(212, 181, 132, 0.15)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="relative border border-cyber-blue/10 bg-cyber-dark/30 p-4 group cursor-default transition-colors duration-300 hover:border-cyber-tan/50 hover:bg-[rgba(15,20,30,0.55)]"
      >
        <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-cyber-tan" />
        <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-cyber-tan" />
        <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-cyber-tan" />
        <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-cyber-tan" />
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-mono font-bold text-cyber-tan border border-cyber-tan/30 bg-cyber-tan/5 px-1.5 py-0.5 transition-colors duration-300 group-hover:bg-cyber-tan/15 group-hover:border-cyber-tan/60">
              {gate.id}
            </span>
            <h3 className="font-heading text-[14px] md:text-xs tracking-[0.15em] text-white uppercase transition-colors duration-300 group-hover:text-cyber-tan">
              {gate.title}
            </h3>
          </div>
          <span className="font-terminal text-xs font-bold tracking-[0.08em] text-cyber-blue/90 md:text-sm transition-colors duration-300 group-hover:text-cyber-blue">
            {gate.window}
          </span>
        </div>
        <p className="font-mono text-[14px] leading-relaxed text-cyber-gray">
          <span className="text-cyber-tan/70 mr-1.5">{`>`}</span>
          {gate.brief}
        </p>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-cyber-blue/20 via-cyber-blue/5 to-transparent" />
        <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-cyber-gray/60">
          <span>SEQ_INDEX: {String(index + 1).padStart(2, "0")}/{String(EVENT_SCHEDULE.length).padStart(2, "0")}</span>
          <span className="text-cyber-tan/50 group-hover:text-cyber-tan transition-colors duration-300">
            GATEWAY_LOCKED_LINEAR
          </span>
        </div>
      </motion.div>
    </li>
  );
}

// Small bracket-corner badge that travels alongside the trunk-line progress,
// showing whichever gate is currently active. Native `position: sticky`
// silently breaks here — the page applies a CSS `zoom` to <main> for text
// sizing, and Chromium miscalculates sticky's containing block under zoom
// (confirmed live: the element reported a viewport `top` thousands of
// pixels off-screen instead of holding near the fold). `position: absolute`
// isn't affected — the trunk line below already relies on it successfully
// under the same zoom — so this computes its own vertical offset instead of
// leaning on the browser's sticky algorithm.
//
// `activeIndex` comes from useRowScrollProgress, which measures each row's
// real position on screen every scroll tick — it can't drift out of sync
// with the row actually in view the way a `scrollYProgress * trackHeight`
// estimate can. The badge's own vertical position is derived from that same
// row's real `offsetTop` (rowOffsets), rather than assuming rows are evenly
// sized — rows vary in height (some briefs wrap to two lines).
function CurrentStageReadout({
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
  const gate = EVENT_SCHEDULE[activeIndex];

  return (
    <motion.div
      ref={badgeRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, top }}
      transition={{ opacity: { duration: 0.4 }, top: { type: "spring", stiffness: 220, damping: 28 } }}
      className="relative md:absolute md:inset-x-0"
    >
      <div className="relative border border-cyber-tan/30 bg-cyber-black/70 px-4 py-3 backdrop-blur-sm">
        <span className="pointer-events-none absolute left-0 top-0 h-2.5 w-2.5 border-l-2 border-t-2 border-cyber-tan" />
        <span className="pointer-events-none absolute right-0 top-0 h-2.5 w-2.5 border-r-2 border-t-2 border-cyber-tan" />
        <span className="pointer-events-none absolute bottom-0 left-0 h-2.5 w-2.5 border-b-2 border-l-2 border-cyber-tan" />
        <span className="pointer-events-none absolute bottom-0 right-0 h-2.5 w-2.5 border-b-2 border-r-2 border-cyber-tan" />
        <p className="font-mono text-[11px] font-bold tracking-[0.25em] text-cyber-blue/70 uppercase">
          // now_at
        </p>
        <p className="mt-1 font-mono text-[13px] font-bold text-cyber-tan">{gate.id}</p>
        <h4 className="font-heading text-[13px] leading-snug text-white uppercase">{gate.title}</h4>
        <p className="mt-2 font-mono text-[11px] tracking-widest text-cyber-gray/60">
          {String(activeIndex + 1).padStart(2, "0")}/{String(EVENT_SCHEDULE.length).padStart(2, "0")}
        </p>
      </div>
    </motion.div>
  );
}

export default function EventPathway() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const olRef = useRef<HTMLOListElement>(null);
  const [trackHeight, setTrackHeight] = useState(0);
  const [rowOffsets, setRowOffsets] = useState<number[]>([]);

  useEffect(() => {
    const trackEl = trackRef.current;
    const olEl = olRef.current;
    if (!trackEl || !olEl) return;
    const measure = () => {
      setTrackHeight(trackEl.offsetHeight);
      setRowOffsets(Array.from(olEl.children).map((child) => (child as HTMLElement).offsetTop));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(trackEl);
    return () => observer.disconnect();
  }, []);

  const { progress, activeIndex } = useRowScrollProgress(olRef, EVENT_SCHEDULE.length);
  const glowY = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative w-full md:grid md:grid-cols-[240px_1fr] md:gap-6">
      {/* Traveling readout is desktop-only — on mobile it has no gutter to live
          in and overlaps the timeline cards. */}
      <div className="relative hidden md:block md:mb-0">
        <CurrentStageReadout activeIndex={activeIndex} trackHeight={trackHeight} rowOffsets={rowOffsets} />
      </div>

      <div ref={trackRef} className="relative">
        {/* Trunk conduit */}
        <div className="absolute left-[14px] md:left-[22px] top-2 bottom-2 w-px bg-cyber-blue/12" />
        <motion.div
          style={{ scaleY: progress }}
          className="absolute left-[14px] md:left-[22px] top-2 bottom-2 w-px origin-top bg-cyber-tan/60"
        />
        <motion.div
          style={{ top: glowY }}
          className="absolute left-[14px] md:left-[22px] w-px h-16 -translate-y-full bg-gradient-to-b from-transparent via-cyber-blue to-cyber-tan"
        />

        <ol ref={olRef} className="flex flex-col">
          {EVENT_SCHEDULE.map((gate, i) => (
            <GatewayRow key={gate.id} gate={gate} index={i} />
          ))}
        </ol>
      </div>
    </div>
  );
}

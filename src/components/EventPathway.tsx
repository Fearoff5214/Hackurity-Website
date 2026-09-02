"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useInView } from "framer-motion";
import { EVENT_SCHEDULE, type EventScheduleItem } from "@/data/eventSchedule";

function GatewayRow({ gate, index }: { gate: EventScheduleItem; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });

  return (
    <li ref={ref} className="relative pl-12 md:pl-16 pb-8 last:pb-0">
      {/* Node marker on the trunk */}
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="absolute left-[14px] md:left-[22px] top-1.5 -translate-x-1/2 w-2.5 h-2.5 rotate-45 border border-cyber-tan bg-cyber-black"
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
        initial={{ opacity: 0, x: -12 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.45, delay: 0.14, ease: "easeOut" }}
        className="border border-cyber-blue/10 bg-cyber-dark/30 hover:border-cyber-tan/30 transition-colors duration-300 p-4 group"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-mono font-bold text-cyber-tan border border-cyber-tan/30 bg-cyber-tan/5 px-1.5 py-0.5">
              {gate.id}
            </span>
            <h3 className="font-heading text-[14px] md:text-xs tracking-[0.15em] text-white uppercase">
              {gate.title}
            </h3>
          </div>
          <span className="font-terminal text-xs font-bold tracking-[0.08em] text-cyber-blue/90 md:text-sm">
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
          <span className="text-cyber-tan/50 group-hover:text-cyber-tan transition-colors">
            GATEWAY_LOCKED_LINEAR
          </span>
        </div>
      </motion.div>
    </li>
  );
}

export default function EventPathway() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.35"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });
  const glowY = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative w-full">
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

      <ol className="flex flex-col">
        {EVENT_SCHEDULE.map((gate, i) => (
          <GatewayRow key={gate.id} gate={gate} index={i} />
        ))}
      </ol>
    </div>
  );
}

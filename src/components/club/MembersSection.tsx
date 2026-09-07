"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import type { RefObject } from "react";
import { DEPARTMENTS, type Department, type Person } from "./data";
import { SectionHeading } from "./Reveal";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

// Continuous scroll-linked slide: fades/slides in as an element enters the
// viewport, holds while it's the one in focus, then slides back out as it
// leaves — rather than a one-shot reveal that only ever plays once.
function useScrollSlide<T extends HTMLElement>(ref: RefObject<T | null>) {
  const { scrollYProgress } = useScroll({
    target: ref as RefObject<HTMLElement>,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const x = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [-70, 0, 0, 70]);
  return { opacity, x };
}

function MemberCard({
  person,
  index,
}: {
  person: Person;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { opacity, x } = useScrollSlide(ref);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <motion.article
      ref={ref}
      style={{ opacity, x }}
      whileHover={{ y: -8 }}
      className="group relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(13,20,28,0.96),rgba(3,7,11,0.98))] p-5 shadow-[0_18px_60px_-35px_rgba(0,0,0,0.9)] transition-[border-color,box-shadow] duration-500 hover:border-cyber-tan/50 hover:shadow-[0_24px_80px_-38px_rgba(0,0,0,0.95)] sm:max-w-lg sm:p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(210,180,120,0.10),transparent_42%)] opacity-70" />
      <div className="pointer-events-none absolute inset-[1px] rounded-[15px] border border-white/[0.035]" />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-heading text-[17px] leading-tight tracking-wide text-white">
            {person.name}
          </h3>
          <p className="mt-2 font-mono text-[11px] font-bold tracking-[0.18em] text-cyber-tan uppercase">
            {person.role}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] tracking-widest text-white/40">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="relative z-10 mt-6 flex flex-1 flex-col items-center">
        <div className="relative h-48 w-48 overflow-hidden rounded-[22px] border border-cyber-tan/35 bg-cyber-blue/[0.04] shadow-[0_0_50px_-22px_rgba(214,180,120,0.7)] sm:h-52 sm:w-52">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          {person.photo && !imgFailed ? (
            <img
              src={person.photo}
              alt={`${person.name} — ${person.role}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover grayscale-[15%] transition-[transform,filter] duration-700 group-hover:scale-105 group-hover:grayscale-0"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-white/[0.025] font-heading text-4xl text-cyber-tan/80">
              {initials(person.name)}
            </div>
          )}

          <motion.span
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-cyber-tan/80"
            animate={{ y: [0, 185, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
          />
        </div>

        <p className="mt-5 w-full max-w-[34rem] text-center font-mono text-[12.5px] leading-relaxed text-white/80">
          <span className="mr-1 text-cyber-tan">“</span>
          {person.saying}
          <span className="ml-1 text-cyber-tan">”</span>
        </p>
      </div>

      <div className="relative z-10 mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4">
        {person.github && (
          <motion.a
            href={person.github}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[10px] font-semibold tracking-[0.15em] text-white/70 transition hover:border-cyber-tan/50 hover:bg-cyber-tan/10 hover:text-cyber-tan"
          >
            GITHUB ↗
          </motion.a>
        )}
        <motion.a
          href={person.linkedin}
          target="_blank"
          rel="noreferrer"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[10px] font-semibold tracking-[0.15em] text-white/70 transition hover:border-cyber-tan/50 hover:bg-cyber-tan/10 hover:text-cyber-tan"
        >
          LINKEDIN ↗
        </motion.a>
      </div>
    </motion.article>
  );
}

function DepartmentBlock({
  department,
  deptIndex,
}: {
  department: Department;
  deptIndex: number;
}) {
  const headingRef = useRef<HTMLDivElement>(null);
  const { opacity, x } = useScrollSlide(headingRef);

  return (
    <div>
      <motion.div ref={headingRef} style={{ opacity, x }} className="flex items-end gap-4">
        <span className="font-heading text-3xl text-cyber-tan/30 md:text-4xl">
          {String(deptIndex + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <h3 className="font-heading text-xl leading-tight text-white uppercase md:text-2xl">
            {department.label}
          </h3>
          <span className="mt-2 block h-px w-24 bg-gradient-to-r from-cyber-tan to-transparent" />
        </div>
      </motion.div>

      <motion.p
        style={{ opacity }}
        className="mt-4 max-w-2xl font-mono text-[13px] leading-relaxed text-white/55 sm:text-[14px]"
      >
        {department.blurb}
      </motion.p>

      <div className="mt-10 flex flex-col items-center">
        {department.people.map((person, index) => (
          <div
            key={`${department.id}-${person.name}`}
            className="flex min-h-[85vh] w-full items-center justify-center"
          >
            <MemberCard person={person} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MembersSection() {
  return (
    <section
      id="members"
      className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-5 md:px-8 md:py-24"
    >
      <SectionHeading
        tag="The team"
        title="Club members"
        description="Scroll through to meet every department. Each one is happy to be contacted if you want to know more about what they do."
      />

      <div className="mt-4 space-y-24 md:space-y-28">
        {DEPARTMENTS.map((department, deptIndex) => (
          <DepartmentBlock
            key={department.id}
            department={department}
            deptIndex={deptIndex}
          />
        ))}
      </div>
    </section>
  );
}

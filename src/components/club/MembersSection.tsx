"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { DEPARTMENTS, type Person } from "./data";
import { SectionHeading } from "./Reveal";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function MemberCard({
  person,
  index,
}: {
  person: Person;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.18 });
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 35, scale: 0.97 }}
      animate={
        inView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 35, scale: 0.97 }
      }
      transition={{
        duration: 0.55,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8 }}
      className="group relative flex h-full min-h-[475px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(13,20,28,0.96),rgba(3,7,11,0.98))] p-5 shadow-[0_18px_60px_-35px_rgba(0,0,0,0.9)] transition-[border-color,box-shadow] duration-500 hover:border-cyber-tan/50 hover:shadow-[0_24px_80px_-38px_rgba(0,0,0,0.95)] sm:p-6"
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
        <motion.div
          initial={{ opacity: 0, scale: 0.84 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.84 }}
          transition={{
            duration: 0.6,
            delay: index * 0.07 + 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{ scale: 1.045, rotate: 1 }}
          className="relative h-48 w-48 overflow-hidden rounded-[22px] border border-cyber-tan/35 bg-cyber-blue/[0.04] shadow-[0_0_50px_-22px_rgba(214,180,120,0.7)] sm:h-52 sm:w-52"
        >
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
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.45, delay: index * 0.07 + 0.3 }}
          className="mt-5 w-full max-w-[34rem] text-center font-mono text-[12.5px] leading-relaxed text-white/80"
        >
          <span className="mr-1 text-cyber-tan">“</span>
          {person.saying}
          <span className="ml-1 text-cyber-tan">”</span>
        </motion.p>
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

export default function MembersSection() {
  const [active, setActive] = useState(DEPARTMENTS[0]?.id ?? "leadership");
  const department =
    DEPARTMENTS.find((item) => item.id === active) ?? DEPARTMENTS[0];
  const gridRef = useRef<HTMLDivElement>(null);

  if (!department) return null;

  const pick = (id: string) => {
    setActive(id);
    requestAnimationFrame(() => {
      const node = gridRef.current;
      if (!node) return;
      const top = node.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    });
  };

  return (
    <section
      id="members"
      className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-5 md:px-8 md:py-24"
    >
      <SectionHeading
        tag="The team"
        title="Club members"
        description="Pick a department to see the people who run it. Every member is happy to be contacted if you want to know more about what they do."
      />

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {DEPARTMENTS.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => pick(item.id)}
              className={`relative shrink-0 overflow-hidden rounded-full border px-4 py-2.5 font-mono text-[11px] font-semibold tracking-[0.12em] uppercase transition ${
                isActive
                  ? "border-cyber-tan/70 text-cyber-tan"
                  : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/25 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="deptHighlight"
                  className="absolute inset-0 bg-cyber-tan/10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative">{item.label}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 max-w-3xl font-mono text-[13px] leading-relaxed text-white/55 sm:text-[14px]">
        {department.blurb}
      </p>

      <div ref={gridRef}>
        <AnimatePresence mode="wait">
          <motion.div
            key={department.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {department.people.map((person, index) => (
              <MemberCard
                key={`${department.id}-${person.name}`}
                person={person}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

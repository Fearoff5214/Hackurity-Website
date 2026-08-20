"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DEPARTMENTS } from "./data";
import { SectionHeading } from "./Reveal";

export default function MembersSection() {
  const [active, setActive] = useState(DEPARTMENTS[0]!.id);
  const department = DEPARTMENTS.find((item) => item.id === active) ?? DEPARTMENTS[0]!;

  return (
    <section id="members" className="relative mx-auto max-w-6xl px-5 py-24 md:px-8">
      <SectionHeading
        tag="The team"
        title="Club members"
        description="Pick a department to see the people who run it. Every member is happy to be contacted if you want to know more about what they do."
      />

      <div className="flex flex-wrap gap-2">
        {DEPARTMENTS.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className={`relative border px-4 py-2.5 font-mono text-[10px] tracking-widest uppercase transition-colors ${
                isActive
                  ? "border-cyber-tan text-cyber-tan"
                  : "border-cyber-blue/20 text-cyber-gray hover:border-cyber-blue/50 hover:text-white"
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

      <p className="mt-5 font-mono text-[11px] leading-relaxed text-cyber-gray">
        {department.blurb}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={department.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {department.people.map((person, index) => (
            <motion.article
              key={person.name}
              initial={{ opacity: 0, rotateX: -8, y: 24 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group flex flex-col border border-cyber-blue/15 bg-black/55 p-5 transition-colors hover:border-cyber-tan/45"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading text-[12px] leading-relaxed uppercase">
                    {person.name}
                  </h3>
                  <p className="mt-1.5 font-mono text-[9.5px] font-bold tracking-widest text-cyber-tan uppercase">
                    {person.role}
                  </p>
                </div>
                <span className="font-mono text-[9px] tracking-widest text-cyber-blue/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <p className="mt-4 border-l border-cyber-tan/40 pl-3 font-mono text-[10.5px] leading-relaxed text-cyber-gray italic">
                &ldquo;{person.saying}&rdquo;
              </p>

              <div className="mt-4 space-y-1 font-mono text-[10px] text-cyber-gray">
                <a href={`tel:${person.phone.replace(/\s/g, "")}`} className="block hover:text-white">
                  {person.phone}
                </a>
                <a href={`mailto:${person.email}`} className="block truncate hover:text-white">
                  {person.email}
                </a>
              </div>

              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                <a
                  href={person.github}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-cyber-blue/25 px-3 py-1.5 font-mono text-[9px] tracking-widest text-cyber-blue transition-colors hover:border-cyber-tan hover:text-cyber-tan"
                >
                  GITHUB ↗
                </a>
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-cyber-blue/25 px-3 py-1.5 font-mono text-[9px] tracking-widest text-cyber-blue transition-colors hover:border-cyber-tan hover:text-cyber-tan"
                >
                  LINKEDIN ↗
                </a>
                <a
                  href={`mailto:${person.email}`}
                  className="border border-cyber-blue/25 px-3 py-1.5 font-mono text-[9px] tracking-widest text-cyber-blue transition-colors hover:border-cyber-tan hover:text-cyber-tan"
                >
                  EMAIL ↗
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

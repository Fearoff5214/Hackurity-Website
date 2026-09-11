"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

function MemberCard({ person, index }: { person: Person; index: number }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, rotateX: -8, y: 24 }}
      animate={{ opacity: 1, rotateX: 0, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group flex flex-col border border-cyber-blue/15 bg-black/55 p-5 transition-colors hover:border-cyber-tan/45"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-[13px] leading-relaxed uppercase">
            {person.name}
          </h3>
          <p className="mt-1.5 font-mono text-[10.5px] font-bold tracking-widest text-cyber-tan uppercase">
            {person.role}
          </p>
        </div>
        <span className="font-mono text-[10px] tracking-widest text-cyber-blue/60">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="relative mt-4 h-40 w-40 self-center overflow-hidden rounded-lg border border-cyber-tan/25 bg-cyber-blue/[0.04]">
        {person.photo && !imgFailed ? (
          <img
            src={person.photo}
            alt={`${person.name} — ${person.role}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            style={{
              objectPosition: person.photoPosition ?? "50% 50%",
              transform: `scale(${person.photoZoom ?? 1})`,
              transformOrigin: person.photoPosition ?? "50% 50%",
            }}
            className="h-full w-full object-contain grayscale-[15%] transition-[filter] duration-500 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/[0.025] font-heading text-2xl text-cyber-tan/80">
            {initials(person.name)}
          </div>
        )}
      </div>

      <p className="mt-4 font-mono text-[11.5px] leading-relaxed text-cyber-gray italic">
        &ldquo;{person.saying}&rdquo;
      </p>

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <a
          href={person.github}
          target="_blank"
          rel="noreferrer"
          className="border border-cyber-blue/25 px-3 py-1.5 font-mono text-[10px] tracking-widest text-cyber-blue transition-colors hover:border-cyber-tan hover:text-cyber-tan"
        >
          GITHUB ↗
        </a>
        <a
          href={person.linkedin}
          target="_blank"
          rel="noreferrer"
          className="border border-cyber-blue/25 px-3 py-1.5 font-mono text-[10px] tracking-widest text-cyber-blue transition-colors hover:border-cyber-tan hover:text-cyber-tan"
        >
          LINKEDIN ↗
        </a>
      </div>
    </motion.article>
  );
}

export default function MembersSection() {
  const [active, setActive] = useState(DEPARTMENTS[0]!.id);
  const department = DEPARTMENTS.find((item) => item.id === active) ?? DEPARTMENTS[0]!;

  return (
    <section id="members" className="relative mx-auto max-w-6xl px-5 py-24 md:px-8">
      <SectionHeading
        tag="The team"
        title="Club members"
        description="Pick a department to see the people who run it. Every member is happy to be contacted if you want to know more about what they do."
        size="lg"
      />

      <div className="flex flex-wrap gap-2">
        {DEPARTMENTS.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className={`relative border px-4 py-2.5 font-mono text-[11px] tracking-widest uppercase transition-colors ${
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

      <p className="mt-5 font-mono text-[12px] leading-relaxed text-cyber-gray">
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
            <MemberCard key={person.name} person={person} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

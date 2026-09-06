"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { DEPARTMENTS, TECHNICAL_DEPARTMENT_IDS, type Person } from "./data";
import { SectionHeading } from "./Reveal";

/* ------------------------------------------------------------------ */
/* Console-style typing effect                                         */
/* ------------------------------------------------------------------ */

function useTypewriter(text: string, active: boolean, speed = 28, delay = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    let frame = 0;
    let timer: ReturnType<typeof setTimeout>;
    const start = setTimeout(() => {
      const tick = () => {
        frame += 1;
        setCount(frame);
        if (frame < text.length) timer = setTimeout(tick, speed);
      };
      tick();
    }, delay);

    return () => {
      clearTimeout(start);
      clearTimeout(timer);
    };
  }, [text, active, speed, delay]);

  return { typed: text.slice(0, count), done: count >= text.length };
}

function TypedQuote({
  text,
  active,
  delay,
  align,
}: {
  text: string;
  active: boolean;
  delay: number;
  align: "left" | "right";
}) {
  const { typed, done } = useTypewriter(text, active, 26, delay);

  return (
    <p
      className={`pointer-events-none font-mono text-[11.5px] leading-relaxed text-cyber-blue/45 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      <span className="text-cyber-tan/50">{align === "left" ? "> " : ""}</span>
      {typed}
      {!done && active && (
        <span className="ml-[2px] inline-block h-[11px] w-[6px] translate-y-[1px] animate-pulse bg-cyber-tan/70" />
      )}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Split a quote into two halves at a word boundary                    */
/* ------------------------------------------------------------------ */

function splitQuote(saying: string) {
  const words = saying.trim().split(/\s+/);
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")] as const;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/* ------------------------------------------------------------------ */
/* Member card                                                         */
/* ------------------------------------------------------------------ */

function MemberCard({
  person,
  index,
  showGithub,
}: {
  person: Person;
  index: number;
  showGithub: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.35 });
  const [left, right] = useMemo(() => splitQuote(person.saying), [person.saying]);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 48, rotateX: -10, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0, scale: 1 } : { opacity: 0, y: 48, rotateX: -10, scale: 0.96 }}
      transition={{ duration: 0.6, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      style={{ perspective: 1000 }}
      className="group relative flex min-h-[430px] flex-col overflow-hidden border border-cyber-blue/15 bg-black/60 p-6 transition-colors hover:border-cyber-tan/50"
    >
      {/* corner ticks */}
      <span className="absolute top-0 left-0 h-4 w-4 border-t border-l border-cyber-tan/40 transition-all duration-500 group-hover:h-7 group-hover:w-7" />
      <span className="absolute right-0 bottom-0 h-4 w-4 border-r border-b border-cyber-tan/40 transition-all duration-500 group-hover:h-7 group-hover:w-7" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-[16px] leading-relaxed uppercase">{person.name}</h3>
          <p className="mt-1.5 font-mono text-[12.5px] font-bold tracking-widest text-cyber-tan uppercase">
            {person.role}
          </p>
        </div>
        <span className="font-mono text-[12px] tracking-widest text-cyber-blue/60">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* photo + quote halves as background text on either side */}
      <div className="relative mt-6 grid flex-1 grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TypedQuote text={left} active={inView} delay={index * 90 + 250} align="left" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.55, delay: index * 0.09 + 0.12, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.08, rotate: -1.5 }}
          className="relative h-[132px] w-[132px] shrink-0 overflow-hidden border border-cyber-tan/35 bg-cyber-blue/5 shadow-[0_0_30px_-12px_rgba(0,0,0,0.9)]"
        >
          {person.photo && !imgFailed ? (
            <img
              src={person.photo}
              alt={person.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-heading text-2xl text-cyber-tan/70">
              {initials(person.name)}
            </div>
          )}

          {/* hover scanline + tint */}
          <span className="pointer-events-none absolute inset-0 bg-cyber-tan/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="pointer-events-none absolute inset-x-0 -top-full h-1/2 bg-gradient-to-b from-transparent via-cyber-tan/35 to-transparent transition-transform duration-[1200ms] group-hover:translate-y-[300%]" />
        </motion.div>

        <TypedQuote text={right} active={inView} delay={index * 90 + 950} align="right" />
      </div>

      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        {showGithub && (
          <motion.a
            href={person.github}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -3, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="border border-cyber-blue/25 px-3 py-1.5 font-mono text-[12px] tracking-widest text-cyber-blue transition-colors hover:border-cyber-tan hover:bg-cyber-tan/10 hover:text-cyber-tan"
          >
            GITHUB ↗
          </motion.a>
        )}
        <motion.a
          href={person.linkedin}
          target="_blank"
          rel="noreferrer"
          whileHover={{ y: -3, scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
          className="border border-cyber-blue/25 px-3 py-1.5 font-mono text-[12px] tracking-widest text-cyber-blue transition-colors hover:border-cyber-tan hover:bg-cyber-tan/10 hover:text-cyber-tan"
        >
          LINKEDIN ↗
        </motion.a>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function MembersSection() {
  const [active, setActive] = useState(DEPARTMENTS[0]!.id);
  const department = DEPARTMENTS.find((item) => item.id === active) ?? DEPARTMENTS[0]!;
  const gridRef = useRef<HTMLDivElement>(null);
  const showGithub = TECHNICAL_DEPARTMENT_IDS.includes(department.id);

  const pick = (id: string) => {
    setActive(id);
    // gentle scroll so the freshly revealed cards animate into view
    requestAnimationFrame(() => {
      const node = gridRef.current;
      if (!node) return;
      const top = node.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top, behavior: "smooth" });
    });
  };

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
              onClick={() => pick(item.id)}
              className={`relative border px-4 py-2.5 font-mono text-[13px] tracking-widest uppercase transition-colors ${
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

      <p className="mt-5 font-mono text-[14px] leading-relaxed text-cyber-gray">{department.blurb}</p>

      <div ref={gridRef}>
        <AnimatePresence mode="wait">
          <motion.div
            key={department.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {department.people.map((person, index) => (
              <MemberCard
                key={`${department.id}-${person.name}`}
                person={person}
                index={index}
                showGithub={showGithub}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

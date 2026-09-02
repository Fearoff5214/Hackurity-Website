"use client";

import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { CornerCrosshairs } from "@/components/TechElements";

// ── Icon glyphs ─────────────────────────────────────────────────────────
// Each path/shape draws itself in when the card scrolls into view (the card
// propagates the "show" variant down to these children).

const draw = (i: number): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.55, delay: 0.12 + i * 0.09, ease: "easeInOut" },
  },
});

const CERT = (
  <>
    <motion.rect x="3" y="4" width="18" height="12" rx="1" variants={draw(0)} />
    <motion.path d="M7 8h10M7 11h6" variants={draw(1)} />
    <motion.circle cx="12" cy="18" r="2.3" variants={draw(2)} />
    <motion.path d="M10.3 19.8 9.2 22.4l2.8-1.3 2.8 1.3-1.1-2.6" variants={draw(3)} />
  </>
);
const CASH = (
  <>
    <motion.rect x="2.5" y="6" width="19" height="12" rx="1.5" variants={draw(0)} />
    <motion.circle cx="12" cy="12" r="3" variants={draw(1)} />
    <motion.path d="M6 9v6M18 9v6" variants={draw(2)} />
  </>
);
const MERCH = (
  <>
    <motion.path d="M8.5 4 4 7l2 3 2-1.2V20h8V8.8L20 10l2-3-4.5-3-2.5 2h-4z" variants={draw(0)} />
    <motion.path d="M9.5 4c0 1.6 1.1 2.6 2.5 2.6S14.5 5.6 14.5 4" variants={draw(1)} />
  </>
);
const GIFT = (
  <>
    <motion.rect x="3.5" y="8" width="17" height="3.5" variants={draw(0)} />
    <motion.path d="M5.2 11.5V21h13.6v-9.5M12 8v13" variants={draw(1)} />
    <motion.path d="M12 8C11 5.5 9.3 4 8 5.2 6.9 6.3 9 8 12 8zM12 8c1-2.5 2.7-4 4-2.8C17.1 6.3 15 8 12 8z" variants={draw(2)} />
  </>
);
const PEOPLE = (
  <>
    <motion.circle cx="9" cy="8" r="3" variants={draw(0)} />
    <motion.circle cx="17" cy="10" r="2.2" variants={draw(1)} />
    <motion.path d="M3.5 20c0-3 2.4-5.2 5.5-5.2S14.5 17 14.5 20" variants={draw(2)} />
    <motion.path d="M14.8 20c.2-2.4 1.7-4.1 3.6-4.1S21.8 17.6 22 20" variants={draw(3)} />
  </>
);
const TARGET = (
  <>
    <motion.circle cx="12" cy="12" r="8" variants={draw(0)} />
    <motion.circle cx="12" cy="12" r="3.6" variants={draw(1)} />
    <motion.path d="M12 1.5v3.5M12 19v3.5M1.5 12H5M19 12h3.5" variants={draw(2)} />
  </>
);
const BRANCH = (
  <>
    <motion.circle cx="7" cy="6" r="2" variants={draw(0)} />
    <motion.circle cx="7" cy="18" r="2" variants={draw(1)} />
    <motion.circle cx="17" cy="8" r="2" variants={draw(2)} />
    <motion.path d="M7 8v8M17 10c0 5-4 3.5-8 4.4" variants={draw(3)} />
  </>
);
const NETWORK = (
  <>
    <motion.circle cx="5" cy="6" r="2" variants={draw(0)} />
    <motion.circle cx="19" cy="6" r="2" variants={draw(1)} />
    <motion.circle cx="12" cy="18" r="2" variants={draw(2)} />
    <motion.path d="M6.6 7.5 10.7 16M17.4 7.5 13.3 16M7 6h10" variants={draw(3)} />
  </>
);

type Benefit = { id: string; tag: string; title: string; blurb: string; icon: React.ReactNode };

const BENEFITS: Benefit[] = [
  { id: "01", tag: "CREDENTIAL", title: "Certificate of Participation", blurb: "Every operator who runs the full 24-hour window gets a verifiable certificate for the profile.", icon: CERT },
  { id: "02", tag: "PAYLOAD", title: "Exciting Cash Prizes", blurb: "A prize pool split across the top teams in all three tracks — the sharper the defence, the bigger the cut.", icon: CASH },
  { id: "03", tag: "LOOT", title: "Hackurity Merchandise", blurb: "Official event merch handed to standout teams during the build.", icon: MERCH },
  { id: "04", tag: "DROP", title: "Spot Gifts & Giveaways", blurb: "Surprise rewards and mini-challenges running through the night for anyone on the floor.", icon: GIFT },
  { id: "05", tag: "UPLINK", title: "Meet IBM Engineers", blurb: "Talk shop directly with IBM personnel and mentors — architecture, careers, and how they would break your build.", icon: PEOPLE },
  { id: "06", tag: "MISSION", title: "Real Industry Problems", blurb: "Work on live problem statements pulled from real security work, not textbook exercises.", icon: TARGET },
  { id: "07", tag: "ARTEFACT", title: "Keep What You Build", blurb: "You own every line. Several past projects shipped as open-source tools people still run.", icon: BRANCH },
  { id: "08", tag: "NETWORK", title: "Build Your Network", blurb: "Meet student builders, security enthusiasts and recruiters from campuses across the region.", icon: NETWORK },
];

const MARQUEE = [
  "CERTIFICATE", "CASH PRIZES", "EVENT MERCH", "SPOT GIFTS", "IBM ACCESS",
  "REAL PROBLEMS", "OPEN SOURCE", "RECRUITER VISIBILITY", "24H BUILD", "NEW NETWORK",
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

const cardV: Variants = {
  hidden: { opacity: 0, y: 42, scale: 0.92 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 15 } },
};

function BenefitCard({ benefit, index }: { benefit: Benefit; index: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [ping, setPing] = useState(false);

  const px = useMotionValue(50);
  const py = useMotionValue(50);
  const rotateX = useSpring(useTransform(py, [0, 100], [7, -7]), { stiffness: 150, damping: 14 });
  const rotateY = useSpring(useTransform(px, [0, 100], [-7, 7]), { stiffness: 150, damping: 14 });
  const spotlight = useMotionTemplate`radial-gradient(200px circle at ${px}% ${py}%, rgba(210,180,140,0.16), transparent 62%)`;

  const onMove = (event: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set(((event.clientX - rect.left) / rect.width) * 100);
    py.set(((event.clientY - rect.top) / rect.height) * 100);
  };
  const onLeave = () => {
    px.set(50);
    py.set(50);
  };
  const fire = () => {
    setPing(true);
    window.setTimeout(() => setPing(false), 720);
  };

  return (
    <motion.div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={benefit.title}
      variants={cardV}
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      onMouseMove={reduce ? undefined : onMove}
      onMouseLeave={onLeave}
      onClick={fire}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          fire();
        }
      }}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      className="group relative flex min-h-[210px] cursor-pointer flex-col gap-3 overflow-hidden border border-cyber-blue/15 bg-cyber-black/50 p-5 outline-none [transform-style:preserve-3d] focus-visible:border-cyber-tan/70"
    >
      {/* cursor spotlight */}
      <motion.span
        aria-hidden="true"
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {/* hover border wash */}
      <span className="pointer-events-none absolute inset-0 border border-cyber-tan/0 transition-colors duration-300 group-hover:border-cyber-tan/45" />
      {/* scan line — transform-only, runs just while hovered */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber-tan to-transparent opacity-0 group-hover:opacity-90"
        variants={
          reduce
            ? undefined
            : {
                hover: {
                  y: [0, 210],
                  transition: { duration: 1.9, repeat: Infinity, ease: "linear" },
                },
              }
        }
      />
      {/* corner tick */}
      <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-cyber-tan/40 transition-all duration-300 group-hover:h-4 group-hover:w-4 group-hover:border-cyber-tan" />

      <div className="relative z-[1] flex items-start justify-between">
        <motion.div
          variants={{ hover: { rotate: [0, -10, 10, 0], scale: 1.09 } }}
          transition={{ duration: 0.6 }}
          className="flex h-11 w-11 items-center justify-center border border-cyber-tan/30 bg-cyber-tan/5 text-cyber-tan"
        >
          <span className="h-5 w-5">
            <svg
              viewBox="0 0 24 24"
              className="h-full w-full"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {benefit.icon}
            </svg>
          </span>
        </motion.div>
        <span className="font-mono text-[10px] font-bold tracking-[0.28em] text-cyber-blue/50">{benefit.id}</span>
      </div>

      <div className="relative z-[1] flex flex-col gap-1.5">
        <span className="font-mono text-[9px] font-bold tracking-[0.3em] text-cyber-tan/70">{`// ${benefit.tag}`}</span>
        <h3 className="font-heading text-[13px] leading-snug text-white uppercase">{benefit.title}</h3>
        <p className="font-mono text-[11.5px] leading-relaxed text-cyber-gray">{benefit.blurb}</p>
      </div>

      <div className="relative z-[1] mt-auto flex items-center gap-2 pt-2 font-mono text-[9px] tracking-widest text-cyber-gray/50">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-cyber-tan"
          animate={reduce ? undefined : { opacity: [1, 0.2, 1], scale: [1, 0.7, 1] }}
          transition={{ duration: 1.7, repeat: Infinity, delay: index * 0.22 }}
        />
        {`NODE_${benefit.id} // UNLOCKED`}
      </div>

      <AnimatePresence>
        {ping && (
          <motion.span
            key="ping"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.22 }}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center border-2 border-cyber-tan bg-cyber-black/75 font-mono text-[11px] font-bold tracking-[0.28em] text-cyber-tan"
          >
            ✓ ACCESS GRANTED
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function WhyJoinSection() {
  const reduce = useReducedMotion();

  return (
    <section
      id="why_join"
      className="crosshair-corner relative overflow-hidden border border-cyber-blue/10 bg-cyber-dark/20 p-6 md:p-8"
    >
      <CornerCrosshairs />

      {/* ambient drifting binary */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { l: "8%", d: 0, s: "10s" }, { l: "27%", d: 1.4, s: "13s" }, { l: "52%", d: 0.6, s: "11s" },
          { l: "71%", d: 2.1, s: "14s" }, { l: "88%", d: 1, s: "12s" },
        ].map((b, i) => (
          <motion.span
            key={i}
            className="absolute -bottom-6 font-mono text-[11px] text-cyber-blue/15"
            style={{ left: b.l }}
            animate={reduce ? undefined : { y: ["0%", "-1200%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: parseFloat(b.s), repeat: Infinity, ease: "linear", delay: b.d }}
          >
            {i % 2 === 0 ? "01001" : "1010"}
          </motion.span>
        ))}
      </div>

      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="relative flex max-w-2xl flex-col gap-2"
      >
        <span className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-cyber-tan uppercase">
          {"// SYSTEM_SEQUENCE_NODE_04"}
          <motion.span
            className="inline-block h-3 w-1.5 bg-cyber-tan"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
          />
        </span>
        <h2 className="font-heading text-xl tracking-tight text-white uppercase md:text-2xl">
          Why Join Hackurity
        </h2>
        <motion.div
          className="h-px w-full bg-gradient-to-r from-cyber-tan via-cyber-blue/40 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          style={{ originX: 0 }}
        />
        <p className="font-mono text-xs leading-relaxed text-cyber-gray">
          Twenty-four hours in a room with the right people. Here is everything a team walks away
          with — hover a node to inspect it, tap to acknowledge.
        </p>
      </motion.div>

      {/* keyword marquee */}
      <div className="relative mt-5 overflow-hidden border-y border-cyber-blue/10 bg-cyber-black/40 py-2">
        <motion.div
          className="flex w-max gap-6 whitespace-nowrap font-mono text-[10px] tracking-[0.3em] text-cyber-tan/55"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        >
          {[...MARQUEE, ...MARQUEE].map((word, i) => (
            <span key={i} className="flex items-center gap-6">
              {word}
              <span className="text-cyber-blue/35">◆</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* benefit grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
        className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {BENEFITS.map((benefit, index) => (
          <BenefitCard key={benefit.id} benefit={benefit} index={index} />
        ))}
      </motion.div>

      {/* IBM strip + CTA */}
      <motion.a
        href="#join_node"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -3 }}
        className="group relative mt-3 flex flex-col items-start gap-4 overflow-hidden border border-cyber-tan/30 bg-gradient-to-r from-cyber-tan/10 via-cyber-black/40 to-cyber-black/40 p-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-cyber-tan/20 to-transparent"
          animate={reduce ? undefined : { x: ["0%", "400%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative flex items-center gap-4">
          <motion.img
            src="/sponsors/IBMBOB.png"
            alt="IBM Bob"
            className="h-10 w-auto object-contain"
            animate={reduce ? undefined : { y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div>
            <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-cyber-tan uppercase">
              Powered by IBM
            </p>
            <p className="mt-1 font-mono text-xs leading-relaxed text-cyber-gray">
              The people building it will be on the floor. Bring your questions.
            </p>
          </div>
        </div>
        <span className="relative flex shrink-0 items-center gap-2 border border-cyber-tan/50 bg-cyber-tan/10 px-4 py-2.5 font-mono text-[11px] font-bold tracking-[0.2em] text-cyber-tan uppercase transition-colors group-hover:bg-cyber-tan/20">
          Lock in your team
          <motion.span
            animate={reduce ? undefined : { x: [0, 5, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            →
          </motion.span>
        </span>
      </motion.a>
    </section>
  );
}

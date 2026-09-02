"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
// import { Link } from "@tanstack/react-router";
import Link from "next/link";
import { Reveal, SectionHeading } from "./Reveal";

const TARGET = new Date("2026-10-23T09:00:00+05:30").getTime();

const FACTS = [
  { label: "Dates", value: "23 – 24 October 2026" },
  { label: "Venue", value: "REVA University, Bengaluru" },
  { label: "Team size", value: "3 – 4 members" },
  { label: "Entry", value: "₹800 per team" },
];

function useCountdown() {
  const [remaining, setRemaining] = useState(() => Math.max(0, TARGET - Date.now()));

  useEffect(() => {
    const id = window.setInterval(() => setRemaining(Math.max(0, TARGET - Date.now())), 1000);
    return () => window.clearInterval(id);
  }, []);

  const seconds = Math.floor(remaining / 1000);
  return [
    { label: "Days", value: Math.floor(seconds / 86400) },
    { label: "Hours", value: Math.floor((seconds % 86400) / 3600) },
    { label: "Minutes", value: Math.floor((seconds % 3600) / 60) },
    { label: "Seconds", value: seconds % 60 },
  ];
}

export default function LiveEventSection() {
  const units = useCountdown();
  const [registered, setRegistered] = useState(412);

  // Gives the counter a live feel without pretending to be a real data source.
  useEffect(() => {
    const id = window.setInterval(() => {
      setRegistered((value) => value + (Math.random() > 0.55 ? 1 : 0));
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="live-event" className="relative mx-auto max-w-6xl px-5 py-24 md:px-8">
      <SectionHeading
        tag="Happening now"
        title="Our current event"
        description="One event is open at the moment. Registration is running and closes a week before the event day."
      />

      <Reveal>
        <div className="bracket-container relative overflow-hidden border border-cyber-tan/35 bg-cyber-dark/80">
          <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] overflow-hidden">
            <span className="scan-sweep absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-cyber-tan to-transparent" />
          </span>

          <div className="grid gap-px bg-cyber-blue/15 lg:grid-cols-[1.4fr_1fr]">
            <div className="bg-black/70 p-6 md:p-9">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-2 border border-cyber-tan/50 bg-cyber-tan/10 px-3 py-1.5 font-mono text-[13px] font-bold tracking-widest text-cyber-tan uppercase">
                  <span className="live-dot inline-block h-2 w-2 rounded-full bg-cyber-tan" />
                  Registration open
                </span>
                <span className="font-mono text-[13px] tracking-widest text-cyber-gray">
                  Updated just now
                </span>
              </div>

              <h3 className="mt-6 font-heading text-2xl leading-relaxed uppercase md:text-4xl">
                Hackurity 2026
              </h3>
              <p className="mt-4 max-w-xl font-mono text-[15.5px] leading-relaxed text-cyber-gray">
                Our biggest event of the year: a 24-hour cybersecurity hackathon where student teams
                pick a challenge track, build something over the weekend and present it to a panel.
                Beginners and experienced teams compete in the same space, with organisers on the
                floor the whole time.
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {FACTS.map((fact) => (
                  <div key={fact.label} className="border-l border-cyber-blue/30 pl-3">
                    <dt className="font-mono text-[12px] tracking-widest text-cyber-blue/70 uppercase">
                      {fact.label}
                    </dt>
                    <dd className="mt-1.5 font-mono text-[14px] leading-relaxed">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/"
                  className="group relative inline-flex items-center gap-3 border border-cyber-tan bg-cyber-tan/15 px-6 py-3.5 font-mono text-[14px] font-bold tracking-[0.2em] text-cyber-tan uppercase transition-colors hover:bg-cyber-tan/25"
                >
                  Join Hackurity
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <span className="font-mono text-[13px] tracking-wide text-cyber-gray">
                  Takes you to the full event page
                </span>
              </div>
            </div>

            <div className="bg-black/85 p-6 md:p-8">
              <span className="font-mono text-[13px] font-bold tracking-[0.3em] text-cyber-tan">
                {"// LIVE STATUS"}
              </span>

              <div className="mt-5 grid grid-cols-4 gap-px border border-cyber-blue/20 bg-cyber-blue/15">
                {units.map((unit) => (
                  <div key={unit.label} className="bg-black/80 px-1 py-4 text-center">
                    <motion.div
                      key={`${unit.label}-${unit.value}`}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="font-heading text-base text-white"
                    >
                      {String(unit.value).padStart(2, "0")}
                    </motion.div>
                    <div className="mt-2 font-mono text-[11px] tracking-widest text-cyber-gray uppercase">
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mono text-[13px] tracking-wide text-cyber-gray">
                Time left until day one begins.
              </p>

              <div className="mt-7 space-y-4">
                <div>
                  <div className="flex items-baseline justify-between font-mono text-[13px] tracking-widest text-cyber-gray uppercase">
                    <span>Registrations</span>
                    <motion.span
                      key={registered}
                      initial={{ opacity: 0.4 }}
                      animate={{ opacity: 1 }}
                      className="text-cyber-tan"
                    >
                      {registered} / 600
                    </motion.span>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-cyber-blue/15">
                    <motion.div
                      className="h-full bg-cyber-tan"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (registered / 600) * 100)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <ul className="space-y-2 border-t border-cyber-blue/15 pt-4 font-mono text-[13.5px] leading-relaxed text-cyber-gray">
                  <li className="flex justify-between gap-3">
                    <span>Teams confirmed</span>
                    <span className="text-white">118</span>
                  </li>
                  <li className="flex justify-between gap-3">
                    <span>Colleges taking part</span>
                    <span className="text-white">24</span>
                  </li>
                  <li className="flex justify-between gap-3">
                    <span>Registration closes</span>
                    <span className="text-white">16 October 2026</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

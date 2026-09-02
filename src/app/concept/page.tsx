"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BracketFrame, ScrambleText, GradientUnderline, RotatingFactPanel } from "@/components/TechElements";

const FACTS = [
  { k: "BUILD WINDOW", v: "24 hours // on-site" },
  { k: "TEAM SIZE", v: "3 – 4 members" },
  { k: "TRACKS", v: "3 tracks // 2 problems each" },
  { k: "ENTRY", v: "₹800 per team" },
  { k: "VENUE", v: "REVA University, Bengaluru" },
];

const MARQUEE = [
  "24H BUILD", "3 TRACKS", "CASH PRIZES", "IBM MENTORS", "OPEN SOURCE",
  "REAL PROBLEMS", "CERTIFICATE", "NEW NETWORK", "SPOT GIFTS",
];

const TRACKS = [
  { id: "TRK-A", name: "AI + Security Crossover", brief: "Secure AI systems or use AI to secure things — stop model theft, prompt injection, data poisoning, or build smarter defenses." },
  { id: "TRK-B", name: "Cybersecurity in IoT", brief: "Secure connected devices, sensors and embedded systems — from firmware and wireless protocols to the networks that tie them together." },
  { id: "TRK-C", name: "Web3 / Blockchain Security", brief: "Break or defend smart contracts, wallets and decentralized systems where a single bug can move real money." },
];

export default function ConceptPage() {
  return (
    <div className="hackurity-root min-h-screen bg-cyber-black text-white font-mono">
      {/* Minimal top bar */}
      <header className="flex items-center justify-between border-b border-cyber-blue/10 px-6 py-4">
        <Link href="/hackurity" className="font-heading text-sm tracking-widest text-white uppercase hover:text-cyber-tan transition-colors">
          ← Hackurity 2026
        </Link>
        <span className="font-mono text-[11px] tracking-[0.3em] text-cyber-gray/60 uppercase">Design concept // not live</span>
      </header>

      {/* ── HERO ── */}
      <section className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden px-6 py-16 md:px-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 cyber-grid opacity-40" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(122,124,246,0.14),transparent_70%)]" />

        <div className="relative z-[1] mx-auto flex w-full max-w-5xl flex-col items-start gap-10 md:flex-row md:items-center md:justify-between">
          <RotatingFactPanel facts={FACTS} className="w-full max-w-xs" />

          <div className="flex max-w-xl flex-col items-start gap-4">
            <span className="font-mono text-[12px] font-bold tracking-[0.3em] text-cyber-tan uppercase">// unleash the power of</span>
            <div className="flex flex-col gap-1">
              <h1 className="font-heading text-4xl leading-tight tracking-tight text-white uppercase md:text-5xl">
                Cybersecurity
              </h1>
              <GradientUnderline className="max-w-[280px]" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="font-heading text-4xl leading-tight tracking-tight text-white uppercase md:text-5xl">
                on your terms
              </h1>
              <GradientUnderline className="max-w-[240px]" />
            </div>
            <p className="mt-2 font-mono text-sm leading-relaxed text-cyber-gray md:text-base">
              A 24-hour national-level hackathon — pick a track, break something, build the fix. Powered by IBM, run by the REVA Cybersecurity Club.
            </p>
            <div className="mt-4">
              <BracketFrame className="inline-block">
                <a
                  href="#tracks"
                  className="block px-6 py-3 font-mono text-sm font-bold tracking-widest text-cyber-tan uppercase transition-colors hover:text-white"
                >
                  <ScrambleText text="[ Register Now ]" />
                </a>
              </BracketFrame>
            </div>
          </div>
        </div>

        <div className="relative z-[1] mx-auto mt-16 flex w-full max-w-5xl items-center justify-end gap-2 font-mono text-[11px] tracking-[0.3em] text-cyber-gray/50 uppercase">
          <BracketFrame className="inline-flex">
            <span className="flex items-center gap-2 px-3 py-1.5">
              scroll
              <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>
                ↓
              </motion.span>
            </span>
          </BracketFrame>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="relative overflow-hidden border-y border-cyber-blue/10 bg-cyber-dark/40 py-3">
        <motion.div
          className="flex w-max gap-8 whitespace-nowrap font-mono text-[13px] tracking-[0.3em] text-cyber-tan/60"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {[...MARQUEE, ...MARQUEE].map((word, i) => (
            <span key={i} className="flex items-center gap-8">
              {word}
              <span className="text-cyber-blue/40">◆</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── TRACKS (glass panels) ── */}
      <section id="tracks" className="mx-auto max-w-5xl px-6 py-20 md:px-12">
        <div className="mb-10 flex flex-col gap-3">
          <span className="font-mono text-[12px] font-bold tracking-[0.3em] text-cyber-tan uppercase">// solutions</span>
          <h2 className="font-heading text-2xl tracking-tight text-white uppercase md:text-3xl">Pick your track</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {TRACKS.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative overflow-hidden border border-cyber-blue/15 p-6"
              style={{
                background: "linear-gradient(330deg, rgba(37,37,42,0.85), rgba(18,18,23,0.85) 80%)",
                backdropFilter: "blur(24px)",
              }}
            >
              <span className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-cyber-tan" />
              <span className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-cyber-tan" />
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] font-bold tracking-widest text-cyber-blue/70">{track.id}</span>
              </div>
              <h3 className="mt-3 font-heading text-lg leading-snug text-white uppercase">{track.name}</h3>
              <p className="mt-3 font-mono text-[13.5px] leading-relaxed text-cyber-gray">{track.brief}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative overflow-hidden border-t border-cyber-blue/10 px-6 py-20 text-center md:px-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(221,198,162,0.1),transparent_70%)]" />
        <div className="relative z-[1] mx-auto flex max-w-2xl flex-col items-center gap-5">
          <h2 className="font-heading text-2xl tracking-tight text-white uppercase md:text-3xl">
            Ready to <span className="bg-gradient-to-r from-cyber-tan to-cyber-blue bg-clip-text text-transparent">decode</span> the challenge?
          </h2>
          <p className="font-mono text-sm text-cyber-gray">14 – 15 October 2026 · REVA University, Bengaluru</p>
          <BracketFrame className="inline-block">
            <a
              href="/hackurity#join_node"
              className="block px-8 py-3 font-mono text-sm font-bold tracking-widest text-cyber-tan uppercase transition-colors hover:text-white"
            >
              <ScrambleText text="[ Lock In Your Team ]" />
            </a>
          </BracketFrame>
        </div>
      </section>
    </div>
  );
}

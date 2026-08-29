"use client";
import React from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import BinaryFlowField from "@/components/club/BinaryFlowField";
import ClubNav from "@/components/club/ClubNav";
import AboutSection from "@/components/club/AboutSection";
import LiveEventSection from "@/components/club/LiveEventSection";
import MembersSection from "@/components/club/MembersSection";
import FacultySection from "@/components/club/FacultySection";

export default function ClubHome() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <div id="top" className="club-root club-scroll relative min-h-screen overflow-x-hidden">
      <BinaryFlowField />
      <ClubNav />

      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-cyber-tan"
        aria-hidden="true"
      />

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-10 px-5 pt-28 pb-16 md:px-8 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col justify-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[11px] font-bold tracking-[0.35em] text-cyber-tan uppercase"
          >
            REVA University · Bengaluru · Since 2024
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 max-w-3xl font-heading text-3xl leading-[1.35] uppercase md:text-5xl md:leading-[1.3]"
          >
            REVA Cybersecurity Club
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-7 max-w-xl font-mono text-[14px] leading-relaxed text-cyber-gray"
          >
            A student group that meets every week to learn how systems get broken into, and how to
            keep them safe. Open to anyone on campus, whatever year you are in and whatever you
            already know.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="#about"
              className="inline-flex items-center gap-2 border border-cyber-tan bg-cyber-tan/15 px-6 py-3.5 font-mono text-[12px] font-bold tracking-[0.2em] text-cyber-tan uppercase transition-colors hover:bg-cyber-tan/25"
            >
              About the club
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 w-full max-w-2xl"
          >
            <Link
              href="/hackurity"
              className="group relative block overflow-hidden border border-cyber-tan/30 bg-black/40 backdrop-blur-sm transition-all duration-300 hover:border-cyber-tan/80 hover:shadow-tan"
            >
              {/* top scan line */}
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber-tan to-transparent opacity-70" />
              {/* soft glow that grows on hover */}
              <span className="pointer-events-none absolute -left-24 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-cyber-tan/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-60" />
              {/* corner ticks */}
              <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-cyber-tan/70" />
              <span className="pointer-events-none absolute right-0 bottom-0 h-3 w-3 border-r border-b border-cyber-tan/70" />

              <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-6">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.3em] text-cyber-tan uppercase">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber-tan opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyber-tan" />
                    </span>
                    {"// Upcoming event"}
                  </p>

                  <p className="mt-3 font-heading text-2xl leading-none uppercase tracking-wide text-white sm:text-3xl">
                    Hackurity <span className="text-cyber-tan">2026</span>
                  </p>

                  <div className="mt-3 h-px w-16 bg-gradient-to-r from-cyber-tan to-transparent transition-all duration-300 group-hover:w-28" />

                  <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] leading-none text-cyber-gray">
                    <span className="flex items-center gap-2">
                      Powered by
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/sponsors/IBMBOB.jpg"
                        alt="IBM Bob"
                        className="h-6 w-auto object-contain opacity-90 transition-opacity group-hover:opacity-100"
                      />
                      <span className="font-sans text-xs font-bold text-white">IBM Bob</span>
                    </span>
                    <span className="hidden h-3 w-px bg-cyber-blue/30 sm:inline-block" />
                    <span>a 24-hour cybersecurity hackathon</span>
                  </div>
                </div>

                <span className="flex shrink-0 items-center justify-center gap-2 border border-cyber-tan/50 bg-cyber-tan/10 px-5 py-3 font-mono text-[11px] font-bold tracking-[0.2em] text-cyber-tan uppercase transition-colors group-hover:bg-cyber-tan/25">
                  Explore
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </motion.div>


          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-20 flex items-center gap-3 font-mono text-[11px] tracking-widest text-cyber-gray uppercase"
          >
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              ↓
            </motion.span>
            Scroll to explore
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hidden w-72 shrink-0 justify-self-center overflow-hidden rounded-sm bg-white p-6 shadow-[0_0_40px_rgba(210,180,140,0.15)] lg:block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/reva-university-logo.png"
            alt="REVA University"
            className="h-auto w-full object-contain"
          />
        </motion.div>
        </section>

        <LiveEventSection />
        <AboutSection />
        <FacultySection />
        <MembersSection />

        <footer className="relative border-t border-cyber-blue/15 bg-black/70 px-5 py-12 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5">
            <div>
              <p className="font-heading text-[12px] tracking-[0.22em] uppercase">
                Cybersecurity Club <span className="text-cyber-tan">//</span> REVA University
              </p>
              <p className="mt-2 font-mono text-[11px] text-cyber-gray">
                School of Computer Science and Engineering, Bengaluru, Karnataka
              </p>
            </div>
            <div className="flex items-center gap-5">
              <a
                href="mailto:cyberclub@reva.edu.in"
                className="font-mono text-[11px] tracking-widest text-cyber-blue uppercase hover:text-cyber-tan"
              >
                cyberclub@reva.edu.in ↗
              </a>
              <a
                href="https://www.linkedin.com/company/cybersecurity-club-reva/posts/?feedView=all"
                target="_blank"
                rel="noreferrer"
                aria-label="REVA Cybersecurity Club on LinkedIn"
                className="flex h-8 w-8 items-center justify-center border border-cyber-blue/30 text-cyber-blue transition-colors hover:border-cyber-tan hover:text-cyber-tan"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/reva_cybersecurity_official?igsi=ZmM2MDIzNDR2dHN1"
                target="_blank"
                rel="noreferrer"
                aria-label="REVA Cybersecurity Club on Instagram"
                className="flex h-8 w-8 items-center justify-center border border-cyber-blue/30 text-cyber-blue transition-colors hover:border-cyber-tan hover:text-cyber-tan"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

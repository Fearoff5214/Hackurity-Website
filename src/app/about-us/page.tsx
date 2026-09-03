"use client";
import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import SiteNav from "@/components/SiteNav";
import CyberCursor from "@/components/CyberCursor";
import CampusLogo from "@/components/CampusLogo";
import BinaryFlowField from "@/components/club/BinaryFlowField";
import AboutSection from "@/components/club/AboutSection";
import MembersSection from "@/components/club/MembersSection";
import FacultySection from "@/components/club/FacultySection";
import GallerySection from "@/components/club/GallerySection";

export default function ClubHome() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <div id="top" className="club-root club-scroll relative min-h-screen overflow-x-hidden">
      <CyberCursor />
      <CampusLogo primary="club" />
      <BinaryFlowField />

      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-cyber-tan"
        aria-hidden="true"
      />

      <SiteNav
        basePath="/"
        initialSection="ABOUT US"
        backLink={{ href: "/", label: "Back to Hackurity" }}
        showBrand={false}
        showRegister={false}
        centerNav
      />

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto flex min-h-[65vh] max-w-6xl flex-col items-center justify-center px-5 py-16 text-center md:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 whitespace-nowrap font-heading text-lg uppercase sm:text-2xl md:text-3xl"
          >
            REVA Cybersecurity Club
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-3 flex flex-wrap items-center justify-center gap-2 font-heading text-lg uppercase text-cyber-tan sm:text-2xl md:text-3xl"
          >
            <span className="text-3xl text-white sm:text-4xl md:text-5xl" aria-hidden="true">X</span> B.Tech in IoT &amp; Cybersecurity (School of CSE)
          </motion.p>
        </section>
        <AboutSection />
        <FacultySection />
        <GallerySection />
        <MembersSection />

        <footer className="relative border-t border-cyber-blue/15 bg-black/70 px-5 py-12 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5">
            <div>
              <p className="font-heading text-[14px] tracking-[0.22em] uppercase">
                REVA Cybersecurity Club <span className="text-cyber-tan">//</span> REVA University
              </p>
              <p className="mt-2 font-mono text-[13px] text-cyber-gray">
                School of Computer Science and Engineering, Bengaluru, Karnataka
              </p>
            </div>
            <div className="flex items-center gap-5">
              <a
                href="mailto:cyberclub@reva.edu.in"
                className="font-mono text-[13px] tracking-widest text-cyber-blue uppercase hover:text-cyber-tan"
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

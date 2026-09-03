"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Navigation links — also drive the scroll-spy that highlights the active section.
// Hash links are resolved against `basePath` so this same list works both on the
// home page (where the sections live) and on other routes (which link back to them).
const navLinks = [
  { name: "HOME", label: "MISSION_BRIEF", href: "#mission_brief" },
  { name: "TRACKS", label: "CHALLENGE_TRACKS", href: "#ctf_challenges" },
  { name: "TIMELINE", label: "EVENT_TIMELINE", href: "#event_flow" },
  { name: "REWARDS", label: "OPERATOR_REWARDS", href: "#why_join" },
  { name: "FAQ", label: "QUERY_TERMINAL", href: "#query_terminal" },
  { name: "SPONSORS", label: "SPONSOR_NOW", href: "#sponsor_now" },
  { name: "CONTACT US", label: "CONTACT_US", href: "#contact_us" },
  { name: "ABOUT US", label: "ABOUT_HACKURITY", href: "/about-us" },
];

type SiteNavProps = {
  /** Prefixed onto "#section" links so they navigate back to the home page from elsewhere. */
  basePath?: string;
  /** Nav item highlighted before the scroll-spy takes over (a no-op on pages without those sections). */
  initialSection?: string;
  /** Extra shortcut shown only in the mobile menu. Omitted → no back link is rendered. */
  backLink?: { href: string; label: string };
  /** Show the Hackurity icon + "HACKURITY // 2026" wordmark on the left. */
  showBrand?: boolean;
  /** Show the "Register Now" shortcut (desktop button and mobile menu entry). */
  showRegister?: boolean;
  /** Center the desktop nav links across the full bar instead of packing them next to the brand/register slots. */
  centerNav?: boolean;
};

export default function SiteNav({
  basePath = "",
  initialSection = "HOME",
  backLink,
  showBrand = true,
  showRegister = true,
  centerNav = false,
}: SiteNavProps) {
  const [currentSection, setCurrentSection] = useState(initialSection);

  // Navbar behaviour: locks into "attack mode" once the user scrolls past the hero fold.
  const [navAttack, setNavAttack] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const resolveHref = (href: string) => (href.startsWith("#") ? `${basePath}${href}` : href);

  // One rAF-throttled scroll pass drives both the "attack mode" navbar and the
  // scroll-spy highlight — no layout reads on the raw scroll event.
  useEffect(() => {
    const sections = navLinks
      .filter((link) => link.href.startsWith("#"))
      .map((link) => {
        const el = document.querySelector(link.href);
        return el instanceof HTMLElement ? { name: link.name, el } : null;
      })
      .filter((entry): entry is { name: string; el: HTMLElement } => entry !== null);

    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setNavAttack(y > 90);
      if (sections.length === 0) return;
      const probe = y + window.innerHeight * 0.3;
      let nextName = sections[0].name;
      for (const section of sections) {
        if (section.el.getBoundingClientRect().top + y - 1 <= probe) nextName = section.name;
      }
      setCurrentSection((prev) => (prev === nextName ? prev : nextName));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: navAttack ? "rgba(3,3,12,0.96)" : "rgba(0,0,0,0.82)",
          paddingTop: navAttack ? 8 : 14,
          paddingBottom: navAttack ? 8 : 14,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 w-full select-none border-b px-4 backdrop-blur-md md:px-8 ${
          navAttack ? "border-cyber-tan/30 nav-attack" : "border-cyber-blue/10"
        }`}
      >
        {/* Attack-mode scan line */}
        <AnimatePresence>
          {navAttack && (
            <motion.span
              key="nav-scan"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] overflow-hidden"
            >
              <motion.span
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-cyber-tan to-transparent"
                animate={{ x: ["-40%", "340%"] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
              />
            </motion.span>
          )}
        </AnimatePresence>

        <div
          className={
            centerNav
              ? "grid grid-cols-[1fr_auto_1fr] items-center gap-3"
              : "flex items-center justify-between gap-3"
          }
        >
          {centerNav && !showBrand && <div aria-hidden="true" />}
          {showBrand && (
            <a href={resolveHref("#mission_brief")} className="flex shrink-0 items-center gap-2.5">
              <motion.svg
                viewBox="0 0 100 100"
                animate={navAttack ? { rotate: [0, -4, 4, 0] } : { rotate: 0 }}
                transition={{ duration: navAttack ? 3 : 0.35, repeat: navAttack ? Infinity : 0, ease: "easeInOut" }}
                className={`fill-none stroke-cyber-tan stroke-[6] drop-shadow-[0_0_4px_rgba(99,102,241,0.8)] transition-all duration-350 ease-out ${
                  navAttack ? "h-7 w-7" : "h-8 w-8"
                }`}
              >
                <polygon points="50,15 85,80 15,80" />
                <polygon points="50,40 70,80 30,80" className="opacity-60 stroke-[4]" />
                <line x1="50" y1="15" x2="50" y2="80" className="opacity-40 stroke-[2] stroke-white" />
              </motion.svg>
              <AnimatePresence initial={false}>
                {!navAttack && (
                  <motion.span
                    key="nav-brand-text"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="overflow-hidden whitespace-nowrap font-heading text-[14px] font-bold tracking-[0.22em] text-white sm:text-xs"
                  >
                    HACKURITY <span className="text-cyber-tan">//</span> 2026
                  </motion.span>
                )}
              </AnimatePresence>
            </a>
          )}

          {/* Desktop navigation */}
          <nav
            aria-label="Primary navigation"
            className={`hidden items-center gap-6 lg:flex xl:gap-8 ${centerNav ? "justify-self-center" : ""}`}
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={resolveHref(link.href)}
                onClick={() => setCurrentSection(link.name)}
                className={`relative shrink-0 py-1 font-mono text-[13px] tracking-widest transition-colors duration-300 hover:text-cyber-tan ${
                  currentSection === link.name ? "font-bold text-cyber-tan" : "text-cyber-gray"
                }`}
              >
                {`[${link.name}]`}
                {currentSection === link.name && (
                  <motion.span
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 h-[1.5px] w-full bg-cyber-tan"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Right: register shortcut + mobile menu trigger */}
          <div className={`flex shrink-0 items-center gap-2 ${centerNav ? "justify-self-end" : ""}`}>
            {showRegister && (
              <a
                href={resolveHref("#join_node")}
                onClick={() => setCurrentSection("REGISTER")}
                className="hidden border border-cyber-tan/50 bg-cyber-tan/10 px-3 py-2 font-mono text-[13px] font-bold tracking-widest text-cyber-tan uppercase transition-colors hover:bg-cyber-tan/20 sm:inline-block"
              >
                Register Now
              </a>
            )}
            <button
              type="button"
              onClick={() => setNavOpen((open) => !open)}
              aria-expanded={navOpen}
              aria-label="Toggle navigation menu"
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-cyber-blue/30 bg-cyber-black/60 lg:hidden"
            >
              <motion.span
                animate={navOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="block h-[2px] w-5 bg-cyber-tan"
              />
              <motion.span
                animate={navOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block h-[2px] w-5 bg-cyber-tan"
              />
              <motion.span
                animate={navOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="block h-[2px] w-5 bg-cyber-tan"
              />
            </button>
          </div>
        </div>

        {/* Mobile navigation panel — every link visible at once, no sideways scrolling */}
        <AnimatePresence>
          {navOpen && (
            <motion.nav
              key="mobile-nav"
              aria-label="Mobile navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="overflow-hidden lg:hidden"
            >
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-cyber-blue/15 pt-3">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={resolveHref(link.href)}
                    onClick={() => {
                      setCurrentSection(link.name);
                      setNavOpen(false);
                    }}
                    className={`border px-3 py-3 font-mono text-[14px] tracking-widest transition-colors ${
                      currentSection === link.name
                        ? "border-cyber-tan/60 bg-cyber-tan/10 font-bold text-cyber-tan"
                        : "border-cyber-blue/20 bg-cyber-dark/70 text-cyber-gray"
                    }`}
                  >
                    {`[${link.name}]`}
                  </a>
                ))}
                {showRegister && (
                  <a
                    href={resolveHref("#join_node")}
                    onClick={() => {
                      setCurrentSection("REGISTER");
                      setNavOpen(false);
                    }}
                    className="col-span-2 border border-cyber-tan/60 bg-cyber-tan/15 px-3 py-3 text-center font-mono text-[14px] font-bold tracking-[0.2em] text-cyber-tan uppercase"
                  >
                    Register Now
                  </a>
                )}
                {backLink && (
                  <Link
                    href={backLink.href}
                    onClick={() => setNavOpen(false)}
                    className="col-span-2 flex items-center justify-center gap-1.5 border border-cyber-blue/20 bg-cyber-dark/70 px-3 py-3 text-center font-mono text-[14px] tracking-widest text-cyber-gray uppercase"
                  >
                    <span aria-hidden="true">←</span> {backLink.label}
                  </Link>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer so page content clears the fixed navbar */}
      <div
        aria-hidden="true"
        className={`transition-[height] duration-350 ease-out ${navAttack ? "h-[52px]" : "h-[60px]"}`}
      />
    </>
  );
}

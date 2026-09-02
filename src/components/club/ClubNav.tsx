"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
// import { Link } from "@tanstack/react-router";
import Link from "next/link";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Live Event", href: "#live-event" },
  { label: "Members", href: "#members" },
  { label: "Faculty", href: "#faculty" },
];

export default function ClubNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the nav item for whichever section is in view.
  useEffect(() => {
    const sections = LINKS
      .map((link) => {
        const el = document.querySelector(link.href);
        return el instanceof HTMLElement ? { href: link.href, el } : null;
      })
      .filter((entry): entry is { href: string; el: HTMLElement } => entry !== null);
    if (sections.length === 0) return;

    const onSpy = () => {
      const probe = window.scrollY + window.innerHeight * 0.3;
      let next = "";
      for (const section of sections) {
        const top = section.el.getBoundingClientRect().top + window.scrollY;
        if (top - 1 <= probe) next = section.href;
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        next = sections[sections.length - 1].href;
      }
      setActive((prev) => (prev === next ? prev : next));
    };

    onSpy();
    window.addEventListener("scroll", onSpy, { passive: true });
    window.addEventListener("resize", onSpy);
    return () => {
      window.removeEventListener("scroll", onSpy);
      window.removeEventListener("resize", onSpy);
    };
  }, []);

  return (
    <motion.header
      animate={{
        backgroundColor: scrolled ? "rgba(3,3,12,0.96)" : "rgba(0,0,0,0.75)",
        paddingTop: scrolled ? 8 : 14,
        paddingBottom: scrolled ? 8 : 14,
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 w-full border-b px-4 backdrop-blur-md md:px-8 ${
        scrolled ? "border-cyber-tan/30" : "border-cyber-blue/10"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <a href="#top" className="flex min-w-0 shrink items-center gap-2.5">
          <motion.div
            animate={scrolled ? { rotate: [0, -4, 4, 0] } : { rotate: 0 }}
            transition={{ duration: scrolled ? 3 : 0.35, repeat: scrolled ? Infinity : 0 }}
            className={`shrink-0 transition-all ${scrolled ? "h-8 w-8" : "h-9 w-9"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/club-logo-icon.png" alt="" className="h-full w-full object-contain" />
          </motion.div>
          <span className="truncate font-heading text-[12px] font-bold tracking-[0.14em] sm:text-xs sm:tracking-[0.22em]">
            CYBERSECURITY CLUB REVA
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={active === link.href ? "true" : undefined}
              className={`font-mono text-[13px] tracking-widest uppercase transition-colors hover:text-cyber-tan ${
                active === link.href ? "font-bold text-cyber-tan" : "text-cyber-gray"
              }`}
            >
              {`[${link.label}]`}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://www.linkedin.com/company/cybersecurity-club-reva/posts/?feedView=all"
            target="_blank"
            rel="noreferrer"
            aria-label="REVA Cybersecurity Club on LinkedIn"
            className="hidden h-9 w-9 items-center justify-center border border-cyber-blue/30 text-cyber-blue transition-colors hover:border-cyber-tan hover:text-cyber-tan sm:flex"
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
            className="hidden h-9 w-9 items-center justify-center border border-cyber-blue/30 text-cyber-blue transition-colors hover:border-cyber-tan hover:text-cyber-tan sm:flex"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <Link
            href="/hackurity"
            className="hidden border border-cyber-tan/50 bg-cyber-tan/10 px-3 py-2 font-mono text-[13px] font-bold tracking-widest text-cyber-tan uppercase transition-colors hover:bg-cyber-tan/20 sm:inline-block"
          >
            Hackurity 2026
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-cyber-blue/30 bg-black/60 lg:hidden"
          >
            <motion.span animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="block h-[2px] w-5 bg-cyber-tan" />
            <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="block h-[2px] w-5 bg-cyber-tan" />
            <motion.span animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="block h-[2px] w-5 bg-cyber-tan" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden lg:hidden"
          >
            <div className="mt-4 grid gap-1 border-t border-cyber-blue/15 pt-4">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active === link.href ? "true" : undefined}
                  className={`border px-3 py-2.5 font-mono text-[14px] tracking-widest uppercase transition-colors ${
                    active === link.href
                      ? "border-cyber-tan/50 bg-cyber-tan/10 font-bold text-cyber-tan"
                      : "border-cyber-blue/10 text-cyber-gray hover:border-cyber-tan/40 hover:text-cyber-tan"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/hackurity"
                onClick={() => setOpen(false)}
                className="border border-cyber-tan/50 bg-cyber-tan/10 px-3 py-2.5 font-mono text-[14px] font-bold tracking-widest text-cyber-tan uppercase"
              >
                Hackurity 2026
              </Link>
              <a
                href="https://www.linkedin.com/company/cybersecurity-club-reva/posts/?feedView=all"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 border border-cyber-blue/10 px-3 py-2.5 font-mono text-[14px] tracking-widest text-cyber-gray uppercase hover:border-cyber-tan/40 hover:text-cyber-tan"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
                </svg>
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com/reva_cybersecurity_official?igsi=ZmM2MDIzNDR2dHN1"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 border border-cyber-blue/10 px-3 py-2.5 font-mono text-[14px] tracking-widest text-cyber-gray uppercase hover:border-cyber-tan/40 hover:text-cyber-tan"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
                </svg>
                Instagram
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

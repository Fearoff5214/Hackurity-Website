import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Live Event", href: "#live-event" },
  { label: "Members", href: "#members" },
  { label: "Faculty", href: "#faculty" },
];

export default function ClubNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          <motion.svg
            viewBox="0 0 100 100"
            animate={scrolled ? { rotate: [0, -4, 4, 0] } : { rotate: 0 }}
            transition={{ duration: scrolled ? 3 : 0.35, repeat: scrolled ? Infinity : 0 }}
            className={`fill-none stroke-cyber-tan stroke-[6] transition-all ${scrolled ? "h-7 w-7" : "h-8 w-8"}`}
          >
            <polygon points="50,15 85,80 15,80" />
            <polygon points="50,40 70,80 30,80" className="stroke-[4] opacity-60" />
            <line x1="50" y1="15" x2="50" y2="80" className="stroke-white stroke-[2] opacity-40" />
          </motion.svg>
          <span className="font-heading text-[11px] font-bold tracking-[0.22em] sm:text-xs">
            CYBER CLUB <span className="text-cyber-tan">//</span> REVA
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[10px] tracking-widest text-cyber-gray uppercase transition-colors hover:text-cyber-tan"
            >
              {`[${link.label}]`}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/hackurity"
            className="hidden border border-cyber-tan/50 bg-cyber-tan/10 px-3 py-2 font-mono text-[10px] font-bold tracking-widest text-cyber-tan uppercase transition-colors hover:bg-cyber-tan/20 sm:inline-block"
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
                  className="border border-cyber-blue/10 px-3 py-2.5 font-mono text-[11px] tracking-widest text-cyber-gray uppercase hover:border-cyber-tan/40 hover:text-cyber-tan"
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/hackurity"
                onClick={() => setOpen(false)}
                className="border border-cyber-tan/50 bg-cyber-tan/10 px-3 py-2.5 font-mono text-[11px] font-bold tracking-widest text-cyber-tan uppercase"
              >
                Hackurity 2026
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

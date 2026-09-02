"use client";
// import type {Metadata} from "next";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  CornerCrosshairs,
  BracketFrame,
  SineWaveLoader,
  SimulatedLoadingBar,
} from "@/components/TechElements";
import EventPathway from "@/components/EventPathway";
import QueryTerminal from "@/components/QueryTerminal";
import SponsorZone from "@/components/SponsorZone";
import SiteLoader from "@/components/SiteLoader";
import BinaryStarfield from "@/components/BinaryStarfield";
import CyberCursor from "@/components/CyberCursor";
import CampusLogo from "@/components/CampusLogo";
import { ContactSection, JudgesSection, PartnersSection } from "@/components/CommunityShowcase";
import CreatorsSection from "@/components/CreatorsSection";
import WhyJoinSection from "@/components/WhyJoinSection";
import HackurityCountdown from "@/components/HackurityCountdown";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { submitRegistration as submitRegistrationToSupabase } from "@/lib/submissions";

// export const metadata: Metadata = {
//   title: "Hackurity 2026 — REVA University, Bengaluru",
//   description: "Hackurity 2026, powered by IBM — a cybersecurity hackathon for the next generation of defenders.",
//   alternates: {canonical: "https://revacyberclub.tech/hackurity"},
//   openGraph: {
//     type: "website",
//     title: "Hackurity 2026 — REVA University, Bengaluru",
//     description: "Hackurity 2026, powered by IBM — a cybersecurity hackathon for the next generation of defenders.",
//     url: "https://revacyberclub.tech/hackurity",
//   },
// };
// Dynamically import WebGL elements to prevent SSR issues
const BinaryFace = dynamic(() => import("@/components/BinaryFace"), {
  ssr: false,
  loading: () => null,
});


// Navigation Links — also drive the scroll-spy that highlights the active section.
const navLinks = [
  { name: "MISSION", label: "MISSION_BRIEF", href: "#mission_brief" },
  { name: "TRACKS", label: "CHALLENGE_TRACKS", href: "#ctf_challenges" },
  { name: "TIMELINE", label: "EVENT_TIMELINE", href: "#event_flow" },
  { name: "REWARDS", label: "OPERATOR_REWARDS", href: "#why_join" },
  { name: "FAQ", label: "QUERY_TERMINAL", href: "#query_terminal" },
  { name: "SPONSORS", label: "SPONSOR_NOW", href: "#sponsor_now" },
  // { name: "REGISTER", label: "REGISTER_NOW", href: "#join_node" },
  { name: "CONTACT US", label: "CONTACT_US", href: "#contact_us" },
  { name: "CREATORS", label: "MEET_THE_CREATORS", href: "#meet_the_creators" },
];

export default function Home() {
  const [currentSection, setCurrentSection] = useState("MISSION");

  // Registration states
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState("3");
  const [university, setUniversity] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [members, setMembers] = useState([{ name: "", email: "", role: "", portfolio: "" },{ name: "", email: "", role: "", portfolio: "" },{ name: "", email: "", role: "", portfolio: "" },]);
  const [projectIdea, setProjectIdea] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedConduct, setAcceptedConduct] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [isSubmittingRegistration, setIsSubmittingRegistration] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [universityPlaceholder, setUniversityPlaceholder] = useState("");
  const [portfolioPlaceholder, setPortfolioPlaceholder] = useState("");

  // Google sign-in gate: registration can only be submitted by an authenticated user.
  // Client is created lazily in an effect (never during SSR/build prerendering),
  // so a missing Supabase env var can't take down the whole page build.
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [existingRegistration, setExistingRegistration] = useState<{ teamName: string } | null>(null);
  const [checkingRegistration, setCheckingRegistration] = useState(false);

  useEffect(() => {
    let client: ReturnType<typeof createClient>;
    try {
      client = createClient();
    } catch (err) {
      console.error("Supabase client could not be created — check env vars:", err);
      return;
    }
    setSupabase(client);

    const syncUser = async (nextUser: User | null) => {
      setUser(nextUser);
      if (!nextUser) {
        setExistingRegistration(null);
        return;
      }
      setCheckingRegistration(true);
      const { data, error } = await client
        .from("registrations")
        .select("team_name")
        .eq("user_id", nextUser.id)
        .maybeSingle();
      if (error) {
        console.error("Could not check for an existing registration:", error);
      }
      setExistingRegistration(data ? { teamName: data.team_name } : null);
      setCheckingRegistration(false);
    };

    client.auth.getUser().then(({ data }) => syncUser(data.user ?? null));
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      syncUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/hackurity` },
    });
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  // Navbar behaviour: locks into "attack mode" once the user scrolls past the hero fold.
  const [navAttack, setNavAttack] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  // One rAF-throttled scroll pass drives both the "attack mode" navbar and the
  // scroll-spy highlight — no layout reads on the raw scroll event.
  useEffect(() => {
    const sections = navLinks
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
      if (y + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        nextName = sections[sections.length - 1].name;
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


  const DOMAINS = [
    { id: "TRK-A", name: "AI + Security Crossover", brief: "Secure AI systems or use AI to secure things — stop model theft, prompt injection, data poisoning, or build smarter defenses." },
    { id: "TRK-B", name: "Cybersecurity in IoT", brief: "Secure connected devices, sensors and embedded systems — from firmware and wireless protocols to the networks that tie them together." },
    { id: "TRK-C", name: "Web3 / Blockchain Security", brief: "Break or defend smart contracts, wallets and decentralized systems where a single bug can move real money." },
  ];

  const roleOptions = ["Developer", "Presentator", "Researcher", "Designer", "Here for food 😂"];
  // Replace these with the final public URLs (for example, /documents/terms.pdf) when the PDFs are ready.
  const termsAndConditionsUrl = "http://127.0.0.1:5500/legacy-hackurity/index.html#";
  const codeOfConductUrl = "http://127.0.0.1:5500/legacy-hackurity/index.html#";

  useEffect(() => {
    const startTypingLoop = (samples: string[], setText: React.Dispatch<React.SetStateAction<string>>, speed: number) => {
      let sampleIndex = 0;
      let characterIndex = 0;
      let isDeleting = false;
      let holdTicks = 0;

      return window.setInterval(() => {
        const sample = samples[sampleIndex];
        if (holdTicks > 0) {
          holdTicks -= 1;
          return;
        }
        characterIndex += isDeleting ? -1 : 1;
        setText(sample.slice(0, characterIndex));
        if (!isDeleting && characterIndex === sample.length) {
          holdTicks = 8;
          isDeleting = true;
        } else if (isDeleting && characterIndex === 0) {
          isDeleting = false;
          sampleIndex = (sampleIndex + 1) % samples.length;
        }
      }, speed);
    };

    const universityLoop = startTypingLoop([
      "REVA University", "Christ University", "Dayananda Sagar University", "Presidency University", "R.V. College of Engineering", "PES University", "Ramaiah Institute of Technology"
    ], setUniversityPlaceholder, 75);
    const portfolioLoop = startTypingLoop(["GitHub", "LinkedIn", "Personal Website", "Other"], setPortfolioPlaceholder, 110);

    return () => {
      window.clearInterval(universityLoop);
      window.clearInterval(portfolioLoop);
    };
  }, []);

  const TEAM_SIZE_OPTIONS = ["3", "4"] as const;

  const updateTeamSize = (value: string) => {
    const safeValue = TEAM_SIZE_OPTIONS.includes(value as typeof TEAM_SIZE_OPTIONS[number])
      ? value
      : TEAM_SIZE_OPTIONS[0];
    const size = Number(safeValue);
    setTeamSize(safeValue);
    setMembers((currentMembers) => Array.from(
      { length: size },
      (_, index) => currentMembers[index] ?? { name: "", email: "", role: "", portfolio: "" }
    ));
  };


  const updateMember = (index: number, field: "name" | "email" | "role" | "portfolio", value: string) => {
    setMembers((currentMembers) => currentMembers.map((member, memberIndex) => (
      memberIndex === index ? { ...member, [field]: value } : member
    )));
  };

  const membersAreComplete = members.every((member) => (
    member.name.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email) &&
    member.role
  ));

  const resetRegistration = () => {
    setRegistrationStep(1);
    setTeamName("");
    setTeamSize("3");
    setUniversity("");
    setSelectedDomain("");
    setExperienceLevel("");
    setMembers([{ name: "", email: "", role: "", portfolio: "" },      { name: "", email: "", role: "", portfolio: "" },      { name: "", email: "", role: "", portfolio: "" },]);
    setProjectIdea("");
    setAcceptedTerms(false);
    setAcceptedConduct(false);
    setRegistrationComplete(false);
    setRegistrationError("");
  };

  const submitRegistration = async () => {
    if (!user) {
      setRegistrationError("Sign in with Google to submit your registration.");
      return;
    }
    setIsSubmittingRegistration(true);
    setRegistrationError("");
    try {
      await submitRegistrationToSupabase({
        teamName,
        teamSize,
        university,
        domain: selectedDomain,
        experienceLevel,
        members: members.slice(0, Number(teamSize)),
        projectIdea,
        acceptedTerms,
        acceptedConduct,
      });
      setRegistrationComplete(true);
    } catch (err) {
      setRegistrationError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsSubmittingRegistration(false);
    }
  };

  const inputClass = "w-full bg-cyber-dark border border-cyber-tan/30 px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyber-tan focus:shadow-tan transition-all placeholder:text-cyber-gray/40 rounded-none";
  const stepOneReady = Boolean(teamName.trim() && university.trim() && selectedDomain && experienceLevel);
  const stepThreeReady = Boolean(acceptedTerms && acceptedConduct && user && !existingRegistration);

  return (
    <div className="hackurity-root min-h-screen bg-cyber-black text-white relative font-mono cyber-grid">
      {/* Custom targeting-reticle cursor (desktop / fine pointers only) */}
      <CyberCursor />

      {/* Campus emblem — top-right under the navbar, flips to the club shield on hover */}
      <CampusLogo />

      {/* Site boot sequence */}
      <SiteLoader />

      {/* Ambient animated background: gradient glows + binary starfield + magenta glitter */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 ambient-glow" />
      <BinaryStarfield />

      {/* Interactive cognitive-face backdrop — follows the cursor across the whole page */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
        <div className="relative h-[92vh] w-full max-w-5xl opacity-95">
          <BinaryFace background />
        </div>
      </div>

      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(122,124,246,0.11)_0%,transparent_62%)] pointer-events-none" />

      {/* 1. NAVIGATION BAR — fixed to top, compacts on scroll */}
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

        <div className="flex items-center justify-between gap-3">
          <a href="#mission_brief" className="flex shrink-0 items-center gap-2.5">
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

          {/* Desktop navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-6 lg:flex xl:gap-8"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
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
          <div className="flex shrink-0 items-center gap-2">
            <a
              href="#join_node"
              onClick={() => setCurrentSection("REGISTER")}
              className="hidden border border-cyber-tan/50 bg-cyber-tan/10 px-3 py-2 font-mono text-[13px] font-bold tracking-widest text-cyber-tan uppercase transition-colors hover:bg-cyber-tan/20 sm:inline-block"
            >
              Register Now
            </a>
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
                    href={link.href}
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
                <a
                  href="#join_node"
                  onClick={() => {
                    setCurrentSection("REGISTER");
                    setNavOpen(false);
                  }}
                  className="col-span-2 border border-cyber-tan/60 bg-cyber-tan/15 px-3 py-3 text-center font-mono text-[14px] font-bold tracking-[0.2em] text-cyber-tan uppercase"
                >
                  Register Now
                </a>
                <Link
                  href="/about-us"
                  onClick={() => setNavOpen(false)}
                  className="col-span-2 flex items-center justify-center gap-1.5 border border-cyber-blue/20 bg-cyber-dark/70 px-3 py-3 text-center font-mono text-[14px] tracking-widest text-cyber-gray uppercase"
                >
                  <span aria-hidden="true">←</span> Back to Cyber Club
                </Link>
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

      {/* Eyebrow banner — sits in the gap between the navbar and the hero card, above the face backdrop's eyes. Boxed to match the hero card below. */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-4 pt-4 md:px-8">
        <div className="crosshair-corner relative flex flex-col items-center gap-3 border border-cyber-blue/15 bg-cyber-dark/30 p-6 text-center backdrop-blur-md md:p-8">
          <CornerCrosshairs />
          <h2 className="font-heading text-lg tracking-tight text-white uppercase md:text-xl lg:text-2xl">
            National Level <span className="text-cyber-tan">Cybersecurity</span> Hackathon
          </h2>
          <span className="flex items-center justify-center gap-1.5 text-[14px] font-bold tracking-[0.3em] text-cyber-tan">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-cyber-tan" />
            <span>CTF_NODE_CONNECTED</span>
          </span>
          <h1 className="font-heading text-2xl leading-relaxed tracking-tight text-white uppercase text-glow-tan md:text-3xl lg:text-4xl">
            HACKURITY 2026
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span className="font-heading text-xl text-cyber-tan md:text-2xl">—</span>
            <span className="font-mono text-sm tracking-[0.25em] text-cyber-gray lowercase md:text-base">
              powered by
            </span>
            <span className="inline-flex items-center gap-1.5">
              <img src="/sponsors/IBMBOB.png" alt="IBM Bob" className="h-9 w-auto object-contain md:h-10 lg:h-11" />
              <span className="font-sans text-lg font-bold text-white md:text-xl">IBM Bob</span>
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-16 md:gap-24 relative z-10">
        
        {/* Decorative corner markers */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-cyber-blue/20 pointer-events-none" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-cyber-blue/20 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-cyber-blue/20 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-cyber-blue/20 pointer-events-none" />

        {/* 2. HERO SECTION: "HACKURITY" — sits over the interactive face backdrop. */}
        <section id="mission_brief" className="relative flex flex-col crosshair-corner border border-cyber-blue/15 bg-cyber-dark/30 p-6 backdrop-blur-md md:p-8">
          <CornerCrosshairs />

          {/* Title & stats */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[15px] tracking-wider text-cyber-tan font-bold uppercase leading-relaxed">
                REVA CYBERSECURITY CLUB <span className="text-white">//</span> B.TECH IoT &amp; CYBERSECURITY (SCHOOL OF CSE)
              </p>
              <HackurityCountdown />
              <div className="mt-2 border-l-2 border-cyber-tan/45 pl-4">
                <dl className="grid grid-cols-1 gap-x-8 gap-y-4 font-mono text-sm sm:grid-cols-2">
                  {[
                    { k: "FORMAT", v: "24-hour hackathon // on-site" },
                    { k: "DATE", v: "14 – 15 October 2026" },
                    { k: "BUILD WINDOW", v: "14 Oct 09:00 → 15 Oct 09:00 IST" },
                    { k: "VENUE", v: "REVA University, Bengaluru" },
                    { k: "TEAM SIZE", v: "3 – 4 members" },
                    { k: "ENTRY", v: "₹800 per team" },
                    { k: "REGISTRATION", v: "9 Sep – 3 Oct 2026" },
                    { k: "TRACKS", v: "3 tracks // 2 problem statements each" },
                    { k: "PRIZES", v: "Ceremony 15 Oct, 18:00 IST" },
                  ].map((row) => (
                    <div key={row.k} className="flex flex-col gap-0.5">
                      <dt className="text-[12px] font-bold tracking-[0.24em] text-cyber-tan/80 uppercase">
                        {row.k}
                      </dt>
                      <dd className="text-[15px] font-medium leading-relaxed text-white">{row.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="mt-1">
                <a
                  href="#join_node"
                  className="block w-full px-4 py-3 border border-cyber-tan/45 bg-cyber-tan/5 text-cyber-tan font-mono text-[15px] tracking-widest text-center uppercase cursor-pointer hover:bg-cyber-tan/10 hover:shadow-tan transition-all"
                >
                  [ REGISTER NOW]
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SECTION TWO: "02. HACKATHON TRACKS" */}
        <section id="ctf_challenges" className="flex flex-col gap-8 crosshair-corner border border-cyber-blue/10 p-6 md:p-10 bg-cyber-dark/30 backdrop-blur-md relative">
          <CornerCrosshairs />

          <div className="flex flex-col gap-5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-[13px] bg-cyber-tan/10 border border-cyber-tan/30 text-cyber-tan px-2 py-0.5 font-bold">TRACKS</span>
              <span className="text-[13px] text-cyber-gray tracking-widest font-bold">03 TRACKS // 2 PROBLEMS EACH</span>
            </div>
            <h2 className="font-heading text-2xl md:text-4xl tracking-tight leading-tight text-white uppercase">
              // HACKATHON TRACKS
            </h2>
            <p className="font-mono text-[15px] md:text-base leading-relaxed text-cyber-gray">
              There are three tracks to choose from, and each one comes with two problem statements released at the start. Pick the track that fits your team before the build window opens.
            </p>
          </div>

          <ul className="list-none grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-cyber-gray">
            {DOMAINS.map((domain) => (
              <li key={domain.id} className="flex flex-col gap-3 border border-cyber-blue/15 bg-cyber-black/70 p-5 md:p-6 hover:border-cyber-tan/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-cyber-tan font-bold uppercase tracking-widest text-[15px] md:text-base leading-tight">◆ {domain.name}</span>
                  <span className="shrink-0 text-[12px] text-cyber-blue/70">{domain.id}</span>
                </div>
                <span className="text-[14px] md:text-[15px] leading-relaxed">{domain.brief}</span>
              </li>
            ))}
          </ul>

          {/* Simulated progress diagnostics */}
          <div className="flex flex-col gap-3">
            <SimulatedLoadingBar value={92} label="INFILTRATION DECRYPTION MATRIX" />
            <div className="flex items-center justify-between text-[12px] text-cyber-blue/80 font-mono">
              <span>SECTOR: TRACK_FLOW_MATRIX</span>
              <span>STATUS: STREAMS ONLINE</span>
            </div>
          </div>
        </section>

        {/* 4. SECTION THREE: "03. EVENT EXECUTION TIMELINE" */}
        <section id="event_flow" className="flex flex-col gap-8 crosshair-corner border border-cyber-blue/10 p-6 bg-cyber-dark/30 backdrop-blur-md relative overflow-hidden">
          <CornerCrosshairs />

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-cyber-blue/15 pb-4">
            <div className="flex flex-col gap-2 max-w-2xl">
              <span className="text-[12px] tracking-widest text-cyber-tan font-bold uppercase">
                // SYSTEM_SEQUENCE_NODE_03
              </span>
              <h2 className="font-heading text-xl md:text-2xl tracking-tight text-white uppercase">
                EVENT EXECUTION TIMELINE
              </h2>
              <p className="font-mono text-xs leading-relaxed text-cyber-gray">
                Here is what happens and when, from the day registrations open to the closing prize ceremony. Each step hands over to the next, so you always know what is coming.
              </p>
            </div>
            <div className="font-mono text-[12px] tracking-widest text-cyber-tan/70 border border-cyber-tan/15 bg-cyber-tan/5 px-3 py-2">
              FLOW_STATUS: CONTINUOUS
            </div>
          </div>

          <div className="relative py-2">
            <EventPathway />
          </div>
        </section>

        {/* 5. SECTION FOUR: "04. WHY JOIN // OPERATOR REWARDS" */}
        <WhyJoinSection />

        {/* 6. SECTION FIVE: "05. JOIN NODE // REGISTRATION CONSOLE" */}
        <section id="join_node" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch crosshair-corner border border-cyber-blue/10 p-6 bg-cyber-dark/30 backdrop-blur-md relative">
          <CornerCrosshairs />
          <div className="lg:col-span-5 flex flex-col justify-center gap-5">
            <span className="text-[12px] tracking-widest text-cyber-tan font-bold font-mono">//REGISTER NOW // SECURE REGISTRY</span>
            <h2 className="font-heading text-xl md:text-2xl tracking-tight leading-none text-white uppercase">REGISTRATION TERMINAL</h2>
            <p className="font-mono text-xs text-cyber-gray leading-relaxed">
              Fill in your team details, add each member, and confirm your entry. It takes about two minutes. Entry is ₹800 per team.
            </p>
            <motion.button
              type="button"
              onClick={() => { resetRegistration(); setIsRegistrationOpen(true); }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              animate={{ boxShadow: ["0 0 8px rgba(210,180,140,0.35)", "0 0 28px rgba(210,180,140,0.75)", "0 0 8px rgba(99,102,241,0.4)"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="relative overflow-hidden w-full md:w-fit px-6 py-3.5 border-2 border-cyber-tan/70 bg-cyber-tan/15 text-white font-mono text-xs font-bold tracking-[0.2em] text-center uppercase cursor-pointer hover:bg-cyber-tan/25 transition-colors"
            >
              <motion.span aria-hidden="true" className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent" animate={{ x: ["0%", "420%"] }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }} />
              <span className="relative">REGISTER YOUR TEAM NOW→</span>
            </motion.button>
            <div className="text-[12px] text-cyber-tan/40 leading-normal select-none">SECURE REGISTRY: ALL DATA IS SIGNED AND ENCRYPTED IN TRANSIT.</div>
          </div>

          <div className="lg:col-span-7 min-h-[220px] border border-cyber-blue/15 bg-cyber-black/45 p-5 font-mono text-[14px] text-cyber-blue/80 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 cyber-grid opacity-60 pointer-events-none" />
            <div className="relative flex items-center justify-between border-b border-cyber-blue/15 pb-3">
              <span>// REGISTRY_UPLINK</span><span className="text-cyber-tan animate-pulse">READY</span>
            </div>
            <div className="relative space-y-2 text-cyber-gray">
              <div>guest@hackurity:~$ registry --await-team-payload</div>
              <div className="text-white">&gt; SIGNAL DETECTED: AWAITING OPERATOR INPUT</div>
              <div>&gt; ENCRYPTION: AES-256 // CHANNEL: SECURE</div>
            </div>
            <div className="relative h-px bg-cyber-blue/25"><motion.div className="absolute inset-y-0 left-0 bg-cyber-tan" animate={{ width: ["8%", "90%", "8%"] }} transition={{ duration: 3.5, repeat: Infinity }} /></div>
          </div>
        </section>

        {/* 7. SECTION SIX: QUERY TERMINAL */}
        <section id="query_terminal" className="flex flex-col gap-6 crosshair-corner border border-cyber-blue/10 p-6 bg-cyber-dark/30 backdrop-blur-md relative">
          <CornerCrosshairs />
          <div className="flex flex-col gap-2 border-b border-cyber-blue/15 pb-4 md:flex-row md:items-end md:justify-between">
            <div className="flex max-w-2xl flex-col gap-2">
              <span className="text-[12px] font-bold tracking-widest text-cyber-tan uppercase">// SYSTEM_SEQUENCE_NODE_06</span>
              <h2 className="font-heading text-xl tracking-tight text-white uppercase md:text-2xl">QUERY TERMINAL</h2>
              <p className="font-mono text-xs leading-relaxed text-cyber-gray">
                Common questions, answered plainly. Pick a question on the left and the answer prints out on the right.
              </p>
            </div>
            <div className="border border-cyber-tan/15 bg-cyber-tan/5 px-3 py-2 font-mono text-[12px] tracking-widest text-cyber-tan/70">
              RESPONSE_MODE: LIVE
            </div>
          </div>
          <QueryTerminal />
        </section>

        {/* 8. SECTION SEVEN: SPONSOR NOW */}
        {/* <section id="sponsor_now" className="grid grid-cols-1 lg:grid-cols-12 gap-8 crosshair-corner border border-cyber-blue/10 p-6 bg-cyber-dark/20 relative">
          <CornerCrosshairs />
          <div className="lg:col-span-6 flex flex-col justify-center gap-5">
            <span className="text-[12px] font-bold tracking-widest text-cyber-tan uppercase font-mono">// SYSTEM_SEQUENCE_NODE_07</span>
            <h2 className="font-heading text-xl tracking-tight leading-none text-white uppercase md:text-2xl">SPONSOR NOW</h2>
            <p className="font-mono text-xs leading-relaxed text-cyber-gray">
              Back the event and put your brand in front of hundreds of student security engineers. Download the brochure, send us a question, or pick a partnership tier straight away.
            </p>
            <SponsorZone />
          </div>
          <div className="lg:col-span-6 relative min-h-[220px] border border-cyber-blue/15 bg-cyber-black/45 p-5 font-mono text-[14px] text-cyber-blue/80">
            <div className="absolute inset-0 cyber-grid opacity-60 pointer-events-none" />
            <div className="relative flex items-center justify-between border-b border-cyber-blue/15 pb-3">
              <span>// PARTNER_UPLINK</span><span className="text-cyber-tan animate-pulse">OPEN</span>
            </div>
            <div className="relative mt-4 space-y-2 text-cyber-gray">
              <div>guest@hackurity:~$ partners --overview</div>
              <div className="text-white">&gt; 4 partnership tiers available</div>
              <div>&gt; Reach: 500+ students across engineering campuses</div>
              <div>&gt; Includes stage time, branding and hiring access</div>
            </div>
          </div>
        </section> */}
        <JudgesSection/>
        <PartnersSection />
 {/* 8. SECTION SEVEN: SPONSOR NOW */}
        <section id="sponsor_now" className="grid grid-cols-1 lg:grid-cols-12 gap-8 crosshair-corner border border-cyber-blue/10 p-6 bg-cyber-dark/30 backdrop-blur-md relative">
          <CornerCrosshairs />
          <div className="lg:col-span-6 flex flex-col justify-center gap-5">
            <span className="text-[12px] font-bold tracking-widest text-cyber-tan uppercase font-mono">// SYSTEM_SEQUENCE_NODE_07</span>
            <h2 className="font-heading text-xl tracking-tight leading-none text-white uppercase md:text-2xl">SPONSOR NOW</h2>
            <p className="font-mono text-xs leading-relaxed text-cyber-gray">
              Back the event and put your brand in front of hundreds of student security engineers. Download the brochure, send us a question, or pick a partnership tier straight away.
            </p>
            <SponsorZone />
          </div>
          <div className="lg:col-span-6 relative min-h-[220px] border border-cyber-blue/15 bg-cyber-black/45 p-5 font-mono text-[14px] text-cyber-blue/80">
            <div className="absolute inset-0 cyber-grid opacity-60 pointer-events-none" />
            <div className="relative flex items-center justify-between border-b border-cyber-blue/15 pb-3">
              <span>// PARTNER_UPLINK</span><span className="text-cyber-tan animate-pulse">OPEN</span>
            </div>
            <div className="relative mt-4 space-y-2 text-cyber-gray">
              <div>guest@hackurity:~$ partners --overview</div>
              <div className="text-white">&gt; 4 partnership tiers available</div>
              <div>&gt; Reach: 500+ students across engineering campuses</div>
              <div>&gt; Includes stage time, branding and hiring access</div>
            </div>
          </div>
        </section>

        {/* 6. SPECIFICATIONS & TECH STATS */}
        {/* <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"> */}
          {/* Left panel */}
          {/* <BracketFrame>
            <div className="flex flex-col gap-4 relative">
              <div className="flex justify-between items-center text-[13px] text-cyber-tan border-b border-cyber-blue/10 pb-2">
                <span>STATION: HACKURITY_CONDUIT_GRID</span>
                <span>SEC_VAL: SCHOOL_OF_CSE_ACCESS</span>
              </div>
              <h3 className="font-heading text-base text-white uppercase tracking-tight">
                // MAIN_FRAME_MONITOR
              </h3>
              <p className="font-mono text-xs text-cyber-gray leading-relaxed">
                This central dashboard represents a real-time monitor of the Hackurity infiltration grids. Live WebGL shaders and canvas simulations serve as the telemetry control center for all operational teams.
              </p>
              
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between font-mono text-[13px] text-white">
                  <span>CONDUIT FLUX RATE</span>
                  <span className="text-cyber-tan font-bold">94% COMPLIANT</span>
                </div>
                <div className="h-1 bg-cyber-blue-dim relative">
                  <div className="absolute top-0 bottom-0 left-0 bg-cyber-blue animate-pulse" style={{ width: "94%" }} />
                </div>
              </div>

              <div className="text-[12px] text-cyber-tan/50 mt-4 leading-normal select-none">
                ATTENTION: DO NOT INJECT UNVERIFIED CODE PAYLOADS OUTSIDE SANDBOXED CONTAINMENT CORE CHANNELS.
              </div>
            </div>
          </BracketFrame> */}

          {/* Right panel */}
          {/* <BracketFrame>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-[13px] text-cyber-tan border-b border-cyber-blue/10 pb-2">
                <span>MODULE: STACK_SPECIFICATIONS</span>
                <span>API_NODE: ESTABLISHED</span>
              </div>
              <h3 className="font-heading text-base text-white uppercase tracking-tight">
                // SYSTEM_SPECIFICATIONS
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <div className="text-cyber-tan font-bold">FRAMEWORK</div>
                  <div className="text-white">Next.js 16 (React 19)</div>
                </div>
                <div>
                  <div className="text-cyber-tan font-bold">STYLING ENGINE</div>
                  <div className="text-white">Tailwind CSS v4</div>
                </div>
                <div>
                  <div className="text-cyber-tan font-bold">3D GRAPHICS</div>
                  <div className="text-white">React Three Fiber</div>
                </div>
                <div>
                  <div className="text-cyber-tan font-bold">SHADERS / COMPOSERS</div>
                  <div className="text-white">GLSL Raymarch + Bloom</div>
                </div>
              </div>

              <div className="border-t border-cyber-blue/10 pt-4 mt-2">
                <SineWaveLoader width={280} height={20} />
              </div>
            </div>
          </BracketFrame>
        </section> */}

        <ContactSection />

        <CreatorsSection />

      </main>

      {/* FOOTER */}
      <footer className="w-full bg-cyber-dark/40 border-t border-cyber-blue/10 py-10 px-4 md:px-8 mt-16 select-none relative z-10 text-xs text-cyber-gray">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1 font-heading text-xs tracking-[0.2em] font-bold text-white text-glow-tan">
              HACKURITY 2026
              <span className="inline-flex items-center gap-2 normal-case">
                <span className="font-mono text-[13px] font-normal tracking-[0.25em] text-cyber-gray lowercase md:text-xs">
                  powered by
                </span>
                <span className="inline-flex items-center gap-1">
                  <img src="/sponsors/IBMBOB.png" alt="IBM Bob" className="h-6 w-auto object-contain md:h-7" />
                  <span className="font-sans text-xs font-bold text-white md:text-sm">IBM Bob</span>
                </span>
              </span>
            </span>
            <span className="text-[13px] text-cyber-tan/40">© 2026 REVA Cybersecurity Club. CSE Dept.</span>
          </div>

          {/* Quick diagnostic outputs */}
          <div className="flex items-center gap-6 font-mono text-[12px] text-cyber-blue/60">
            <div>PING: 14MS</div>
            <div>FPS: 60.0</div>
            <div>MEM: 44.82MB</div>
            <div>STATION: NODE_HACKURITY_045</div>
          </div>
        </div>
      </footer>

      {isRegistrationOpen && (
        <motion.div
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={() => setIsRegistrationOpen(false)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm md:items-center md:p-6"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-console-title"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 270, damping: 28 }}
            onMouseDown={(event) => event.stopPropagation()}
            className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden border border-cyber-tan/35 bg-cyber-black shadow-[0_0_35px_rgba(99,102,241,0.22)] md:max-h-[88vh]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-cyber-blue/15 bg-cyber-dark/80 px-5 py-4">
              <div>
                <div className="text-[12px] font-mono font-bold tracking-widest text-cyber-tan">// HACKURITY // SECURE REGISTRY</div>
                <h2 id="registration-console-title" className="mt-1 font-heading text-base tracking-tight text-white">INJECT TEAM PAYLOAD</h2>
              </div>
              <button type="button" onClick={() => setIsRegistrationOpen(false)} className="border border-cyber-blue/25 px-2 py-1 font-mono text-xs text-cyber-gray transition-colors hover:border-cyber-tan hover:text-cyber-tan" aria-label="Close registration console">[ X ]</button>
            </div>

            {!registrationComplete && (
              <div className="grid grid-cols-3 border-b border-cyber-blue/15 bg-cyber-black text-[12px] font-mono tracking-widest">
                {["01 TEAM", "02 OPERATORS", "03 VERIFY"].map((step, index) => (
                  <div key={step} className={`flex items-center gap-2 px-4 py-3 ${registrationStep === index + 1 ? "bg-cyber-tan/10 text-cyber-tan" : registrationStep > index + 1 ? "text-cyber-blue" : "text-cyber-gray/50"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${registrationStep >= index + 1 ? "bg-cyber-tan animate-pulse" : "bg-cyber-gray/30"}`} />{step}
                  </div>
                ))}
              </div>
            )}

            <div className="overflow-y-auto p-5 md:p-7">
              {registrationComplete ? (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="border border-cyber-tan/45 bg-cyber-tan/5 p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-cyber-tan text-cyber-tan shadow-[0_0_18px_rgba(210,180,140,0.25)]">✓</div>
                  <h3 className="font-heading text-base text-white">PAYLOAD VERIFIED</h3>
                  <p className="mt-3 font-mono text-xs leading-relaxed text-cyber-gray">Your team registration has been received. Our organisers will reach out with next steps.</p>
                  <button type="button" onClick={() => { setIsRegistrationOpen(false); resetRegistration(); }} className="mt-6 border border-cyber-tan/45 bg-cyber-tan/5 px-4 py-2 font-mono text-[13px] tracking-widest text-cyber-tan transition-colors hover:bg-cyber-tan/10">[ CLOSE_CONSOLE ]</button>
                </motion.div>
              ) : registrationStep === 1 ? (
                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                  <div><span className="text-[12px] font-bold tracking-widest text-cyber-tan">// TEAM PROFILE</span><p className="mt-2 font-mono text-xs leading-relaxed text-cyber-gray">Compile the identity packet for your Hackurity unit.</p></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-1.5"><span className="text-[13px] font-mono font-bold text-cyber-tan">--team-name</span><input value={teamName} onChange={(event) => setTeamName(event.target.value)} placeholder="Enter team alias..." className={inputClass} /></label>
                    <label className="space-y-1.5"><span className="text-[13px] font-mono font-bold text-cyber-tan">--team-size</span><select value={teamSize} onChange={(event) => updateTeamSize(event.target.value)} className={`${inputClass} cursor-pointer`}><option value="3">3 (TRIO)</option><option value="4">4 (SQUAD)</option></select></label>
                    <label className="space-y-1.5 sm:col-span-2"><span className="text-[13px] font-mono font-bold text-cyber-tan">--university</span><input value={university} onChange={(event) => setUniversity(event.target.value)} placeholder={`${universityPlaceholder || "University node"} |`} className={`${inputClass} placeholder:text-cyber-blue/55`} /></label>
                    <label className="space-y-1.5 sm:col-span-2"><span className="text-[13px] font-mono font-bold text-cyber-tan">--choose-track</span><select value={selectedDomain} onChange={(event) => setSelectedDomain(event.target.value)} className={`${inputClass} cursor-pointer`}><option value="" disabled>SELECT A TRACK...</option>{DOMAINS.map((domain) => <option key={domain.id} value={domain.name}>{`${domain.id} // ${domain.name.toUpperCase()}`}</option>)}</select></label>
                  </div>
                  <div><div className="mb-2 text-[13px] font-mono font-bold text-cyber-tan">--experience-level</div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"].map((level, index) => <motion.button key={level} type="button" onClick={() => setExperienceLevel(level)} whileTap={{ scale: 0.97 }} animate={experienceLevel === level ? { boxShadow: ["0 0 4px rgba(99,102,241,0.2)", "0 0 16px rgba(210,180,140,0.45)", "0 0 4px rgba(99,102,241,0.2)"] } : {}} transition={{ duration: 1.8, repeat: Infinity }} className={`relative overflow-hidden border px-2 py-3 font-mono text-[12px] tracking-wider transition-colors ${experienceLevel === level ? "border-cyber-tan bg-cyber-tan/10 text-cyber-tan" : "border-cyber-blue/20 bg-cyber-dark text-cyber-gray hover:border-cyber-blue/50"}`}><span className="relative">{level}</span><span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-cyber-blue" style={{ width: `${35 + index * 18}%` }} /></motion.button>)}</div></div>
                </motion.div>
              ) : registrationStep === 2 ? (
                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div><span className="text-[12px] font-bold tracking-widest text-cyber-tan">// MEMBER DETAILS</span><p className="mt-2 font-mono text-xs leading-relaxed text-cyber-gray">Populate a record for each of the {teamSize} assigned operator{teamSize === "" ? "" : "s"}.</p></div>
                  {members.map((member, index) => <div key={index} className="border border-cyber-blue/15 bg-cyber-dark/45 p-4"><div className="mb-4 flex items-center gap-2 text-[13px] font-mono font-bold text-cyber-tan"><span className="h-1.5 w-1.5 bg-cyber-tan animate-pulse" />{index === 0 ? "TEAM LEADER (YOU)" : `TEAM MEMBER ${index + 1}`}</div><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5"><span className="text-[13px] font-mono text-cyber-gray">--name</span><input value={member.name} onChange={(event) => updateMember(index, "name", event.target.value)} className={inputClass} placeholder="Operator name..." /></label><label className="space-y-1.5"><span className="text-[13px] font-mono text-cyber-gray">--email</span><input type="email" value={member.email} onChange={(event) => updateMember(index, "email", event.target.value)} className={inputClass} placeholder="operator@gmail.com" /></label><label className="space-y-1.5"><span className="text-[13px] font-mono text-cyber-gray">--role</span><select value={member.role} onChange={(event) => updateMember(index, "role", event.target.value)} className={`${inputClass} cursor-pointer`}><option value="" disabled>SELECT ROLE...</option>{roleOptions.map((role) => <option key={role} value={role}>{role.toUpperCase()}</option>)}</select></label><label className="space-y-1.5"><span className="text-[13px] font-mono text-cyber-gray">--portfolio</span><input value={member.portfolio} onChange={(event) => updateMember(index, "portfolio", event.target.value)} className={`${inputClass} placeholder:text-cyber-blue/55`} placeholder={`${portfolioPlaceholder || "Portfolio"} |`} /></label></div></div>)}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                  <div><span className="text-[12px] font-bold tracking-widest text-cyber-tan">// FINAL VERIFICATION</span><p className="mt-2 font-mono text-xs leading-relaxed text-cyber-gray">Attach a concise project objective, then confirm your operating protocols.</p></div>
                  <label className="block space-y-1.5"><span className="text-[13px] font-mono font-bold text-cyber-tan">--about-yourselves // BRIEF SUMMARY <span className="text-cyber-gray/50 normal-case">(optional)</span></span><textarea value={projectIdea} onChange={(event) => setProjectIdea(event.target.value)} rows={4} placeholder="Tell us a bit about your team, your interests, or what you're hoping to build..." className={`${inputClass} resize-y`} /></label>
                  <div className="grid gap-3 border border-cyber-blue/15 bg-cyber-dark/45 p-4 text-xs font-mono"><div className="text-[12px] tracking-widest text-cyber-blue">PAYLOAD SUMMARY</div><div className="grid gap-2 sm:grid-cols-2 text-cyber-gray"><span>TEAM: <strong className="text-white">{teamName || "UNSET"}</strong></span><span>SIZE: <strong className="text-white">{teamSize} OPERATOR{teamSize === "1" ? "" : "S"}</strong></span><span>TRACK: <strong className="text-white">{selectedDomain || "UNSET"}</strong></span><span>LEVEL: <strong className="text-white">{experienceLevel || "UNSET"}</strong></span></div></div>
                  <div className="space-y-3"><label className="flex items-start gap-3 border border-cyber-blue/15 p-3 text-xs font-mono text-cyber-gray"><input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-0.5 accent-cyber-tan" /><span>I agree to the <a href="https://drive.google.com/file/d/1lLndnRTWvXNcE0halurnytvk-Fv-CawP/view?usp=sharing" target="_blank" rel="noreferrer" className="text-cyber-tan underline underline-offset-2 hover:text-white">Terms &amp; Conditions</a> of Hackurity 2026.</span></label><label className="flex items-start gap-3 border border-cyber-blue/15 p-3 text-xs font-mono text-cyber-gray"><input type="checkbox" checked={acceptedConduct} onChange={(event) => setAcceptedConduct(event.target.checked)} className="mt-0.5 accent-cyber-tan" /><span>I agree to uphold the <a href={codeOfConductUrl} target="_blank" rel="noreferrer" className="text-cyber-tan underline underline-offset-2 hover:text-white">Code of Conduct</a> throughout the event.</span></label></div>
                  <div className="border border-cyber-blue/15 bg-cyber-dark/45 p-4">
                    <div className="mb-2 text-[12px] tracking-widest text-cyber-blue">--verify-identity</div>
                    {checkingRegistration ? (
                      <p className="font-mono text-[13px] text-cyber-gray/70">Checking registration status…</p>
                    ) : user ? (
                      existingRegistration ? (
                        <div className="space-y-2 text-xs font-mono text-cyber-gray">
                          <p>
                            <strong className="text-white">{user.email}</strong> is already registered under team{" "}
                            <strong className="text-cyber-tan">{existingRegistration.teamName}</strong>. Each account can only submit one team.
                          </p>
                          <button type="button" onClick={handleSignOut} className="text-[13px] tracking-widest text-cyber-tan/70 underline underline-offset-2 hover:text-cyber-tan">
                            Sign out and use a different account
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-cyber-gray">
                          <span>Signed in as <strong className="text-white">{user.email}</strong></span>
                          <button type="button" onClick={handleSignOut} className="text-[13px] tracking-widest text-cyber-tan/70 underline underline-offset-2 hover:text-cyber-tan">
                            Sign out
                          </button>
                        </div>
                      )
                    ) : (
                      <div className="space-y-2">
                        <p className="font-mono text-xs leading-relaxed text-cyber-gray">Sign in with Google to submit your registration.</p>
                        <button
                          type="button"
                          onClick={handleGoogleSignIn}
                          className="border border-cyber-blue/40 bg-cyber-blue/10 px-3 py-2 font-mono text-[13px] font-bold tracking-widest text-cyber-blue uppercase transition-colors hover:bg-cyber-blue/20"
                        >
                          [ SIGN IN WITH GOOGLE ]
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {!registrationComplete && (
              <div className="border-t border-cyber-blue/15 bg-cyber-dark/70">
                {registrationError && (
                  <div className="border-b border-red-500/30 bg-red-950/30 px-5 py-2 font-mono text-[13px] text-red-400">
                    {registrationError}
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 px-5 py-4">
                  <button type="button" onClick={() => setRegistrationStep((step) => Math.max(1, step - 1))} disabled={registrationStep === 1 || isSubmittingRegistration} className="border border-cyber-blue/20 px-3 py-2 font-mono text-[13px] tracking-widest text-cyber-gray transition-colors hover:border-cyber-blue disabled:cursor-not-allowed disabled:opacity-30">[ BACK ]</button>
                  {registrationStep < 3 ? (
                    <button type="button" onClick={() => setRegistrationStep((step) => step + 1)} disabled={registrationStep === 1 ? !stepOneReady : !membersAreComplete} className="border border-cyber-tan/45 bg-cyber-tan/5 px-3 py-2 font-mono text-[13px] tracking-widest text-cyber-tan transition-colors hover:bg-cyber-tan/10 disabled:cursor-not-allowed disabled:opacity-30">[ CONTINUE ]</button>
                  ) : (
                    <button type="button" onClick={submitRegistration} disabled={!stepThreeReady || isSubmittingRegistration} className="border border-cyber-tan/45 bg-cyber-tan/5 px-3 py-2 font-mono text-[13px] tracking-widest text-cyber-tan transition-colors hover:bg-cyber-tan/10 disabled:cursor-not-allowed disabled:opacity-30">
                      {isSubmittingRegistration ? "[ SUBMITTING... ]" : "[ REGISTER_PAYLOAD ]"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

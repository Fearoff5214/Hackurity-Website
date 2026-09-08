"use client";
/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import { useState } from "react";
import { AnimatedCorners } from "@/components/TechElements";

type Partner = { name: string; tier: string; url: string; logo?: string };
type Person = { name: string; role: string; image: string; bio?: string; phone?: string };

// Swap the `url` values here when partnerships are confirmed, and add a
// `logo` once you have the real asset.
const PARTNERS: Partner[] = [
  { name: "IBM Bob", tier: "KNOWLEDGE PARTNER", url: "https://www.ibm.com/", logo: "/sponsors/ibm-bob.png" },
  { name: "Boston Institute of Analytics", tier: "EDUCATION PARTNER", url: "https://bostoninstituteofanalytics.org/", logo: "/sponsors/boston-institute-of-analytics.png" },
  { name: "Indian Society for Technical Education", tier: "COMMUNITY PARTNER", url: "https://www.isteonline.in/", logo: "/sponsors/iste.png" },
  { name: "upGrad", tier: "LEARNING PARTNER", url: "https://www.upgrad.com/study-abroad/", logo: "/sponsors/upgrad.png" },
  { name: "EDWISE Overseas Education Consultants", tier: "STRATEGIC PARTNER", url: "https://www.edwiseinternational.com/", logo: "/sponsors/edwise.png" },
  { name: "Paramount Consulting", tier: "STRATEGIC PARTNER", url: "https://paramountgroupuk.com/", logo: "/sponsors/paramount-consulting.png" },
];

// Judging panel is still being confirmed — each slot represents one of the
// sponsors below (excluding the community partner), whose judge is TBD.
const JUDGE_SPONSORS = PARTNERS.filter((partner) => partner.tier !== "COMMUNITY PARTNER");

// Photos are pulled from the same /public/members library used by the club page.
const CONTACTS: Person[] = [
  { name: "Dharma Teja", role: "Cybersecurity Club Vice President", image: "/members/LeadershipRole/dharma.png", phone: "+91 79 7565 0280" },
  { name: "Chethan K", role: "Design Team Head", image: "/members/DesignTeam/DesignChetan.jpeg", phone: "+91733-78344158" },
  { name: "Rohith L", role: "Event Management Lead", image: "/members/EventManagers/rohit.png", phone: "+91 86606 69138" },
  { name: "Lavanya D", role: "Event Management", image: "/members/EventManagers/lavanya.jpeg", phone: "+91 80730 48671" },
];

export const reveal = (index: number) => ({ opacity: 0, y: 20, scale: 0.97, transition: { delay: index * 0.045 } });

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Compact HUD-style portrait tile shared by the landing-page cards.
 * Deliberately different from the club page: small square frame, scan sweep
 * on hover and a bracketed border instead of the tall glass portrait.
 */
export function HudThumb({ src, name, size = "md" }: { src?: string; name: string; size?: "sm" | "md" }) {
  const [failed, setFailed] = useState(false);
  const box = size === "sm" ? "h-16 w-16" : "h-20 w-20";

  return (
    <div className={`relative ${box} shrink-0 overflow-hidden rounded-lg border border-cyber-tan/30 bg-cyber-dark/80`}>
      {src && !failed ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(140deg,rgba(99,102,241,0.18),rgba(210,180,140,0.12))]">
          <span className="font-heading text-base tracking-widest text-cyber-tan/80">{initials(name)}</span>
        </div>
      )}
      <span className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10" />
      <span className="pointer-events-none absolute inset-x-0 -top-full h-full bg-[linear-gradient(180deg,transparent,rgba(99,102,241,0.35),transparent)] transition-transform duration-[900ms] ease-out group-hover:translate-y-[200%]" />
    </div>
  );
}

/** Shared card chrome for the landing page: angular, blue-lit, edge sweep. */
const cardBase =
  "group relative overflow-hidden rounded-xl border border-cyber-blue/20 bg-[linear-gradient(150deg,rgba(6,6,20,0.85),rgba(0,0,0,0.6))] p-5 shadow-[0_14px_45px_-30px_rgba(0,0,0,0.95)] transition-[border-color,box-shadow,background-color] duration-500 hover:border-cyber-tan/55 hover:shadow-[0_22px_60px_-30px_rgba(99,102,241,0.55)]";

function CardGlow() {
  return (
    <>
      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_15%_0%,rgba(99,102,241,0.18),transparent_55%)]" />
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-cyber-tan via-cyber-blue to-transparent transition-transform duration-500 group-hover:scale-x-100" />
    </>
  );
}

export function PartnersSection() {
  return (
    <section id="meet_our_sponsors" className="crosshair-corner relative overflow-hidden border border-cyber-blue/10 bg-cyber-dark/30 backdrop-blur-md p-6 md:p-8">
      <div className="mb-8 max-w-2xl">
        <span className="font-mono text-[13px] font-bold tracking-widest text-cyber-tan">{"// PARTNERSHIP_NETWORK"}</span>
        <h2 className="mt-2 font-heading text-xl leading-relaxed text-white uppercase md:text-2xl">Meet our sponsors</h2>
        <p className="mt-3 font-mono text-xs leading-relaxed text-cyber-gray">A showcase of the organisations helping the next generation of defenders explore, build and lead. These are dummy partners for now; each card is ready to be replaced with a confirmed logo and website.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PARTNERS.map((partner, index) => (
          <motion.a
            key={partner.name}
            href={partner.url}
            target="_blank"
            rel="noreferrer"
            initial={reveal(index)}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`${cardBase} flex min-h-36 flex-col items-center justify-center gap-3 text-center`}
          >
            <CardGlow />
            <AnimatedCorners size={12} tone="tan" />
            <span className="relative z-10 font-mono text-[10px] font-bold tracking-[0.2em] text-cyber-tan/85 uppercase">{partner.tier}</span>
            {partner.logo ? (
              <span className="relative z-10 flex h-16 w-full items-center justify-center rounded-lg bg-white/[0.04] px-3 py-2 ring-1 ring-inset ring-white/10">
                <img src={partner.logo} alt={`${partner.name} logo`} className="max-h-12 max-w-[90%] object-contain opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
              </span>
            ) : (
              <>
                <span className="relative z-10 font-heading text-sm tracking-wider text-white uppercase opacity-90">{partner.name}</span>
                <span className="relative z-10 font-mono text-[12px] font-bold tracking-wider text-cyber-gray transition-colors group-hover:text-cyber-tan">{"// CONFIRMED SOON"}</span>
              </>
            )}
          </motion.a>
        ))}
      </div>
    </section>
  );
}

export function JudgesSection() {
  return (
    <section id="judges" className="crosshair-corner relative overflow-hidden border border-cyber-blue/10 bg-cyber-dark/30 backdrop-blur-md p-6 md:p-8">
      <div className="mb-8 max-w-2xl">
        <span className="font-mono text-[13px] font-bold tracking-widest text-cyber-tan">{"// EVALUATION_PANEL"}</span>
        <h2 className="mt-2 font-heading text-xl leading-relaxed text-white uppercase md:text-2xl">Meet your judges</h2>
        <p className="mt-3 font-mono text-xs leading-relaxed text-cyber-gray">The panel that scores the final defence. Each judge is drawn from one of our sponsors below — individual profiles are being confirmed and land here soon.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {JUDGE_SPONSORS.map((sponsor, index) => (
          <motion.div
            key={sponsor.name}
            initial={reveal(index)}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={cardBase}
          >
            <CardGlow />
            <AnimatedCorners size={12} tone="tan" />
            <div className="relative z-10 flex flex-col">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-cyber-blue/25 bg-white/[0.04] p-2">
                {sponsor.logo ? (
                  <img src={sponsor.logo} alt={`${sponsor.name} logo`} className="h-full w-full object-contain" />
                ) : (
                  <span className="font-heading text-3xl text-cyber-tan/45">?</span>
                )}
                <span className="pointer-events-none absolute inset-x-0 -top-full h-full bg-[linear-gradient(180deg,transparent,rgba(99,102,241,0.35),transparent)] transition-transform duration-[900ms] ease-out group-hover:translate-y-[200%]" />
              </div>
              <div className="mt-4 min-w-0">
                <span className="font-mono text-[10px] tracking-[0.2em] text-cyber-blue/70">JUDGE_{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-1 font-heading text-[14px] leading-snug text-white uppercase">Judge from {sponsor.name}</h3>
              </div>
            </div>
            <p className="relative z-10 mt-4 border-t border-white/10 pt-3 font-mono text-[12px] leading-relaxed text-cyber-gray">
              Representing {sponsor.name} on the judging panel. Individual profile will be published closer to the event.
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const ABOUT_STATS = [
  { value: "24 HRS", label: "Non-stop hackathon" },
  { value: "3 – 4", label: "Members per team" },
  { value: "UG – PG", label: "All streams welcome" },
];

export function AboutUsSection() {
  return (
    <section id="about_us" className="crosshair-corner relative border border-cyber-blue/10 bg-cyber-dark/30 backdrop-blur-md p-6 md:p-8">
      <div className="mb-6 max-w-2xl">
        <span className="font-mono text-[13px] font-bold tracking-widest text-cyber-tan">{"// ABOUT_HACKURITY"}</span>
        <h2 className="mt-2 font-heading text-lg leading-relaxed text-white uppercase md:text-xl">About us</h2>
        <p className="mt-3 font-mono text-[13px] leading-relaxed text-cyber-gray">
          Hackurity is a national-level, 24-hour cybersecurity hackathon hosted at REVA University, Bengaluru,
          and run end-to-end by the REVA Cybersecurity Club. It brings students together to pick a track, break
          something on purpose, and build the fix — with guidance from faculty in the School of Computer Science
          and Engineering.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-px border border-cyber-blue/15 bg-cyber-blue/15 sm:grid-cols-3">
        {ABOUT_STATS.map((stat) => <div key={stat.label} className="bg-black/70 px-4 py-5 text-center">
          <div className="font-heading text-base text-cyber-tan">{stat.value}</div>
          <div className="mt-2 font-mono text-[12px] tracking-widest text-cyber-gray uppercase">{stat.label}</div>
        </div>)}
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact_us" className="crosshair-corner relative border border-cyber-blue/10 bg-cyber-dark/30 backdrop-blur-md p-6 md:p-8">
      <div className="mb-6">
        <span className="font-mono text-[13px] font-bold tracking-widest text-cyber-tan">{"// DIRECT_CONTACTS"}</span>
        <h2 className="mt-2 font-heading text-lg leading-relaxed text-white uppercase md:text-xl">Contact us</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CONTACTS.map((person, index) => (
          <motion.article
            key={person.name}
            initial={reveal(index)}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={cardBase}
          >
            <CardGlow />
            <AnimatedCorners size={12} tone="tan" />
            <div className="relative z-10 flex items-center gap-4">
              <HudThumb name={person.name} />
              <div className="min-w-0">
                <h3 className="font-heading text-[14px] leading-snug text-white uppercase">{person.name}</h3>
                <p className="mt-1 font-mono text-[11px] font-bold tracking-[0.14em] text-cyber-tan uppercase">{person.role}</p>
              </div>
            </div>
            <div className="relative z-10 mt-4 border-t border-white/10 pt-3">
              <a
                href={`tel:${person.phone?.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-md border border-cyber-blue/25 px-3 py-1.5 font-mono text-[12px] tracking-wider text-cyber-blue transition-colors hover:border-cyber-tan hover:text-cyber-tan"
              >
                {person.phone}
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

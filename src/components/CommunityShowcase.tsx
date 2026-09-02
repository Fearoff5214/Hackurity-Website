"use client";
/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";

type Partner = { name: string; url: string; logo?: string };
type Person = { name: string; role: string; url: string; image: string; bio?: string; phone?: string; email?: string };

// Swap the `url` values here when partnerships are confirmed, and add a
// `logo` once you have the real asset.
const PARTNERS: Partner[] = [
  { name: "IBM Bob", url: "https://www.ibm.com/", logo: "/sponsors/ibm-bob.png" },
  { name: "Boston Institute of Analytics", url: "https://bostoninstituteofanalytics.org/", logo: "/sponsors/boston-institute-of-analytics.png" },
  { name: "EDWISE Overseas Education Consultants", url: "https://www.edwiseinternational.com/", logo: "/sponsors/edwise.png" },
  { name: "Indian Society for Technical Education", url: "https://www.isteonline.in/", logo: "/sponsors/iste.png" },
];

const avatar = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=111126&color=d2b48c&bold=true&size=360&font-size=0.34`;

// Judging panel is still being confirmed — every slot is a placeholder for now.
const JUDGE_SLOTS = [1, 2, 3, 4, 5];

const CONTACTS: Person[] = [
  { name: "Chetan", role: "Cybersecurity Club President", url: "#", image: avatar("Chetan"), phone: "TBD", email: "TBD" },
  { name: "Dharma Teja", role: "Cybersecurity Club Vice President", url: "https://www.linkedin.com/in/dharmatejarc06/", image: avatar("Dharma Teja"), phone: "+91 79 7565 0280", email: "rcdt009@gmail.com" },
  { name: "Lavanya", role: "Cybersecurity Club Technical Head", url: "#", image: avatar("Lavanya"), phone: "TBD", email: "TBD" },
];

const reveal = (index: number) => ({ opacity: 0, y: 20, scale: 0.97, transition: { delay: index * 0.045 } });

export function PartnersSection() {
  return (
    <section id="meet_our_sponsors" className="crosshair-corner relative overflow-hidden border border-cyber-blue/10 bg-cyber-dark/30 backdrop-blur-md p-6 md:p-8">
      <div className="mb-8 max-w-2xl"><span className="font-mono text-[13px] font-bold tracking-widest text-cyber-tan">{"// PARTNERSHIP_NETWORK"}</span><h2 className="mt-2 font-heading text-xl leading-relaxed text-white uppercase md:text-2xl">Meet our sponsors</h2><p className="mt-3 font-mono text-xs leading-relaxed text-cyber-gray">A showcase of the organisations helping the next generation of defenders explore, build and lead. These are dummy partners for now; each card is ready to be replaced with a confirmed logo and website.</p></div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {PARTNERS.map((partner, index) => <motion.a key={partner.name} href={partner.url} target="_blank" rel="noreferrer" initial={reveal(index)} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.2 }} whileHover={{ y: -5, borderColor: "rgba(210,180,140,0.7)" }} transition={{ duration: 0.45, ease: "easeOut" }} className="group relative flex min-h-28 flex-col items-center justify-center overflow-hidden border border-cyber-blue/20 bg-white/[0.035] p-5 text-center shadow-[0_8px_25px_rgba(0,0,0,0.18)]">
          <span className="absolute inset-x-0 top-0 h-px origin-left bg-cyber-tan scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
          {partner.logo ? (
            <img src={partner.logo} alt={`${partner.name} logo`} className="h-full max-h-16 w-full max-w-[85%] object-contain opacity-90 transition duration-300 group-hover:scale-105 group-hover:opacity-100" />
          ) : (
            <>
              <span className="font-heading text-sm tracking-wider text-white uppercase opacity-90 transition duration-300 group-hover:scale-105 group-hover:opacity-100">{partner.name}</span>
              <span className="mt-3 font-mono text-[12px] font-bold tracking-wider text-cyber-gray transition-colors group-hover:text-cyber-tan">{"// CONFIRMED SOON"}</span>
            </>
          )}
        </motion.a>)}
      </div>
    </section>
  );
}

export function JudgesSection() {
  return (
    <section id="judges" className="crosshair-corner relative overflow-hidden border border-cyber-blue/10 bg-cyber-dark/30 backdrop-blur-md p-6 md:p-8">
      <div className="mb-8 max-w-2xl"><span className="font-mono text-[13px] font-bold tracking-widest text-cyber-tan">{"// EVALUATION_PANEL"}</span><h2 className="mt-2 font-heading text-xl leading-relaxed text-white uppercase md:text-2xl">Meet your judges</h2><p className="mt-3 font-mono text-xs leading-relaxed text-cyber-gray">The panel that scores the final defence. Profiles are being confirmed — full details land here soon.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {JUDGE_SLOTS.map((slot, index) => <motion.div key={slot} initial={reveal(index)} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.45, ease: "easeOut" }} className="overflow-hidden border border-cyber-blue/20 bg-cyber-black/45 p-3">
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-cyber-dark"><span className="font-heading text-3xl text-cyber-tan/40">?</span><span className="absolute left-2 top-2 font-mono text-[11px] tracking-widest text-cyber-blue/60">JUDGE_{String(slot).padStart(2, "0")}</span></div>
          <div className="pt-3"><h3 className="font-heading text-[14px] leading-relaxed text-white uppercase">Judge details coming soon</h3><p className="mt-1 font-mono text-[12px] font-bold tracking-widest text-cyber-tan">TO BE ANNOUNCED</p><p className="mt-2 font-mono text-[13px] leading-relaxed text-cyber-gray">Profile, role and background will be published closer to the event.</p></div>
        </motion.div>)}
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact_us" className="crosshair-corner relative border border-cyber-blue/10 bg-cyber-dark/30 backdrop-blur-md p-6 md:p-8">
      <div className="mb-6"><span className="font-mono text-[13px] font-bold tracking-widest text-cyber-tan">{"// DIRECT_CONTACTS"}</span><h2 className="mt-2 font-heading text-lg leading-relaxed text-white uppercase md:text-xl">Contact us</h2></div>
      <div className="grid gap-4 lg:grid-cols-3">
        {CONTACTS.map((person, index) => <motion.article key={person.name} initial={reveal(index)} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.4 }} className="flex items-center gap-4 border border-cyber-blue/15 bg-cyber-black/40 p-4">
          <img src={person.image} alt={`${person.name} profile placeholder`} className="h-16 w-16 shrink-0 border border-cyber-tan/30 object-cover" />
          <div className="min-w-0"><h3 className="font-heading text-[14px] leading-relaxed text-white uppercase">{person.name}</h3><p className="font-mono text-[12px] font-bold tracking-wide text-cyber-tan">{person.role}</p><div className="mt-2 space-y-1 font-mono text-[13px] text-cyber-gray"><a href={`tel:${person.phone?.replace(/\s/g, "")}`} className="block hover:text-white">{person.phone}</a><a href={`mailto:${person.email}`} className="block truncate hover:text-white">{person.email}</a><a href={person.url} target="_blank" rel="noreferrer" className="block text-cyber-blue hover:text-cyber-tan">LinkedIn ↗</a></div></div>
        </motion.article>)}
      </div>
    </section>
  );
}

"use client";
/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";

type Partner = { name: string; url: string; logo: string };
type Person = { name: string; role: string; url: string; image: string; bio?: string; phone?: string; email?: string };

// Swap any `url` and `logo` values here when partnerships are confirmed.
const PARTNERS: Partner[] = [
  { name: "Palo Alto Networks", url: "https://www.paloaltonetworks.com", logo: "https://logo.clearbit.com/paloaltonetworks.com?size=256" },
  { name: "Fortinet", url: "https://www.fortinet.com", logo: "https://logo.clearbit.com/fortinet.com?size=256" },
  { name: "Microsoft Security", url: "https://www.microsoft.com/security", logo: "https://logo.clearbit.com/microsoft.com?size=256" },
  { name: "CrowdStrike", url: "https://www.crowdstrike.com", logo: "https://logo.clearbit.com/crowdstrike.com?size=256" },
  { name: "Cisco Security", url: "https://www.cisco.com/go/security", logo: "https://logo.clearbit.com/cisco.com?size=256" },
  { name: "Okta", url: "https://www.okta.com", logo: "https://logo.clearbit.com/okta.com?size=256" },
  { name: "Check Point", url: "https://www.checkpoint.com", logo: "https://logo.clearbit.com/checkpoint.com?size=256" },
  { name: "Zscaler", url: "https://www.zscaler.com", logo: "https://logo.clearbit.com/zscaler.com?size=256" },
  { name: "Broadcom Security", url: "https://www.broadcom.com/solutions/security", logo: "https://logo.clearbit.com/broadcom.com?size=256" },
  { name: "Proofpoint", url: "https://www.proofpoint.com", logo: "https://logo.clearbit.com/proofpoint.com?size=256" },
];

const avatar = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=111126&color=d2b48c&bold=true&size=360&font-size=0.34`;

// Replace the placeholder records and avatar URLs with confirmed mentor profiles/photos.
const MENTORS: Person[] = [
  { name: "Mohammad Omar", role: "Security Mentor", url: "https://www.linkedin.com/in/mohammad-omar-a81b28388/", image: avatar("Mohammad Omar"), bio: "Brings a builder's eye to secure systems, threat modelling and practical problem solving." },
  { name: "Dharma Teja", role: "Cybersecurity Mentor", url: "https://www.linkedin.com/in/dharmatejarc06/", image: avatar("Dharma Teja"), bio: "Helps teams turn sharp technical ideas into clear, demonstrable security outcomes." },
  { name: "Logaa Paramesh", role: "Technical Mentor", url: "https://www.linkedin.com/in/logaa-paramesh-l-t/", image: avatar("Logaa Paramesh"), bio: "Focuses on resilient architecture, engineering detail and execution under pressure." },
  { name: "Tanush Jain", role: "Industry Mentor", url: "https://www.linkedin.com/in/tanush-jain-17601321a/", image: avatar("Tanush Jain"), bio: "Guides teams through product thinking, pitching and the human side of security." },
  { name: "Aarav Shah", role: "Red Team Judge", url: "https://www.linkedin.com/", image: avatar("Aarav Shah"), bio: "Placeholder profile — replace with a confirmed judge and their LinkedIn link." },
  { name: "Meera Iyer", role: "Cloud Security Judge", url: "https://www.linkedin.com/", image: avatar("Meera Iyer"), bio: "Placeholder profile — replace with a confirmed judge and their LinkedIn link." },
  { name: "Kabir Nair", role: "Forensics Mentor", url: "https://www.linkedin.com/", image: avatar("Kabir Nair"), bio: "Placeholder profile — replace with a confirmed mentor and their LinkedIn link." },
  { name: "Ananya Rao", role: "Application Security Judge", url: "https://www.linkedin.com/", image: avatar("Ananya Rao"), bio: "Placeholder profile — replace with a confirmed judge and their LinkedIn link." },
  { name: "Rohan Menon", role: "Threat Intelligence Mentor", url: "https://www.linkedin.com/", image: avatar("Rohan Menon"), bio: "Placeholder profile — replace with a confirmed mentor and their LinkedIn link." },
  { name: "Sana Kapoor", role: "Blue Team Judge", url: "https://www.linkedin.com/", image: avatar("Sana Kapoor"), bio: "Placeholder profile — replace with a confirmed judge and their LinkedIn link." },
];

const CONTACTS: Person[] = [
  { name: "Verril Vaz", role: "Cybersecurity Club President", url: "https://www.linkedin.com/", image: avatar("Verril Vaz"), phone: "+91 8971889830", email: "verril.vaz@hackurity.example" },
  { name: "Dharma Teja", role: "Cybersecurity Club Vice President", url: "https://www.linkedin.com/in/dharmatejarc06/", image: avatar("Dharma Teja"), phone: "+91 79 7565 0280", email: "dharma.teja@hackurity.example" },
  { name: "Logaa Paramesh", role: "Cybersecurity Club Technical Head", url: "https://www.linkedin.com/in/logaa-paramesh-l-t/", image: avatar("Logaa Paramesh"), phone: "+91 88704 96955", email: "logaa.paramesh@hackurity.example" },
];

const reveal = (index: number) => ({ opacity: 0, y: 20, scale: 0.97, transition: { delay: index * 0.045 } });

export function PartnersSection() {
  return (
    <section id="meet_our_sponsors" className="crosshair-corner relative overflow-hidden border border-cyber-blue/10 bg-cyber-dark/20 p-6 md:p-8">
      <div className="mb-8 max-w-2xl"><span className="font-mono text-[10px] font-bold tracking-widest text-cyber-tan">{"// PARTNERSHIP_NETWORK"}</span><h2 className="mt-2 font-heading text-xl leading-relaxed text-white uppercase md:text-2xl">Meet our sponsors</h2><p className="mt-3 font-mono text-xs leading-relaxed text-cyber-gray">A showcase of the organisations helping the next generation of defenders explore, build and lead. These are dummy partners for now; each card is ready to be replaced with a confirmed logo and website.</p></div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {PARTNERS.map((partner, index) => <motion.a key={partner.name} href={partner.url} target="_blank" rel="noreferrer" initial={reveal(index)} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.2 }} whileHover={{ y: -5, borderColor: "rgba(210,180,140,0.7)" }} transition={{ duration: 0.45, ease: "easeOut" }} className="group relative flex min-h-28 flex-col items-center justify-center overflow-hidden border border-cyber-blue/20 bg-white/[0.035] p-5 text-center shadow-[0_8px_25px_rgba(0,0,0,0.18)]">
          <span className="absolute inset-x-0 top-0 h-px origin-left bg-cyber-tan scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
          <img src={partner.logo} alt={`${partner.name} logo`} className="h-11 max-w-[130px] object-contain brightness-0 invert opacity-85 transition duration-300 group-hover:scale-105 group-hover:opacity-100" onError={(event) => { event.currentTarget.style.display = "none"; }} />
          <span className="mt-3 font-mono text-[9px] font-bold tracking-wider text-cyber-gray transition-colors group-hover:text-cyber-tan">{partner.name}</span>
        </motion.a>)}
      </div>
    </section>
  );
}

export function MentorsSection() {
  return (
    <section id="mentors_judges" className="crosshair-corner relative overflow-hidden border border-cyber-blue/10 bg-cyber-dark/20 p-6 md:p-8">
      <div className="mb-8 max-w-2xl"><span className="font-mono text-[10px] font-bold tracking-widest text-cyber-tan">{"// ADVISORY_CHANNEL"}</span><h2 className="mt-2 font-heading text-xl leading-relaxed text-white uppercase md:text-2xl">Meet your mentors &amp; judges</h2><p className="mt-3 font-mono text-xs leading-relaxed text-cyber-gray">The people in your corner when an idea needs a sharper edge. The first four profiles use the supplied LinkedIn pages; the remaining records are clearly marked placeholders.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {MENTORS.map((person, index) => <motion.a key={person.name} href={person.url} target="_blank" rel="noreferrer" initial={reveal(index)} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.15 }} whileHover={{ y: -6 }} transition={{ duration: 0.45, ease: "easeOut" }} className="group overflow-hidden border border-cyber-blue/20 bg-cyber-black/45 p-3 transition-colors hover:border-cyber-tan/60">
          <div className="relative aspect-[4/3] overflow-hidden bg-cyber-dark"><img src={person.image} alt={`${person.name} profile placeholder`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cyber-black to-transparent px-3 pb-2 pt-8 font-mono text-[9px] tracking-widest text-cyber-tan opacity-0 transition group-hover:opacity-100">VIEW LINKEDIN ↗</span></div>
          <div className="pt-3"><h3 className="font-heading text-[11px] leading-relaxed text-white uppercase">{person.name}</h3><p className="mt-1 font-mono text-[9px] font-bold tracking-widest text-cyber-tan">{person.role}</p><p className="mt-2 font-mono text-[10px] leading-relaxed text-cyber-gray">{person.bio}</p></div>
        </motion.a>)}
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact_us" className="crosshair-corner relative border border-cyber-blue/10 bg-cyber-dark/20 p-6 md:p-8">
      <div className="mb-6"><span className="font-mono text-[10px] font-bold tracking-widest text-cyber-tan">{"// DIRECT_CONTACTS"}</span><h2 className="mt-2 font-heading text-lg leading-relaxed text-white uppercase md:text-xl">Contact us</h2></div>
      <div className="grid gap-4 lg:grid-cols-3">
        {CONTACTS.map((person, index) => <motion.article key={person.name} initial={reveal(index)} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.4 }} className="flex items-center gap-4 border border-cyber-blue/15 bg-cyber-black/40 p-4">
          <img src={person.image} alt={`${person.name} profile placeholder`} className="h-16 w-16 shrink-0 border border-cyber-tan/30 object-cover" />
          <div className="min-w-0"><h3 className="font-heading text-[11px] leading-relaxed text-white uppercase">{person.name}</h3><p className="font-mono text-[9px] font-bold tracking-wide text-cyber-tan">{person.role}</p><div className="mt-2 space-y-1 font-mono text-[10px] text-cyber-gray"><a href={`tel:${person.phone?.replace(/\s/g, "")}`} className="block hover:text-white">{person.phone}</a><a href={`mailto:${person.email}`} className="block truncate hover:text-white">{person.email}</a><a href={person.url} target="_blank" rel="noreferrer" className="block text-cyber-blue hover:text-cyber-tan">LinkedIn ↗</a></div></div>
        </motion.article>)}
      </div>
    </section>
  );
}

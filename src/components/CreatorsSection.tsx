"use client";

import { motion } from "framer-motion";
import { AnimatedCorners } from "@/components/TechElements";
import { HudThumb, reveal } from "@/components/CommunityShowcase";

type Creator = {
  name: string;
  role: string;
  quote?: string;
  github: string;
  linkedin: string;
  image?: string;
};

const CREATORS: Creator[] = [
  {
    name: "Logaa Paramesh L T",
    role: "Lead Developer",
    quote: "Don't Touch it if it works, it will break.",
    github: "https://github.com/Fearoff5214",
    linkedin: "https://www.linkedin.com/in/logaa-paramesh-l-t/",
    image: "/members/Technical_department/logaa.png",
  },
  {
    name: "Mohammad Omar",
    role: "Developer",
    quote: "If you find a bug in this site, DM me. If you don't, I did my job right.",
    github: "https://github.com/MohammadOmar1054",
    linkedin: "https://www.linkedin.com/in/mohammad-omar-a81b28388/",
    image: "/members/Technical_department/Omer.jpg",
  },
  {
    name: "Tanush Jain",
    role: "Developer",
    quote: "I didn't write the bug, I just wrote the code next to it.",
    github: "https://github.com/Tanush-Jain",
    linkedin: "https://www.linkedin.com/in/tanush-jain-17601321a/",
    // No photo in /public/members yet — the initials tile is shown instead.
    // Drop the file in and set: image: "/members/Technical_department/<file>"
  },
];

export default function CreatorsSection() {
  return (
    <section
      id="meet_the_creators"
      className="crosshair-corner relative border border-cyber-blue/10 bg-cyber-dark/30 backdrop-blur-md p-6 md:p-8"
    >
      <div className="mb-6">
        <span className="font-mono text-[13px] font-bold tracking-widest text-cyber-tan">
          {"// BUILD_CREW"}
        </span>
        <h2 className="mt-2 font-heading text-lg leading-relaxed text-white uppercase md:text-xl">
          Meet the Creators
        </h2>
        <p className="mt-2 max-w-xl font-mono text-[13px] leading-relaxed text-cyber-gray">
          The operators who designed, coded and shipped this terminal.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CREATORS.map((person, index) => (
          <motion.article
            key={person.name}
            initial={reveal(index)}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-cyber-blue/20 bg-[linear-gradient(150deg,rgba(6,6,20,0.85),rgba(0,0,0,0.6))] p-5 shadow-[0_14px_45px_-30px_rgba(0,0,0,0.95)] transition-[border-color,box-shadow] duration-500 hover:border-cyber-tan/55 hover:shadow-[0_22px_60px_-30px_rgba(99,102,241,0.55)]"
          >
            <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_85%_0%,rgba(210,180,140,0.16),transparent_55%)]" />
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px origin-right scale-x-0 bg-gradient-to-l from-cyber-tan via-cyber-blue to-transparent transition-transform duration-500 group-hover:scale-x-100" />
            <AnimatedCorners size={12} tone="blue" />

            <div className="relative z-10 flex items-start gap-4">
              <HudThumb src={person.image} name={person.name} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-heading text-[15px] leading-snug text-white uppercase">
                    {person.name}
                  </h3>
                  <span className="font-mono text-[12px] tracking-widest text-cyber-blue/60">
                    {`0${index + 1}`}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[11px] font-bold tracking-[0.16em] text-cyber-tan uppercase">
                  {person.role}
                </p>
              </div>
            </div>

            {person.quote && (
              <p className="relative z-10 mt-4 rounded-lg bg-white/[0.04] px-3 py-2 font-mono text-[12.5px] leading-relaxed text-white/85 italic ring-1 ring-inset ring-white/10">
                &ldquo;{person.quote}&rdquo;
              </p>
            )}

            <div className="relative z-10 mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-3">
              <a
                href={person.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-cyber-blue/25 px-3 py-1.5 font-mono text-[12px] tracking-widest text-cyber-blue transition-colors hover:border-cyber-tan hover:text-cyber-tan"
              >
                GITHUB ↗
              </a>
              <a
                href={person.linkedin}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-cyber-blue/25 px-3 py-1.5 font-mono text-[12px] tracking-widest text-cyber-blue transition-colors hover:border-cyber-tan hover:text-cyber-tan"
              >
                LINKEDIN ↗
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

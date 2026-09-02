"use client";

import { motion } from "framer-motion";

type Creator = {
  name: string;
  role: string;
  quote?: string;
  phone: string;
  email?: string;
  github: string;
  linkedin: string;
};

const CREATORS: Creator[] = [
  {
    name: "Lavanya",
    role: "Lead Developer",
    quote: "Details pending.",
    phone: "TBD",
    email: "",
    github: "#",
    linkedin: "#",
  },
  {
    name: "Mohammad Omar",
    role: "Developer",
    quote: "If you find a bug in this site, DM me. If you don't, I did my job right.",
    phone: "+91 74559 04156",
    email: "omarofficial1054@gmail.com",
    github: "https://github.com/MohammadOmar1054",
    linkedin: "https://www.linkedin.com/in/mohammad-omar-a81b28388/",
  },
  {
    name: "Tanush Jain",
    role: "Developer",
    phone: "+91 89707 90411",
    email: "brandwopio76@gmail.com",
    github: "https://github.com/Tanush-Jain",
    linkedin: "https://www.linkedin.com/in/tanush-jain-17601321a/",
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

      <div className="grid gap-4 lg:grid-cols-3">
        {CREATORS.map((person, index) => (
          <motion.article
            key={person.name}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="flex flex-col border border-cyber-blue/15 bg-cyber-black/40 p-5 transition-colors hover:border-cyber-tan/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-heading text-[15px] leading-relaxed text-white uppercase">
                  {person.name}
                </h3>
                <p className="font-mono text-[12px] font-bold tracking-wide text-cyber-tan">
                  {person.role}
                </p>
              </div>
              <span className="font-mono text-[12px] tracking-widest text-cyber-blue/60">
                {`0${index + 1}`}
              </span>
            </div>

            {person.quote && (
              <p className="mt-4 border-l border-cyber-tan/40 pl-3 font-mono text-[13px] leading-relaxed text-cyber-gray italic">
                &ldquo;{person.quote}&rdquo;
              </p>
            )}

            <div className="mt-4 space-y-1 font-mono text-[13px] text-cyber-gray">
              <a
                href={`tel:${person.phone.replace(/\s/g, "")}`}
                className="block hover:text-white"
              >
                {person.phone}
              </a>
              {person.email && (
                <a
                  href={`mailto:${person.email}`}
                  className="block truncate hover:text-white"
                >
                  {person.email}
                </a>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 pt-1">
              <a
                href={person.github}
                target="_blank"
                rel="noreferrer"
                className="border border-cyber-blue/25 px-3 py-1.5 font-mono text-[12px] tracking-widest text-cyber-blue transition-colors hover:border-cyber-tan hover:text-cyber-tan"
              >
                GITHUB ↗
              </a>
              <a
                href={person.linkedin}
                target="_blank"
                rel="noreferrer"
                className="border border-cyber-blue/25 px-3 py-1.5 font-mono text-[12px] tracking-widest text-cyber-blue transition-colors hover:border-cyber-tan hover:text-cyber-tan"
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

import { motion } from "framer-motion";
import { FACULTY } from "./data";
import { Reveal, SectionHeading } from "./Reveal";

export default function FacultySection() {
  return (
    <section id="faculty" className="relative mx-auto max-w-6xl px-5 py-24 md:px-8">
      <SectionHeading
        tag="Guidance"
        title="Meet our faculty in charge"
        description="The teaching staff who support the club, approve our events and help members connect their coursework with what we do here."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {FACULTY.map((person, index) => (
          <Reveal key={person.name} delay={index * 0.07} y={20}>
            <motion.article
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="glass-panel bracket-container flex h-full flex-col p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-cyber-tan/40 bg-cyber-tan/10 font-heading text-[13px] text-cyber-tan">
                  {person.name
                    .replace(/^(Dr\.|Prof\.)\s*/, "")
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <h3 className="font-heading text-[12px] leading-relaxed uppercase">
                    {person.name}
                  </h3>
                  <p className="mt-1.5 font-mono text-[9.5px] font-bold tracking-widest text-cyber-tan uppercase">
                    {person.title}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-cyber-gray">{person.role}</p>
                </div>
              </div>

              <p className="mt-5 border-l border-cyber-tan/40 pl-3 font-mono text-[10.5px] leading-relaxed text-cyber-gray italic">
                &ldquo;{person.saying}&rdquo;
              </p>

              <div className="mt-5 space-y-1 font-mono text-[10px] text-cyber-gray">
                <a href={`tel:${person.phone.replace(/\s/g, "")}`} className="block hover:text-white">
                  {person.phone}
                </a>
                <a href={`mailto:${person.email}`} className="block truncate hover:text-white">
                  {person.email}
                </a>
              </div>

              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-cyber-blue/25 px-3 py-1.5 font-mono text-[9px] tracking-widest text-cyber-blue transition-colors hover:border-cyber-tan hover:text-cyber-tan"
                >
                  LINKEDIN ↗
                </a>
                <a
                  href={person.github}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-cyber-blue/25 px-3 py-1.5 font-mono text-[9px] tracking-widest text-cyber-blue transition-colors hover:border-cyber-tan hover:text-cyber-tan"
                >
                  GITHUB ↗
                </a>
                <a
                  href={`mailto:${person.email}`}
                  className="border border-cyber-blue/25 px-3 py-1.5 font-mono text-[9px] tracking-widest text-cyber-blue transition-colors hover:border-cyber-tan hover:text-cyber-tan"
                >
                  EMAIL ↗
                </a>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

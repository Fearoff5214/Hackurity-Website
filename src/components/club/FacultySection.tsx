"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { CONVENORS, FACULTY_IN_CHARGE, type TeamPortrait } from "./data";
import { Reveal, SectionHeading } from "./Reveal";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
    </svg>
  );
}

function PortraitCard({ person, index }: { person: TeamPortrait; index: number }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const initials = person.name
    .replace(/^(Dr\.|Prof\.)\s*/, "")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <Reveal delay={index * 0.07} y={20}>
      <motion.article whileHover={{ y: -4 }} transition={{ duration: 0.25 }} className="glass-panel bracket-container h-full p-4">
        <div className="relative aspect-[4/5] w-full overflow-hidden border border-cyber-tan/25 bg-cyber-tan/10">
          {!photoFailed && (
            <img
              src={person.photo}
              alt={person.name}
              onError={() => setPhotoFailed(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          {photoFailed && (
            <div className="absolute inset-0 flex items-center justify-center font-heading text-3xl text-cyber-tan">
              {initials}
            </div>
          )}

          {person.linkedin ? (
            <a
              href={person.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label={`${person.name} on LinkedIn`}
              className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center border border-cyber-blue/40 bg-cyber-black/80 text-white transition-colors hover:border-cyber-tan hover:text-cyber-tan"
            >
              <LinkedInIcon />
            </a>
          ) : (
            <span
              aria-hidden="true"
              className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center border border-cyber-blue/15 bg-cyber-black/80 text-cyber-blue/30"
            >
              <LinkedInIcon />
            </span>
          )}
        </div>

        <h3 className="mt-3 font-heading text-[13px] leading-relaxed uppercase">{person.name}</h3>
        <p className="mt-1 font-mono text-[11px] leading-relaxed text-cyber-gray">{person.role}</p>
      </motion.article>
    </Reveal>
  );
}

function PortraitGroup({ label, people }: { label: string; people: TeamPortrait[] }) {
  return (
    <div className="mt-12 first:mt-0">
      <Reveal>
        <span className="font-mono text-[11px] font-bold tracking-[0.3em] text-cyber-tan">
          {`// ${label}`}
        </span>
      </Reveal>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {people.map((person, index) => (
          <PortraitCard key={person.name} person={person} index={index} />
        ))}
      </div>
    </div>
  );
}

export default function FacultySection() {
  return (
    <section id="faculty" className="relative mx-auto max-w-6xl px-5 py-24 md:px-8">
      <SectionHeading
        tag="Guidance"
        title="Meet our convenors & faculty in-charge"
        description="The teaching staff who support the club, approve our events and help members connect their coursework with what we do here."
      />

      <PortraitGroup label="CONVENORS" people={CONVENORS} />
      <PortraitGroup label="FACULTY IN-CHARGE" people={FACULTY_IN_CHARGE} />
    </section>
  );
}

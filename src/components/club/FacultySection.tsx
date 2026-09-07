import { motion } from "framer-motion";
import { useState } from "react";
import { CONVENORS, FACULTY_IN_CHARGE, type TeamPortrait } from "./data";
import { SectionHeading } from "./Reveal";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
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
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -7 }}
      className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(13,20,28,0.96),rgba(3,7,11,0.98))] p-4 shadow-[0_18px_60px_-35px_rgba(0,0,0,0.9)] transition duration-500 hover:border-cyber-tan/50"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(210,180,120,0.11),transparent_45%)]" />

      <div className="relative overflow-hidden rounded-xl border border-cyber-tan/25 bg-cyber-blue/[0.04]">
        <motion.div whileHover={{ scale: 1.035 }} transition={{ duration: 0.5 }} className="aspect-[4/5]">
          {!photoFailed ? (
            <img
              src={person.photo}
              alt={person.name}
              onError={() => setPhotoFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-heading text-4xl text-cyber-tan">
              {initials}
            </div>
          )}
        </motion.div>

        {person.linkedin ? (
          <a
            href={person.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label={`${person.name} on LinkedIn`}
            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-black/75 text-white/80 backdrop-blur transition hover:border-cyber-tan hover:text-cyber-tan"
          >
            <LinkedInIcon />
          </a>
        ) : (
          <span
            aria-hidden="true"
            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-white/20"
          >
            <LinkedInIcon />
          </span>
        )}
      </div>

      <h3 className="relative mt-4 font-heading text-[15px] leading-snug tracking-wide text-white uppercase">
        {person.name}
      </h3>
      <p
        className="relative mt-2 font-mono text-[11px] leading-relaxed text-white/55"
        title={person.role}
      >
        {person.role}
      </p>
    </motion.article>
  );
}

function findByName(people: TeamPortrait[], match: string) {
  const person = people.find((p) => p.name.includes(match));
  if (!person) throw new Error(`Could not find team member matching "${match}"`);
  return person;
}

const TEAM_DISPLAY_ORDER = [
  findByName(CONVENORS, "Nethravathi"),
  findByName(CONVENORS, "Ashwin"),
  findByName(FACULTY_IN_CHARGE, "Sathish"),
  findByName(CONVENORS, "Syed"),
  findByName(FACULTY_IN_CHARGE, "Kiran"),
];

export default function FacultySection() {
  return (
    <section
      id="faculty"
      className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-5 md:px-8 md:py-24"
    >
      <SectionHeading
        tag="Guidance"
        title="Meet our convenors & faculty in-charge"
        description="The teaching staff who support the club, approve our events and help members connect their coursework with what we dohere."
      />

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {TEAM_DISPLAY_ORDER.map((person, index) => (
          <PortraitCard key={person.name} person={person} index={index} />
        ))}
      </div>
    </section>
  );
}
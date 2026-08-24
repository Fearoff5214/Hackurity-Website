"use client";
import { Reveal, SectionHeading } from "./Reveal";

const STATS = [
  { value: "2023", label: "Founded" },
  { value: "240+", label: "Active members" },
  { value: "45+", label: "Workshops held" },
  { value: "12", label: "Inter-college wins" },
];

const HIGHLIGHTS = [
  {
    year: "2024",
    title: "National CTF finalists",
    text: "Two of our teams reached the finals of a national capture-the-flag competition in Hyderabad.",
  },
  {
    year: "2024",
    title: "Campus security audit",
    text: "Members ran a supervised review of internal college web tools and reported the issues they found.",
  },
  {
    year: "2025",
    title: "Certification drive",
    text: "38 members completed recognised entry-level security certifications through club study groups.",
  },
  {
    year: "2025",
    title: "Industry mentor programme",
    text: "Working professionals now join our monthly sessions to review student projects.",
  },
];

const CERTIFICATIONS = [
  "CompTIA Security+",
  "Certified Ethical Hacker",
  "Cisco CyberOps Associate",
  "AWS Cloud Practitioner",
  "Google Cybersecurity Certificate",
];

export default function AboutSection() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-5 py-24 md:px-8">
      <SectionHeading
        tag="About the club"
        title="Who we are"
        description="The Cybersecurity Club at REVA University, Bangalore, started in 2023 with a small group of students who wanted a place to learn security properly instead of picking it up in bits and pieces."
      />

      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
        <Reveal delay={0.05}>
          <div className="bracket-container glass-panel p-6 md:p-8">
            <p className="font-mono text-[13.5px] leading-relaxed text-cyber-gray">
              Today we are a student-run club of a few hundred members across every year of study.
              We meet every week to run hands-on sessions, practice on safe lab setups and work
              through real problems together. Beginners are welcome — most of our members joined
              knowing nothing about the subject.
            </p>
            <p className="mt-4 font-mono text-[13.5px] leading-relaxed text-cyber-gray">
              Alongside the weekly sessions we organise talks, competitions and one large annual
              event. Everything is planned and run by students, with guidance from faculty in the
              School of Computer Science and Engineering. Our aim is simple: help members leave
              university with skills they can actually use, and a group of people they can keep
              learning with.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-px border border-cyber-blue/15 bg-cyber-blue/15 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-black/70 px-4 py-5 text-center">
                  <div className="font-heading text-base text-cyber-tan">{stat.value}</div>
                  <div className="mt-2 font-mono text-[10px] tracking-widest text-cyber-gray uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="space-y-4">
          {HIGHLIGHTS.map((item, index) => (
            <Reveal key={item.title} delay={0.08 * index} y={18}>
              <article className="group border border-cyber-blue/15 bg-black/50 p-5 transition-colors hover:border-cyber-tan/40">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-heading text-[12.5px] leading-relaxed uppercase">
                    {item.title}
                  </h3>
                  <span className="font-mono text-[10px] tracking-widest text-cyber-blue/70">
                    {item.year}
                  </span>
                </div>
                <p className="mt-3 font-mono text-[12px] leading-relaxed text-cyber-gray">
                  {item.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal delay={0.1} className="mt-10">
        <div className="dot-mesh border border-cyber-blue/15 p-6">
          <span className="font-mono text-[11px] font-bold tracking-[0.3em] text-cyber-tan">
            {"// CERTIFICATIONS OUR MEMBERS HOLD"}
          </span>
          <div className="mt-4 flex flex-wrap gap-2">
            {CERTIFICATIONS.map((item) => (
              <span
                key={item}
                className="border border-cyber-blue/25 bg-black/60 px-3 py-1.5 font-mono text-[11px] tracking-wide text-cyber-gray"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

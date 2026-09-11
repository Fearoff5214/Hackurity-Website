"use client";
import { Reveal, SectionHeading } from "./Reveal";

const STATS = [
  { value: "2024", label: "Founded" },
  { value: "30+", label: "Active members" },
  { value: "3+", label: "Workshops held" },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-5 py-24 md:px-8">
      <SectionHeading
        tag="About the club"
        title="Who we are"
        description="The Cybersecurity Club at REVA University, Bengaluru, started in 2024 with a small group of students who wanted a place to learn security properly instead of picking it up in bits and pieces."
      />

      <Reveal delay={0.05}>
        <div className="bracket-container glass-panel p-6 md:p-8">
          <p className="font-mono text-[15.5px] leading-relaxed text-cyber-gray">
            Today we are a student-run club with 30+ active members across every year of study,
            plus alumni who still stay connected to what we're building. We meet every week to run
            hands-on sessions, practice on safe lab setups and work through real problems together.
            Beginners are welcome — most of our members joined knowing nothing about the subject.
          </p>
          <p className="mt-4 font-mono text-[15.5px] leading-relaxed text-cyber-gray">
            Alongside the weekly sessions we organise talks, competitions and one large annual
            event. Everything is planned and run by students, with guidance from faculty in the
            School of Computer Science and Engineering. Our aim is simple: help members leave
            university with skills they can actually use, and a group of people they can keep
            learning with.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-px border border-cyber-blue/15 bg-cyber-blue/15">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-black/70 px-4 py-5 text-center">
                <div className="font-heading text-base text-cyber-tan">{stat.value}</div>
                <div className="mt-2 font-mono text-[12px] tracking-widest text-cyber-gray uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

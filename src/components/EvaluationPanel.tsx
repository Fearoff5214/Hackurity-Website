"use client";

import React from "react";
import { motion } from "framer-motion";

// ============= EVALUATION PANEL REGISTRY (06 OPERATORS) =============
// Judges & mentors reviewing every submission. Cyber-theme framing,
// plain-English descriptions of what each person actually does.
export type PanelMember = {
  initials: string;
  name: string;
  role: string;
  org: string;
  tags: string[];
  description: string;
  profile: string;
};

export const PANEL: PanelMember[] = [
  {
    initials: "AR",
    name: "Dr. Ananya Rao",
    role: "Chief Information Security Officer",
    org: "National Payments Infrastructure",
    tags: ["Threat Intelligence", "Fraud Systems"],
    description:
      "She protects the systems that move money for millions of people every day, and she spends most of her time studying how attackers try to break them. Expect her to ask how your idea would hold up against a real, motivated fraudster.",
    profile: "https://www.linkedin.com/",
  },
  {
    initials: "VN",
    name: "Vikram Nair",
    role: "Principal Security Engineer",
    org: "Cloud Platform Group",
    tags: ["Identity", "Workload Isolation"],
    description:
      "He designs the permission and isolation layers that keep one customer's workload from ever touching another's. He is a good person to talk to if your project runs in the cloud and you are unsure who should be allowed to do what.",
    profile: "https://www.linkedin.com/",
  },
  {
    initials: "MI",
    name: "Meera Iqbal",
    role: "Head of Offensive Research",
    org: "Independent Red Team Collective",
    tags: ["Exploit Dev", "Firmware"],
    description:
      "She breaks into software and hardware for a living so that vendors can fix it before anyone else finds the hole. She will happily try to break your build in front of you, and then tell you exactly how she did it.",
    profile: "https://www.linkedin.com/",
  },
  {
    initials: "SB",
    name: "Prof. Sanjay Bose",
    role: "Chair, Applied Cryptography",
    org: "Institute of Technology",
    tags: ["Post-Quantum", "Protocol Design"],
    description:
      "He teaches and researches the maths behind encryption, including the new schemes meant to survive quantum computers. If your project rolls its own crypto, he is the one who will notice.",
    profile: "https://www.linkedin.com/",
  },
  {
    initials: "RS",
    name: "Ritika Shah",
    role: "Director, Digital Forensics",
    org: "Cyber Crime Investigation Cell",
    tags: ["Incident Response", "Evidence"],
    description:
      "She leads investigations after an attack has already happened, recovering evidence that stands up in court. She values clear logs, honest documentation and tools that help a responder work faster under pressure.",
    profile: "https://www.linkedin.com/",
  },
  {
    initials: "AM",
    name: "Arjun Menon",
    role: "VP Engineering, Trust & Safety",
    org: "Consumer Internet Platform",
    tags: ["Detection", "Abuse Systems"],
    description:
      "He builds the systems that spot spam, scams and abuse on a platform used by millions. He cares about whether a solution still works at scale, and whether it treats ordinary users fairly while doing it.",
    profile: "https://www.linkedin.com/",
  },
];

export default function EvaluationPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {PANEL.map((member, i) => (
        <motion.div
          key={member.name}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: i * 0.07, ease: "easeOut" }}
          className="group relative border border-cyber-blue/15 bg-cyber-dark/30 p-4 flex flex-col gap-3 hover:border-cyber-tan/40 transition-colors duration-300"
        >
          {/* Corner ticks */}
          <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-tan/50" />
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-tan/50" />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 border border-cyber-tan/30 bg-cyber-tan/5 flex items-center justify-center font-mono text-[12px] font-bold text-cyber-tan tracking-widest">
                {member.initials}
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-sm text-white uppercase tracking-tight leading-tight">
                  {member.name}
                </span>
                <span className="font-mono text-[11px] text-cyber-blue/80 leading-tight mt-0.5">
                  {member.role}
                </span>
              </div>
            </div>
            <span className="font-mono text-[9px] text-cyber-gray shrink-0">
              PNL-{String(i + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="font-mono text-[11px] text-cyber-tan/70 border-y border-cyber-blue/10 py-1.5">
            ORG_NODE: {member.org.toUpperCase()}
          </div>

          <p className="font-mono text-[12px] leading-relaxed text-cyber-gray">
            {member.description}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 mt-auto pt-1">
            {member.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono border border-cyber-blue/20 text-cyber-blue/80 px-1.5 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>

          <a
            href={member.profile}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-cyber-tan hover:text-white transition-colors duration-200 tracking-widest uppercase"
          >
            &gt; OPEN_DOSSIER
          </a>
        </motion.div>
      ))}
    </div>
  );
}

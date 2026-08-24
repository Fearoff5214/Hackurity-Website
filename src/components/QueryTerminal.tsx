"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type QaRecord = { id: string; question: string; answer: string };

const RECORDS: QaRecord[] = [
  {
    id: "01",
    question: "Who can take part?",
    answer:
      "Any student currently enrolled in a college or university in India. Teams can have two to four people. Teams built from different colleges or different subjects are very welcome — mixed teams often do the best.",
  },
  {
    id: "02",
    question: "Do I need cybersecurity experience?",
    answer:
      "No. About a third of every batch is brand new to security. The workshops before the event exist exactly for beginners, and first-time teams get a mentor on priority.",
  },
  {
    id: "03",
    question: "Is there a registration fee?",
    answer:
      "A minimum fee of ₹800 is applicable for registration of team consisting <min 3>//< max 4> members ",
  },
  {
    id: "04",
    question: "Is the event online or in person?",
    answer:
      "The 24-hour build happens in person at the venue. The workshops and problem-statement briefings in the weeks before are streamed and recorded so you can watch from anywhere.",
  },
  {
    id: "05",
    question: "What should my team bring?",
    answer:
      "Laptops, chargers, any special hardware your track needs, a valid student ID & Entry pass for the event provided at the University Enterance Gate. Internet, power, desks and lab machines are provided.",
  },
  {
    id: "06",
    question: "How will we be judged?",
    answer:
      "Four things carry weight: how technically deep the work is, whether the security choices are actually correct, whether it could be used in the real world, and how well you explain it in the final presentation. The scoring sheet is published along with the problem statements.",
  },
  {
    id: "07",
    question: "Can we keep working on our project after the event?",
    answer:
      "Yes. You own everything you build. Several past projects are now open-source tools that people still use.",
  },
];

export default function QueryTerminal() {
  const [activeId, setActiveId] = useState(RECORDS[0].id);
  const [query, setQuery] = useState("");
  const [typed, setTyped] = useState("");

  const active = useMemo(
    () => RECORDS.find((record) => record.id === activeId) ?? RECORDS[0],
    [activeId]
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return RECORDS;
    return RECORDS.filter(
      (record) =>
        record.question.toLowerCase().includes(needle) ||
        record.answer.toLowerCase().includes(needle)
    );
  }, [query]);

  // Type the active answer out, character by character.
  useEffect(() => {
    setTyped("");
    let index = 0;
    const id = window.setInterval(() => {
      index += 2;
      setTyped(active.answer.slice(0, index));
      if (index >= active.answer.length) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      {/* Query index */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        <div className="flex items-center justify-between border border-cyber-blue/15 bg-cyber-black/50 px-3 py-2 font-mono text-[10px] tracking-widest text-cyber-tan">
          <span>QUERY_INDEX</span>
          <span className="text-cyber-gray">{RECORDS.length} RECORDS</span>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="search a question..."
          className="w-full rounded-none border border-cyber-tan/25 bg-cyber-black px-3 py-2.5 font-terminal text-xs text-white placeholder:text-cyber-gray/40 focus:border-cyber-tan focus:outline-none"
        />
        <ul className="flex flex-col divide-y divide-cyber-blue/10 border border-cyber-blue/10 bg-cyber-dark/30">
          {filtered.map((record) => (
            <li key={record.id}>
              <button
                type="button"
                onClick={() => setActiveId(record.id)}
                className={`flex w-full items-start gap-3 px-3 py-3 text-left font-terminal text-[12px] transition-colors ${
                  record.id === active.id
                    ? "bg-cyber-tan/10 text-cyber-tan"
                    : "text-cyber-gray hover:bg-cyber-blue/5 hover:text-white"
                }`}
              >
                <span className="mt-0.5 font-mono text-[10px] font-bold text-cyber-blue/80">{record.id}</span>
                <span className="leading-relaxed">{record.question}</span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-3 py-4 font-terminal text-[12px] text-cyber-gray/60">
              no matching record found.
            </li>
          )}
        </ul>
      </div>

      {/* Terminal output */}
      <div className="lg:col-span-7 relative flex min-h-[300px] flex-col border border-cyber-blue/15 bg-cyber-black/60">
        <div className="pointer-events-none absolute inset-0 cyber-grid opacity-50" />
        <div className="relative flex items-center justify-between border-b border-cyber-blue/15 bg-cyber-dark/70 px-4 py-2.5 font-mono text-[10px] tracking-widest">
          <span className="text-cyber-tan">// RECORD_RETRIEVED</span>
          <span className="flex items-center gap-1.5 text-cyber-blue">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyber-blue" />
            LINK ACTIVE
          </span>
        </div>

        <div className="relative flex flex-1 flex-col gap-4 p-4 md:p-5">
          <div className="font-terminal text-[12px] text-cyber-gray">
            guest@hackurity:~$ query --record {active.id}
          </div>
          <motion.h3
            key={`${active.id}-q`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-[14px] leading-snug text-white uppercase md:text-sm"
          >
            {active.question}
          </motion.h3>
          <p className="font-terminal text-[13px] leading-relaxed text-cyber-gray md:text-[14px]">
            <span className="mr-1.5 text-cyber-tan">&gt;</span>
            {typed}
            <span className="ml-0.5 animate-pulse text-cyber-tan">▌</span>
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-cyber-blue/10 pt-3 font-mono text-[9px] tracking-widest text-cyber-gray/60">
            <span>RECORD {active.id} / {String(RECORDS.length).padStart(2, "0")}</span>
            <span className="text-cyber-tan/60">CHANNEL: AES-256</span>
          </div>
        </div>
      </div>
    </div>
  );
}

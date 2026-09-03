"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type QaRecord = { id: string; question: string; answer: string };

const RECORDS: QaRecord[] = [
  {
    id: "01",
    question: "Who can take part?",
    answer:
      "Any student currently enrolled in a college or university in India. Teams are 3–4 people, and students from different colleges and different academic backgrounds are welcome to form a team together.",
  },
  {
    id: "02",
    question: "Is Hackurity online or offline?",
    answer:
      "Hackurity is a fully offline hackathon. Everyone attends in person at the venue on the 14th and 15th of October 2026.",
  },
  {
    id: "03",
    question: "Is there a registration fee?",
    answer:
      "Yes. Entry is ₹800 per team. That single payment covers your whole team for the hackathon — there are no other charges.",
  },
  {
    id: "04",
    question: "Is the ₹800 fee per person or per team?",
    answer:
      "Per team. One payment of ₹800 covers your entire team of 3 or 4 members.",
  },
  {
    id: "05",
    question: "What does the ₹800 entry fee cover?",
    answer:
      "It covers your team's participation in Hackurity — venue access, mentorship and event infrastructure across the full 24 hours.",
  },
  {
    id: "06",
    question: "What is the team size?",
    answer:
      "Every team must have 3 or 4 members. Teammates can be from the same college or from different colleges — both are allowed.",
  },
  {
    id: "07",
    question: "Do I need prior cybersecurity experience?",
    answer:
      "No. You do not need to be an expert in cybersecurity. A willingness to learn, build and solve problems is what matters, and teams with mixed technical backgrounds are encouraged.",
  },
  {
    id: "08",
    question: "When will the problem statements be released?",
    answer:
      "The problem statements are revealed about one week before the hackathon. This gives registered teams time to study the challenges and decide which problem they want to work on.",
  },
  {
    id: "09",
    question: "Can we change our track after registration?",
    answer:
      "Yes. Teams can change their selected track after registering, including after the problem statements are released, so you can pick the statement that best matches your interests and skills.",
  },
  {
    id: "10",
    question: "Can students from different colleges form a team?",
    answer:
      "Yes. Cross-college teams are welcome. You can form a team with students from different colleges and different academic backgrounds.",
  },
  {
    id: "11",
    question: "What should my team bring?",
    answer:
      "Since Hackurity is offline, bring your laptops, chargers and any other equipment your build needs. Come prepared to work on site for the full event.",
  },
  {
    id: "12",
    question: "How will the projects be judged?",
    answer:
      "Projects are evaluated on technical implementation, creativity, relevance to the problem statement, functionality, security considerations and overall impact. The detailed judging criteria are shared with participants before or during the hackathon.",
  },
  {
    id: "13",
    question: "What will I get by participating?",
    answer:
      "You get the chance to compete for prize money, receive a certificate, get Hackurity merchandise, gain hands-on experience on real-world cybersecurity challenges, meet other students and enthusiasts, and showcase your technical skills.",
  },
  {
    id: "14",
    question: "Will every participant receive a certificate?",
    answer:
      "Yes. Every participant who attends the hackathon receives a certificate of participation.",
  },
  {
    id: "15",
    question: "Will participants get merchandise?",
    answer:
      "Hackurity merchandise is distributed to teams in recognition of outstanding performance during the event.",
  },
  {
    id: "16",
    question: "When is Hackurity?",
    answer:
      "Hackurity takes place on the 14th and 15th of October 2026 and is run as an offline hackathon.",
  },
  {
    id: "17",
    question: "Where will Hackurity be held?",
    answer:
      "Hackurity is held on campus at REVA University, Bengaluru. The exact hall and entry-gate details are shared with registered teams ahead of the event.",
  },
  {
    id: "18",
    question: "What skills can I use at Hackurity?",
    answer:
      "You can bring skills in cybersecurity, web development, programming, networking, digital forensics, cryptography, UI/UX, research and problem solving. Teams with a spread of different skill sets tend to do well.",
  },
];

// ── Lightweight text matching ────────────────────────────────────────────
// Turns a free-form question ("How much is the fee?") into keywords and finds
// every record whose question or answer contains a matching word.

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "am", "was", "were", "be", "been", "being",
  "to", "of", "for", "from", "in", "on", "at", "by", "with", "about", "as", "into",
  "do", "does", "did", "done", "have", "has", "had", "will", "would", "shall",
  "should", "can", "could", "may", "might", "must", "i", "we", "you", "they",
  "he", "she", "it", "me", "us", "my", "our", "your", "their", "this", "that",
  "these", "those", "there", "here", "and", "or", "but", "if", "so", "than",
  "then", "how", "what", "when", "where", "which", "who", "whom", "why", "much",
  "many", "get", "got", "need", "needs", "want", "any", "some", "all", "no",
  "not", "please", "tell", "know", "about",
]);

function stem(word: string): string {
  if (word.length <= 3) return word;
  return (
    word
      .replace(/ies$/, "y")
      .replace(/(ings|ing|ers|er|ed|es|s)$/, "") || word
  );
}

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9₹]+/g) ?? []).filter(Boolean);
}

function keyTokens(text: string): string[] {
  const out = new Set<string>();
  for (const raw of tokenize(text)) {
    if (raw.length < 2 || STOPWORDS.has(raw)) continue;
    out.add(stem(raw));
  }
  return [...out];
}

// True when two words are the "same" allowing for a plural / typo / prefix.
function wordsMatch(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length < 4 || b.length < 4) return false;
  if (a.includes(b) || b.includes(a)) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  // one-edit distance
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i += 1;
      j += 1;
      continue;
    }
    edits += 1;
    if (edits > 1) return false;
    if (a.length > b.length) i += 1;
    else if (b.length > a.length) j += 1;
    else {
      i += 1;
      j += 1;
    }
  }
  edits += a.length - i + (b.length - j);
  return edits <= 1;
}

export default function QueryTerminal() {
  const [activeId, setActiveId] = useState(RECORDS[0].id);
  const [query, setQuery] = useState("");
  const [typed, setTyped] = useState("");

  // Pre-index the keywords for every record once.
  const recordWords = useMemo(
    () =>
      RECORDS.map((record) => ({
        id: record.id,
        words: new Set([...keyTokens(record.question), ...keyTokens(record.answer)]),
      })),
    []
  );

  const parsedKeys = useMemo(() => keyTokens(query), [query]);

  const filtered = useMemo(() => {
    const raw = query.trim().toLowerCase();
    if (!raw) return RECORDS;

    // No meaningful keywords (e.g. "how much?") — fall back to a plain contains.
    if (parsedKeys.length === 0) {
      return RECORDS.filter(
        (record) =>
          record.question.toLowerCase().includes(raw) ||
          record.answer.toLowerCase().includes(raw)
      );
    }

    // Score each record by how many of the parsed keywords it contains.
    return recordWords
      .map((record) => {
        let score = 0;
        for (const key of parsedKeys) {
          for (const word of record.words) {
            if (wordsMatch(key, word)) {
              score += 1;
              break;
            }
          }
        }
        return { id: record.id, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
      .map((entry) => RECORDS.find((record) => record.id === entry.id)!);
  }, [query, parsedKeys, recordWords]);

  const active = useMemo(
    () => RECORDS.find((record) => record.id === activeId) ?? RECORDS[0],
    [activeId]
  );

  // Keep the active record inside the current result set.
  useEffect(() => {
    if (filtered.length === 0) return;
    if (!filtered.some((record) => record.id === activeId)) {
      setActiveId(filtered[0].id);
    }
  }, [filtered, activeId]);

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
        <div className="flex items-center justify-between border border-cyber-blue/15 bg-cyber-black/50 px-3 py-2 font-mono text-[12px] tracking-widest text-cyber-tan">
          <span>QUERY_INDEX</span>
          <span className="text-cyber-gray">
            {query.trim() ? `${filtered.length} / ${RECORDS.length}` : RECORDS.length} RECORDS
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="search a question... (e.g. how much is the fee)"
            className="w-full rounded-none border border-cyber-tan/25 bg-cyber-black px-3 py-2.5 font-terminal text-xs text-white placeholder:text-cyber-gray/40 focus:border-cyber-tan focus:outline-none"
          />
          {query.trim() && parsedKeys.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 px-0.5 font-mono text-[11px] tracking-widest text-cyber-gray/70">
              <span className="text-cyber-tan/70">PARSED_KEYS:</span>
              {parsedKeys.map((key) => (
                <span
                  key={key}
                  className="border border-cyber-blue/20 bg-cyber-blue/5 px-1.5 py-0.5 text-cyber-blue/90"
                >
                  {key}
                </span>
              ))}
            </div>
          )}
        </div>

        <ul className="flex max-h-[420px] flex-col divide-y divide-cyber-blue/10 overflow-y-auto border border-cyber-blue/10 bg-cyber-dark/30 [scrollbar-color:rgba(212,181,132,0.4)_transparent] [scrollbar-width:thin]">
          {filtered.map((record) => (
            <li key={record.id}>
              <button
                type="button"
                onClick={() => setActiveId(record.id)}
                className={`flex w-full items-start gap-3 px-3 py-3 text-left font-terminal text-[14px] transition-colors ${
                  record.id === active.id
                    ? "bg-cyber-tan/10 text-cyber-tan"
                    : "text-cyber-gray hover:bg-cyber-blue/5 hover:text-white"
                }`}
              >
                <span className="mt-0.5 font-mono text-[12px] font-bold text-cyber-blue/80">{record.id}</span>
                <span className="leading-relaxed">{record.question}</span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-3 py-4 font-terminal text-[14px] text-cyber-gray/60">
              no matching record found.
            </li>
          )}
        </ul>

      </div>

      {/* Terminal output */}
      <div className="lg:col-span-7 relative flex min-h-[300px] flex-col border border-cyber-blue/15 bg-cyber-black/60">
        <div className="pointer-events-none absolute inset-0 cyber-grid opacity-50" />
        <div className="relative flex items-center justify-between border-b border-cyber-blue/15 bg-cyber-dark/70 px-4 py-2.5 font-mono text-[12px] tracking-widest">
          <span className="text-cyber-tan">// RECORD_RETRIEVED</span>
          <span className="flex items-center gap-1.5 text-cyber-blue">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyber-blue" />
            LINK ACTIVE
          </span>
        </div>

        <div className="relative flex flex-1 flex-col gap-4 p-4 md:p-5">
          <div className="font-terminal text-[14px] text-cyber-gray">
            guest@hackurity:~$ query --record {active.id}
          </div>
          <motion.h3
            key={`${active.id}-q`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-[16px] leading-snug text-white uppercase md:text-sm"
          >
            {active.question}
          </motion.h3>
          <p className="font-terminal text-[15px] leading-relaxed text-cyber-gray md:text-[16px]">
            <span className="mr-1.5 text-cyber-tan">&gt;</span>
            {typed}
            <span className="ml-0.5 animate-pulse text-cyber-tan">▌</span>
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-cyber-blue/10 pt-3 font-mono text-[11px] tracking-widest text-cyber-gray/60">
            <span>RECORD {active.id} / {String(RECORDS.length).padStart(2, "0")}</span>
            <span className="text-cyber-tan/60">CHANNEL: AES-256</span>
          </div>
        </div>
      </div>
    </div>
  );
}

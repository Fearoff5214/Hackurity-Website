"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import BinaryStarfield from "@/components/BinaryStarfield";
import { useTypingPlaceholder } from "@/components/useTypingPlaceholder";

const PHONE_SAMPLES = ["+91 xxxxxxxxxx"];
const EMAIL_SAMPLES = ["xxxxx", "your.name", "partnerships"];
const DOMAIN_SAMPLES = ["@gmail.com", "@yahoo.com", "@outlook.com", "@proton.me", "@zoho.com"];
const MESSAGE_SAMPLES = [
  "We would like to know what the gold tier includes and how many students we can reach...",
  "Our company hires security engineers — can we run a session at the event?",
  "Please share the sponsorship deck and payment timeline for this edition.",
];

export default function SponsorInquiryPage() {
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [emailUser, setEmailUser] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const phonePlaceholder = useTypingPlaceholder(PHONE_SAMPLES, 110);
  const emailPlaceholder = useTypingPlaceholder(EMAIL_SAMPLES, 100);
  const domainPlaceholder = useTypingPlaceholder(DOMAIN_SAMPLES, 95);
  const messagePlaceholder = useTypingPlaceholder(MESSAGE_SAMPLES, 45, 30);

  const inputClass =
    "w-full rounded-none border border-cyber-blue/25 bg-cyber-black px-3.5 py-3 font-terminal text-sm text-white placeholder:text-cyber-gray/40 focus:border-cyber-tan focus:outline-none transition-colors";

  const ready =
    company.trim().length > 1 &&
    phone.trim().length >= 8 &&
    emailUser.trim().length > 1 &&
    emailDomain.trim().length > 3 &&
    name.trim().length > 1 &&
    message.trim().length > 5;

  return (
    <main className="relative min-h-screen overflow-hidden bg-cyber-black px-4 py-14 md:py-20">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 ambient-glow" />
      <BinaryStarfield />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 cyber-grid opacity-60" />

      <div className="relative mx-auto w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="font-mono text-[11px] font-bold tracking-[0.4em] text-cyber-tan uppercase">
            // HACKURITY 2026 — POWERED BY IBM // PARTNERSHIP DESK
          </div>
          <h1 className="mt-3 font-heading text-lg leading-tight text-white uppercase md:text-2xl">
            Sponsorship Enquiry
          </h1>
          <p className="mx-auto mt-4 max-w-lg font-mono text-[12px] leading-relaxed text-cyber-gray md:text-xs">
            Tell us a little about your organisation and what you would like to know. Our team replies
            to every enquiry, usually within two working days.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative border border-cyber-blue/30 bg-cyber-dark/85 shadow-[0_0_40px_rgba(99,102,241,0.18)]"
        >
          <span className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-cyber-tan" />
          <span className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-cyber-tan" />
          <span className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-cyber-tan" />
          <span className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-cyber-tan" />

          <div className="flex items-center justify-between border-b border-cyber-blue/15 px-5 py-3 font-mono text-[10px] tracking-widest">
            <span className="text-cyber-tan">ENQUIRY_FORM_01</span>
            <span className="flex items-center gap-1.5 text-cyber-blue">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyber-blue" />
              CHANNEL OPEN
            </span>
          </div>

          {sent ? (
            <div className="p-8 text-center">
              <h2 className="font-heading text-sm text-white uppercase">Enquiry sent</h2>
              <p className="mt-3 font-mono text-xs leading-relaxed text-cyber-gray">
                Thanks {name.split(" ")[0] || "there"} — we have your details and will get back to you
                shortly. (Hook this form up to your backend to receive live submissions.)
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 border border-cyber-blue/40 bg-cyber-blue/10 px-4 py-2 font-mono text-[11px] tracking-widest text-cyber-blue hover:bg-cyber-blue/20"
              >
                [ SEND_ANOTHER ]
              </button>
            </div>
          ) : (
            <form
              className="space-y-5 p-5 md:p-7"
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
            >
              <label className="block space-y-1.5">
                <span className="font-mono text-[11px] font-bold tracking-wider text-cyber-blue">
                  --company-name
                </span>
                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder="Your organisation"
                  className={inputClass}
                />
              </label>

              <label className="block space-y-1.5">
                <span className="font-mono text-[11px] font-bold tracking-wider text-cyber-blue">
                  --phone-number
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder={phonePlaceholder || " "}
                  className={inputClass}
                />
              </label>

              <div className="space-y-1.5">
                <span className="font-mono text-[11px] font-bold tracking-wider text-cyber-blue">
                  --email
                </span>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                  <input
                    value={emailUser}
                    onChange={(event) => setEmailUser(event.target.value)}
                    placeholder={emailPlaceholder || " "}
                    className={`${inputClass} sm:flex-1`}
                    aria-label="Email name"
                  />
                  <input
                    value={emailDomain}
                    onChange={(event) => setEmailDomain(event.target.value)}
                    placeholder={domainPlaceholder || " "}
                    className={`${inputClass} sm:w-48 sm:border-l-0 text-cyber-tan`}
                    aria-label="Email domain"
                  />
                </div>
                <p className="font-mono text-[10px] tracking-wider text-cyber-gray/50">
                  Full address: {emailUser || "—"}
                  {emailDomain}
                </p>
              </div>

              <label className="block space-y-1.5">
                <span className="font-mono text-[11px] font-bold tracking-wider text-cyber-blue">
                  --your-name
                </span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="First and last name"
                  className={inputClass}
                />
              </label>

              <label className="block space-y-1.5">
                <span className="font-mono text-[11px] font-bold tracking-wider text-cyber-blue">
                  --your-enquiry
                </span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={7}
                  placeholder={messagePlaceholder || " "}
                  className={`${inputClass} min-h-[170px] resize-y leading-relaxed`}
                />
              </label>

              <motion.button
                type="submit"
                disabled={!ready}
                whileHover={ready ? { scale: 1.01 } : {}}
                whileTap={ready ? { scale: 0.98 } : {}}
                className="relative w-full overflow-hidden border border-cyber-tan/50 bg-cyber-tan/10 px-5 py-3.5 font-mono text-[12px] font-bold tracking-[0.2em] text-cyber-tan uppercase transition-colors hover:bg-cyber-tan/20 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {ready && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    animate={{ x: ["0%", "420%"] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <span className="relative">[ SEND_ENQUIRY ]</span>
              </motion.button>
            </form>
          )}
        </motion.div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="font-mono text-[11px] tracking-widest text-cyber-gray uppercase transition-colors hover:text-cyber-tan"
          >
            ← back to hackurity
          </a>
        </div>
      </div>
    </main>
  );
}

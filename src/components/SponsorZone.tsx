"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitSponsorApplication } from "@/lib/submissions";

// Replace this with the real brochure PDF link when it is ready.
export const SPONSOR_BROCHURE_URL = "/documents/hackurity-sponsorship-brochure.pdf";

const TIERS = [
  { name: "BRONZE TIER", note: "Entry partner", ring: "border-[#cd7f32]/70", text: "text-[#e2a06a]", glow: "rgba(205,127,50,0.45)", bg: "bg-[#cd7f32]/10", benefit: "Community visibility" },
  { name: "SILVER TIER", note: "Supporting partner", ring: "border-[#c0c0c0]/70", text: "text-[#dcdcdc]", glow: "rgba(192,192,192,0.45)", bg: "bg-[#c0c0c0]/10", benefit: "Campus engagement" },
  { name: "GOLD TIER", note: "Featured partner", ring: "border-[#d4af37]/75", text: "text-[#e8c451]", glow: "rgba(212,175,55,0.5)", bg: "bg-[#d4af37]/10", benefit: "Stage & brand presence" },
  { name: "PLATINUM TIER", note: "Title partner", ring: "border-[#a7c7e7]/75", text: "text-[#dbe9f7]", glow: "rgba(167,199,231,0.5)", bg: "bg-[#a7c7e7]/10", benefit: "Premier partnership" },
];

export default function SponsorZone() {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [sponsorFormOpen, setSponsorFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pastSponsors, setPastSponsors] = useState("");
  const [tier, setTier] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSponsorSubmit = async () => {
    setSubmitError("");
    setSubmitting(true);
    try {
      await submitSponsorApplication({ email, phone, pastSponsors, tier });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-none border border-cyber-blue/25 bg-cyber-black px-3 py-2.5 font-terminal text-xs text-white placeholder:text-cyber-gray/40 focus:border-cyber-blue focus:outline-none";
  const formReady = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && phone.trim().length >= 8 && tier;

  return (
    <>
      {/* Sponsor call to action */}
      <div className="flex flex-col gap-4">
        <motion.button
          type="button"
          onClick={() => setOptionsOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            boxShadow: [
              "0 0 0 rgba(99,102,241,0)",
              "0 0 26px rgba(99,102,241,0.55)",
              "0 0 18px rgba(217,70,239,0.4)",
              "0 0 0 rgba(99,102,241,0)",
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="group relative w-full overflow-hidden border border-cyber-blue/60 bg-cyber-blue/10 px-6 py-4 font-mono text-xs font-bold tracking-[0.2em] text-white uppercase transition-colors hover:bg-cyber-blue/20 md:w-fit md:text-sm"
        >
          <motion.span
            aria-hidden="true"
            className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            animate={{ x: ["0%", "420%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
          />
          <span className="relative">Explore Sponsorship</span>
        </motion.button>
        <p className="font-mono text-[9px] tracking-widest text-cyber-blue/50 uppercase">
          Brochure // enquiry // partnership tiers
        </p>
      </div>

      {/* Options popup */}
      <AnimatePresence>
        {optionsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setOptionsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-black/85 p-4 backdrop-blur-sm"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Sponsorship options"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16 }}
              onMouseDown={(event) => event.stopPropagation()}
              className="w-full max-w-2xl border border-cyber-blue/40 bg-cyber-dark p-6 shadow-[0_0_35px_rgba(99,102,241,0.3)] md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-[9px] font-bold tracking-widest text-cyber-blue">
                    // PARTNERSHIP CHANNEL
                  </div>
                  <h3 className="mt-2 font-heading text-base leading-relaxed text-white uppercase md:text-lg">Partner with Hackurity 2026</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOptionsOpen(false)}
                  aria-label="Close sponsorship options"
                  className="border border-cyber-blue/25 px-2 py-1 font-mono text-xs text-cyber-gray hover:border-cyber-blue hover:text-cyber-blue"
                >
                  [ X ]
                </button>
              </div>

              <p className="mt-4 max-w-xl font-mono text-sm leading-relaxed text-cyber-gray">
                Discover the partnership deck, ask a question, or choose a tier to begin a conversation with our team.
              </p>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <a
                  href= "https://drive.google.com/file/d/1SJcJpz-M5R4wPFpblXslNkSZS_JIQPre/view?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-h-28 flex-col justify-between border border-cyber-tan/35 bg-cyber-tan/5 p-4 font-mono text-xs font-bold tracking-widest text-cyber-tan uppercase transition-all hover:-translate-y-1 hover:bg-cyber-tan/15"
                >
                  <span>View brochure</span>
                  <span className="text-cyber-tan/60 group-hover:text-cyber-tan">PDF ↗</span>
                </a>

                <a
                  href="/sponsor-inquiry"
                  className="group flex min-h-28 flex-col justify-between border border-cyber-blue/35 bg-cyber-blue/5 p-4 font-mono text-xs font-bold tracking-widest text-cyber-blue uppercase transition-all hover:-translate-y-1 hover:bg-cyber-blue/15"
                >
                  <span>Inquire about sponsorship</span>
                  <span className="text-cyber-blue/60 group-hover:text-cyber-blue">OPEN FORM ↗</span>
                </a>

                <motion.button
                  type="button"
                  onClick={() => {
                    setOptionsOpen(false);
                    setSubmitted(false);
                    setSubmitError("");
                    setSponsorFormOpen(true);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  animate={{
                    boxShadow: [
                      "0 0 6px rgba(217,70,239,0.25)",
                      "0 0 26px rgba(217,70,239,0.6)",
                      "0 0 6px rgba(99,102,241,0.3)",
                    ],
                  }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="relative flex min-h-28 flex-col items-start justify-between overflow-hidden border border-fuchsia-400/50 bg-gradient-to-br from-cyber-blue/25 via-fuchsia-500/20 to-cyber-tan/20 p-4 font-mono text-xs font-bold tracking-widest text-white uppercase"
                >
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                    animate={{ x: ["0%", "420%"] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="relative">Select a tier</span><span className="relative text-white/70">Start here →</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sponsor now form */}
      <AnimatePresence>
        {sponsorFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setSponsorFormOpen(false)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-cyber-black/85 backdrop-blur-sm md:items-center md:p-6"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Sponsorship application"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onMouseDown={(event) => event.stopPropagation()}
              className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden border border-cyber-blue/40 bg-cyber-black shadow-[0_0_35px_rgba(99,102,241,0.28)]"
            >
              <div className="flex items-start justify-between gap-4 border-b border-cyber-blue/15 bg-cyber-dark/80 px-5 py-4">
                <div>
                  <div className="font-mono text-[9px] font-bold tracking-widest text-cyber-blue">
                    // HACKURITY // SPONSOR REGISTRY
                  </div>
                  <h3 className="mt-2 font-heading text-base leading-relaxed text-white uppercase md:text-lg">Choose your partnership tier</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSponsorFormOpen(false)}
                  aria-label="Close sponsorship application"
                  className="border border-cyber-blue/25 px-2 py-1 font-mono text-xs text-cyber-gray hover:border-cyber-blue hover:text-cyber-blue"
                >
                  [ X ]
                </button>
              </div>

              <div className="overflow-y-auto p-5 md:p-6">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border border-cyber-blue/40 bg-cyber-blue/5 p-6 text-center"
                  >
                    <h4 className="font-heading text-sm text-white uppercase">Request received</h4>
                    <p className="mt-3 font-mono text-xs leading-relaxed text-cyber-gray">
                      Thanks for your interest. Our partnerships team will reach out shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSponsorFormOpen(false)}
                      className="mt-5 border border-cyber-blue/40 bg-cyber-blue/10 px-4 py-2 font-mono text-[10px] tracking-widest text-cyber-blue hover:bg-cyber-blue/20"
                    >
                      [ CLOSE ]
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-5">
                    <p className="font-mono text-sm leading-relaxed text-cyber-gray">
                      Select the partnership level that fits your goals. You can refine the package with our team after submitting your interest.
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-1.5">
                        <span className="font-mono text-[10px] font-bold text-cyber-blue">--email</span>
                        <input
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="partnerships@company.com"
                          className={inputClass}
                        />
                      </label>
                      <label className="space-y-1.5">
                        <span className="font-mono text-[10px] font-bold text-cyber-blue">--phone</span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          placeholder="+91 xxxxxxxxxx"
                          className={inputClass}
                        />
                      </label>
                    </div>

                    <label className="block space-y-1.5">
                      <span className="font-mono text-[10px] font-bold text-cyber-blue">
                        --previous-or-current-sponsorships (optional)
                      </span>
                      <textarea
                        value={pastSponsors}
                        onChange={(event) => setPastSponsors(event.target.value)}
                        rows={3}
                        placeholder="Events or programmes your organisation currently supports..."
                        className={`${inputClass} resize-y`}
                      />
                    </label>

                    <div>
                      <div className="mb-2 font-mono text-[10px] font-bold text-cyber-blue">
                        --sponsorship-tier
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {TIERS.map((option, index) => {
                          const selected = tier === option.name;
                          return (
                            <motion.button
                              key={option.name}
                              type="button"
                              onClick={() => setTier(option.name)}
                              whileHover={{ y: -4, scale: 1.015 }}
                              whileTap={{ scale: 0.98 }}
                              animate={
                                selected
                                  ? { boxShadow: [`0 0 5px ${option.glow}`, `0 0 28px ${option.glow}`, `0 0 10px ${option.glow}`], borderColor: [option.glow, "rgba(255,255,255,0.78)", option.glow] }
                                  : { boxShadow: "0 0 0 rgba(0,0,0,0)" }
                              }
                              transition={{ duration: 1.7, repeat: Infinity }}
                              className={`group relative flex min-h-28 flex-col items-start justify-between overflow-hidden border p-4 text-left font-mono tracking-widest uppercase transition-colors ${option.ring} ${
                                selected ? option.bg : "bg-cyber-dark/60 hover:bg-white/[0.035]"
                              } ${option.text}`}
                            >
                              <span className="absolute right-3 top-3 font-heading text-2xl opacity-15">0{index + 1}</span>
                              <span className="relative text-xs font-bold">{option.name}</span>
                              <span className="relative text-[10px] normal-case text-cyber-gray">{option.note} · {option.benefit}</span>
                              {selected && <motion.span layoutId="tier-selected" className="absolute inset-x-0 bottom-0 h-1 bg-current" />}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {submitError && (
                      <p className="font-mono text-[10px] tracking-wider text-red-400">{submitError}</p>
                    )}

                    <button
                      type="button"
                      disabled={!formReady || submitting}
                      onClick={handleSponsorSubmit}
                      className="w-full border border-cyber-blue/50 bg-cyber-blue/10 px-4 py-3 font-mono text-[11px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-cyber-blue/20 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      {submitting ? "[ SUBMITTING... ]" : "[ SUBMIT_SPONSORSHIP_REQUEST ]"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

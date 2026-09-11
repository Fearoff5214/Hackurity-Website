"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Replace this with the real brochure PDF link when it is ready.
export const SPONSOR_BROCHURE_URL = "/documents/hackurity-sponsorship-brochure.pdf";

export default function SponsorZone() {
  const [optionsOpen, setOptionsOpen] = useState(false);

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
        <p className="font-mono text-[12px] tracking-widest text-cyber-blue/50 uppercase">
          Brochure // enquiry
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
              className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto border border-cyber-blue/40 bg-cyber-dark p-6 shadow-[0_0_35px_rgba(99,102,241,0.3)] md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-[12px] font-bold tracking-widest text-cyber-blue">
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
                Discover the partnership deck, or reach out to begin a conversation with our team.
              </p>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

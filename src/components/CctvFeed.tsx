"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Venue camera panel.
 * The feed starts blurred at 67% opacity behind an access gate. Entering an
 * email address unlocks it (verification will be wired to the auth backend
 * later — no password is collected yet).
 */
export default function CctvFeed() {
  const [unlocked, setUnlocked] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [email, setEmail] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="relative h-full w-full select-none bg-cyber-black">
      {/* Frame corners */}
      <div className="pointer-events-none absolute inset-0 z-30 border border-cyber-blue/25">
        <span className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-cyber-tan" />
        <span className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-cyber-tan" />
        <span className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-cyber-tan" />
        <span className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-cyber-tan" />
      </div>

      {/* The feed itself (currently a still image; swap for the live venue stream later) */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: "url('/images/quantum_server_room.png')",
          filter: unlocked
            ? "hue-rotate(130deg) saturate(1.8) contrast(1.05)"
            : "hue-rotate(130deg) saturate(1.6) blur(7px)",
          opacity: unlocked ? 1 : 0.67,
        }}
      />

      {/* Feed HUD */}
      <div className="absolute left-4 top-4 z-20 border border-cyber-tan/25 bg-cyber-black/80 p-3 font-mono text-[11px] tracking-wider text-cyber-tan">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyber-tan" />
          <span>CCTV_FEED // VENUE CAMERA 01</span>
        </div>
        <div className="mt-1 text-cyber-gray">SIGNAL: {unlocked ? "DECRYPTED" : "SCRAMBLED"}</div>
        <div className="text-cyber-gray">ACCESS: {unlocked ? "GRANTED" : "RESTRICTED"}</div>
      </div>

      <div className="absolute right-4 top-4 z-20 flex flex-col items-end font-heading text-lg text-cyber-tan md:text-xl">
        <span className="font-bold tracking-widest">NO-45</span>
        <span className="mt-1 font-mono text-[10px] tracking-wider text-cyber-gray">ACTIVE CAMERA UNIT</span>
      </div>

      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 border border-red-500/30 bg-cyber-black/85 px-3 py-1.5 font-mono text-[11px] tracking-wider text-red-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
        <span>CAM_01 [REC]</span>
      </div>

      {/* Access gate covering the whole panel */}
      {!unlocked && (
        <button
          type="button"
          onClick={() => setAskOpen(true)}
          className="group absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-center gap-3 bg-cyber-black/35 backdrop-blur-[2px] transition-colors hover:bg-cyber-black/25"
          aria-label="Request access to the CCTV feed"
        >
          <motion.span
            animate={{ boxShadow: ["0 0 0 rgba(210,180,140,0)", "0 0 22px rgba(210,180,140,0.45)", "0 0 0 rgba(210,180,140,0)"] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="border border-cyber-tan/60 bg-cyber-tan/10 px-5 py-3 font-mono text-[12px] tracking-widest text-cyber-tan uppercase md:text-xs"
          >
            [ ACCESS CCTV_FEED ? ]
          </motion.span>
          <span className="font-mono text-[10px] tracking-widest text-cyber-gray">
            EMAIL VERIFICATION REQUIRED TO UNSCRAMBLE THE STREAM
          </span>
        </button>
      )}

      {/* Email prompt */}
      <AnimatePresence>
        {askOpen && !unlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-cyber-black/80 p-4"
            onMouseDown={() => setAskOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              onMouseDown={(event) => event.stopPropagation()}
              className="w-full max-w-sm border border-cyber-tan/40 bg-cyber-dark p-5 shadow-[0_0_30px_rgba(99,102,241,0.25)]"
            >
              <div className="font-mono text-[10px] font-bold tracking-widest text-cyber-tan">
                // CAMERA ACCESS REQUEST
              </div>
              <h3 className="mt-2 font-heading text-sm text-white uppercase">Verify your email</h3>
              <p className="mt-2 font-mono text-[12px] leading-relaxed text-cyber-gray">
                Enter your email to unlock the venue camera. No password needed for now.
              </p>
              <input
                type="email"
                value={email}
                autoFocus
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@gmail.com"
                className="mt-4 w-full rounded-none border border-cyber-tan/30 bg-cyber-black px-3 py-2.5 font-mono text-xs text-white placeholder:text-cyber-gray/40 focus:border-cyber-tan focus:outline-none"
              />
              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setAskOpen(false)}
                  className="border border-cyber-blue/20 px-3 py-2 font-mono text-[11px] tracking-widest text-cyber-gray transition-colors hover:border-cyber-blue"
                >
                  [ CANCEL ]
                </button>
                <button
                  type="button"
                  disabled={!emailValid}
                  onClick={() => {
                    setUnlocked(true);
                    setAskOpen(false);
                  }}
                  className="border border-cyber-tan/50 bg-cyber-tan/10 px-3 py-2 font-mono text-[11px] tracking-widest text-cyber-tan transition-colors hover:bg-cyber-tan/20 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  [ UNLOCK_FEED ]
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

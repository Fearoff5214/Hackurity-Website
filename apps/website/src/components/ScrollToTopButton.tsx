"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const lenis = useLenis((instance) => {
    setVisible(instance.scroll > 400);
  });

  const scrollToTop = () => {
    if (lenis) {
      // force: true — a deliberate "take me to the top" click should always
      // win, regardless of any transient internal scroll state.
      lenis.scrollTo(0, { duration: 1.2, force: true });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center border border-cyber-tan/40 bg-cyber-black/80 font-mono text-cyber-tan backdrop-blur-md transition-colors hover:border-cyber-tan hover:text-white"
        >
          <span className="pointer-events-none absolute left-0 top-0 h-2.5 w-2.5 border-l-2 border-t-2 border-cyber-tan" />
          <span className="pointer-events-none absolute right-0 top-0 h-2.5 w-2.5 border-r-2 border-t-2 border-cyber-tan" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-2.5 w-2.5 border-b-2 border-l-2 border-cyber-tan" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-2.5 w-2.5 border-b-2 border-r-2 border-cyber-tan" />
          <span aria-hidden="true">&#9650;</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

// Drives a "pinned readout beside a scrolling row list" effect from real,
// current DOM measurements — each row's bounding rect against a probe line
// at `probeRatio` of the viewport — instead of Framer Motion's
// `useScroll({ offset: [...] })`, which assumes the scroll distance the
// browser gives that offset band matches the row list's actual height. That
// assumption only holds by coincidence: it drifts out of sync (the readout
// races ahead of, or falls behind, whatever row is actually on screen)
// whenever the section is short or just doesn't scroll at exactly the
// guessed rate. Measuring directly off the DOM every scroll tick can't drift.
export function useRowScrollProgress(listRef: RefObject<HTMLElement | null>, rowCount: number, probeRatio = 0.4) {
  const progress = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl || rowCount === 0) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = listEl.getBoundingClientRect();
      const probeY = window.innerHeight * probeRatio;
      const raw = rect.height > 0 ? (probeY - rect.top) / rect.height : 0;
      progress.set(Math.min(1, Math.max(0, raw)));

      const rows = Array.from(listEl.children) as HTMLElement[];
      let next = 0;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].getBoundingClientRect().top <= probeY) next = i;
      }
      if (activeIndexRef.current !== next) {
        activeIndexRef.current = next;
        setActiveIndex(next);
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listRef, rowCount, probeRatio]);

  return { progress, activeIndex } as { progress: MotionValue<number>; activeIndex: number };
}

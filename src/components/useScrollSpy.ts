"use client";

import { useEffect, useState } from "react";

export type ScrollSpySection = { name: string; href: string };

// Shared rAF-throttled scroll listener that reports which section is
// currently "active" — the one whose top has scrolled past 30% of the
// viewport. Used by both SiteNav (top bar highlight) and SideDotNav (rail
// highlight) so they agree on the active section without each mounting
// their own scroll listener.
export function useScrollSpy(sections: ScrollSpySection[], initial: string) {
  const [currentSection, setCurrentSection] = useState(initial);

  useEffect(() => {
    const resolved = sections
      .filter((link) => link.href.startsWith("#"))
      .map((link) => {
        const el = document.querySelector(link.href);
        return el instanceof HTMLElement ? { name: link.name, el } : null;
      })
      .filter((entry): entry is { name: string; el: HTMLElement } => entry !== null);

    if (resolved.length === 0) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const probe = y + window.innerHeight * 0.3;
      let nextName = resolved[0].name;
      for (const section of resolved) {
        if (section.el.getBoundingClientRect().top + y - 1 <= probe) nextName = section.name;
      }
      setCurrentSection((prev) => (prev === nextName ? prev : nextName));
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
  }, []);

  return [currentSection, setCurrentSection] as const;
}

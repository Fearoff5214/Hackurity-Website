"use client";

import { useEffect, useState } from "react";

/**
 * Loops through a list of sample strings, typing and deleting them one
 * character at a time. Used for animated input placeholders.
 */
export function useTypingPlaceholder(samples: string[], speed = 90, holdTicks = 9) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (samples.length === 0) return;
    let sampleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let hold = 0;

    const id = window.setInterval(() => {
      const sample = samples[sampleIndex];
      if (hold > 0) {
        hold -= 1;
        return;
      }
      charIndex += deleting ? -1 : 1;
      setText(sample.slice(0, charIndex));
      if (!deleting && charIndex === sample.length) {
        hold = holdTicks;
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        sampleIndex = (sampleIndex + 1) % samples.length;
      }
    }, speed);

    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [samples.join("|"), speed, holdTicks]);

  return text;
}

"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

// Smooth/inertial scroll for the Hackurity page only — mounted inside
// page.tsx's own tree so it activates just for that route and tears down
// (native scroll resumes) when navigating to /about-us or /sponsor-inquiry,
// which share the root layout but are a separate identity from Hackurity.
export default function HackurityLenis({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.12,
        duration: 1.1,
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}

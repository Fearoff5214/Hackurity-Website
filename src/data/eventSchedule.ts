export type EventScheduleItem = {
  id: string;
  title: string;
  window: string;
  brief: string;
  start: string;
  end: string;
};

// This is the single source of truth for both the timeline and the live activity panel.
// Replace these dates/times when the final 2026 schedule is confirmed.
export const EVENT_SCHEDULE: EventScheduleItem[] = [
  { id: "G-01", title: "NODE REGISTRATION", window: "15 SEP — 05 OCT", brief: "Team dossiers open. Payload identities compiled and queued for handshake.", start: "2026-09-15T09:00:00+05:30", end: "2026-10-05T23:59:59+05:30" },
  { id: "G-02", title: "WORKSHOP UPLINK", window: "08 — 12 OCT", brief: "Tooling calibration and threat-modelling drills pushed to all connected nodes.", start: "2026-10-08T10:00:00+05:30", end: "2026-10-12T18:00:00+05:30" },
  { id: "G-03", title: "PROBLEM STATEMENTS", window: "16 OCT // 09:00", brief: "Classified briefs decrypted. Two statements per operational track released.", start: "2026-10-16T09:00:00+05:30", end: "2026-10-16T09:30:00+05:30" },
  { id: "G-04", title: "HACKATHON WINDOW OPENS", window: "16 OCT // 09:00", brief: "24-hour infiltration clock initialises. All conduits go live simultaneously.", start: "2026-10-16T09:00:00+05:30", end: "2026-10-17T09:00:00+05:30" },
  { id: "G-05", title: "MENTOR CHANNELS", window: "16 OCT // 10:00 — 17 OCT // 06:00", brief: "Rotating advisor sessions. Encrypted guidance relayed on request.", start: "2026-10-16T10:00:00+05:30", end: "2026-10-17T06:00:00+05:30" },
  { id: "G-06", title: "PROJECT/SOLUTIONS SUBMISSION", window: "17 OCT // 10:30", brief: "Artefacts locked, hashed and sealed. No further commits accepted.", start: "2026-10-17T10:30:00+05:30", end: "2026-10-17T12:30:00+05:30" },
  { id: "G-07", title: "PROJECT DEMONSTRATION", window: "17 OCT // 13:00", brief: "Live defence of exploit logic before the evaluation panel.", start: "2026-10-17T13:00:00+05:30", end: "2026-10-17T17:30:00+05:30" },
  { id: "G-08", title: "PRIZE DISTRIBUTION", window: "17 OCT // 18:00", brief: "Secured vault unlocked. Top attacking nodes are decorated.", start: "2026-10-17T18:00:00+05:30", end: "2026-10-17T20:00:00+05:30" },
];

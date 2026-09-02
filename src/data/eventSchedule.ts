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
  { id: "G-01", title: "NODE REGISTRATION", window: "22 SEP — 12 OCT", brief: "Team dossiers open. Payload identities compiled and queued for handshake.", start: "2026-09-22T09:00:00+05:30", end: "2026-10-12T23:59:59+05:30" },
  { id: "G-02", title: "PROBLEM STATEMENTS", window: "08 OCT // 09:00", brief: "Classified briefs decrypted. Two statements per operational track released one week ahead.", start: "2026-10-08T09:00:00+05:30", end: "2026-10-08T09:30:00+05:30" },
  { id: "G-03", title: "HACKATHON WINDOW OPENS", window: "15 OCT // 09:00", brief: "24-hour infiltration clock initialises. All conduits go live simultaneously.", start: "2026-10-15T09:00:00+05:30", end: "2026-10-16T09:00:00+05:30" },
  { id: "G-04", title: "HELP DESK CHANNELS", window: "15 OCT // 10:00 — 16 OCT // 06:00", brief: "Rotating support sessions. Guidance relayed to teams on request.", start: "2026-10-15T10:00:00+05:30", end: "2026-10-16T06:00:00+05:30" },
  { id: "G-05", title: "PROJECT/SOLUTIONS SUBMISSION", window: "16 OCT // 10:30", brief: "Artefacts locked, hashed and sealed. No further commits accepted.", start: "2026-10-16T10:30:00+05:30", end: "2026-10-16T12:30:00+05:30" },
  { id: "G-06", title: "PROJECT DEMONSTRATION", window: "16 OCT // 13:00", brief: "Live defence of exploit logic before the evaluation panel.", start: "2026-10-16T13:00:00+05:30", end: "2026-10-16T17:30:00+05:30" },
  { id: "G-07", title: "PRIZE DISTRIBUTION", window: "16 OCT // 18:00", brief: "Secured vault unlocked. Top attacking nodes are decorated.", start: "2026-10-16T18:00:00+05:30", end: "2026-10-16T20:00:00+05:30" },
];

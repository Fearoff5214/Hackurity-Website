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
  { id: "G-01", title: "NODE REGISTRATION", window: "05 JAN — 02 FEB", brief: "Team dossiers open. Payload identities compiled and queued for handshake.", start: "2026-01-05T09:00:00+05:30", end: "2026-02-02T23:59:59+05:30" },
  { id: "G-02", title: "PROBLEM STATEMENTS", window: "06 FEB // 10:00", brief: "Classified briefs decrypted. Two statements per operational domain released.", start: "2026-02-06T10:00:00+05:30", end: "2026-02-06T18:00:00+05:30" },
  { id: "G-03", title: "WORKSHOP UPLINK", window: "10 — 14 FEB", brief: "Tooling calibration and threat-modelling drills pushed to all connected nodes.", start: "2026-02-10T10:00:00+05:30", end: "2026-02-14T18:00:00+05:30" },
  { id: "G-04", title: "BREACH WINDOW OPENS", window: "20 FEB // 09:00", brief: "48-hour infiltration clock initialises. All conduits go live simultaneously.", start: "2026-02-20T09:00:00+05:30", end: "2026-02-22T09:00:00+05:30" },
  { id: "G-05", title: "MENTOR CHANNELS", window: "20 FEB // 10:00 — 21 FEB // 18:00", brief: "Rotating advisor sessions. Encrypted guidance relayed on request.", start: "2026-02-20T10:00:00+05:30", end: "2026-02-21T18:00:00+05:30" },
  { id: "G-06", title: "PAYLOAD SUBMISSION", window: "22 FEB // 09:00", brief: "Artefacts locked, hashed and sealed. No further commits accepted.", start: "2026-02-22T09:00:00+05:30", end: "2026-02-22T12:30:00+05:30" },
  { id: "G-07", title: "FINAL DEFENCE", window: "22 FEB // 13:00", brief: "Live defence of exploit logic before the evaluation panel.", start: "2026-02-22T13:00:00+05:30", end: "2026-02-22T17:30:00+05:30" },
  { id: "G-08", title: "RECOGNITION PROTOCOL", window: "22 FEB // 18:00", brief: "Secured vault unlocked. Top attacking nodes are decorated.", start: "2026-02-22T18:00:00+05:30", end: "2026-02-22T20:00:00+05:30" },
];

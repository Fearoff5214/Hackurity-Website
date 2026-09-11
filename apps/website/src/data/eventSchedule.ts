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
  { id: "G-01", title: "REGISTRATIONS OPEN", window: "09 SEP // 09:00", brief: "The hunt begins. Register your team and enter the cybersecurity challenge.", start: "2026-09-09T09:00:00+05:30", end: "2026-09-09T09:30:00+05:30" },
  { id: "G-02", title: "VERIFY & CONFIRM", window: "09 SEP — 03 OCT", brief: "Complete the payment and required details. Our team verifies your registration and confirms your participation.", start: "2026-09-09T09:00:00+05:30", end: "2026-10-03T23:59:59+05:30" },
  { id: "G-03", title: "REGISTRATIONS CLOSE", window: "03 OCT // 23:59", brief: "The gates are locked. Final participant verification begins.", start: "2026-10-03T23:00:00+05:30", end: "2026-10-03T23:59:59+05:30" },
  { id: "G-04", title: "PROBLEM STATEMENTS DROP", window: "04 OCT // 09:00", brief: "The challenges are revealed. Explore the tracks. Analyse the problems. Find your challenge.", start: "2026-10-04T09:00:00+05:30", end: "2026-10-04T09:30:00+05:30" },
  { id: "G-05", title: "CHOOSE YOUR TRACK", window: "04 OCT — 10 OCT", brief: "Choose your battlefield. Discuss with your team, select your preferred track and submit your choice.", start: "2026-10-04T09:30:00+05:30", end: "2026-10-10T23:59:59+05:30" },
  { id: "G-06", title: "TRACKS LOCKED", window: "10 OCT // 23:59", brief: "Teams and tracks are finalized after verification.", start: "2026-10-10T23:00:00+05:30", end: "2026-10-10T23:59:59+05:30" },
  { id: "G-07", title: "FINAL CONFIRMATION", window: "11 OCT — 13 OCT", brief: "You're officially in. Team leads receive the final confirmation and hackathon invitation with all event details.", start: "2026-10-11T00:00:00+05:30", end: "2026-10-13T23:59:59+05:30" },
  { id: "G-08", title: "THE 24-HOUR HACKATHON", window: "14 OCT — 15 OCT", brief: "24 hours. One challenge. Build something extraordinary.", start: "2026-10-14T09:30:00+05:30", end: "2026-10-15T09:00:00+05:30" },
  { id: "G-09", title: "JURY EVALUATION", window: "15 OCT // 09:00 — 10:30", brief: "Innovation, security, technology, impact — projects evaluated by the judging panel.", start: "2026-10-15T09:00:00+05:30", end: "2026-10-15T10:30:00+05:30" },
  { id: "G-10", title: "FINALIST SHOWCASE", window: "15 OCT // 10:30 — 11:00", brief: "Pitch. Demo. Defend. Finalists present live before the panel.", start: "2026-10-15T10:30:00+05:30", end: "2026-10-15T11:00:00+05:30" },
  { id: "G-11", title: "RESULTS & PRIZE DISTRIBUTION", window: "15 OCT // 11:00 — 11:30", brief: "The moment you've been hacking for. Winners announced and prizes distributed.", start: "2026-10-15T11:00:00+05:30", end: "2026-10-15T11:30:00+05:30" },
  { id: "G-12", title: "CLOSING CEREMONY", window: "15 OCT // 11:30 — 12:00", brief: "Celebrate the hackers, builders, mentors, judges and everyone who made it happen.", start: "2026-10-15T11:30:00+05:30", end: "2026-10-15T12:00:00+05:30" },
];

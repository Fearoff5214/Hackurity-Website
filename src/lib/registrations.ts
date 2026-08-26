import { getAdminFirestore } from "@/lib/firebaseAdmin";

export type MemberRecord = {
  name: string;
  email: string;
  role: string;
  portfolio: string;
};

export type RegistrationRecord = {
  id: string;
  teamName: string;
  teamSize: string;
  university: string;
  selectedDomain: string;
  experienceLevel: string;
  members: MemberRecord[];
  projectIdea: string;
  acceptedTerms: boolean;
  acceptedConduct: boolean;
  createdAt: string | null;
};

export async function listRegistrations(): Promise<RegistrationRecord[]> {
  const db = getAdminFirestore();
  const snapshot = await db.collection("registrations").orderBy("createdAt", "desc").get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const createdAt = data.createdAt?.toDate?.() as Date | undefined;
    return {
      id: doc.id,
      teamName: data.teamName ?? "",
      teamSize: data.teamSize ?? "",
      university: data.university ?? "",
      selectedDomain: data.selectedDomain ?? "",
      experienceLevel: data.experienceLevel ?? "",
      members: Array.isArray(data.members) ? data.members : [],
      projectIdea: data.projectIdea ?? "",
      acceptedTerms: Boolean(data.acceptedTerms),
      acceptedConduct: Boolean(data.acceptedConduct),
      createdAt: createdAt ? createdAt.toISOString() : null,
    };
  });
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function registrationsToCsv(records: RegistrationRecord[]): string {
  const maxMembers = records.reduce((max, r) => Math.max(max, r.members.length), 0) || 4;

  const headers = [
    "createdAt",
    "teamName",
    "teamSize",
    "university",
    "selectedDomain",
    "experienceLevel",
    "projectIdea",
    ...Array.from({ length: maxMembers }, (_, i) => [
      `member${i + 1}Name`,
      `member${i + 1}Email`,
      `member${i + 1}Role`,
      `member${i + 1}Portfolio`,
    ]).flat(),
  ];

  const rows = records.map((r) => {
    const memberCells = Array.from({ length: maxMembers }, (_, i) => {
      const m = r.members[i];
      return [m?.name ?? "", m?.email ?? "", m?.role ?? "", m?.portfolio ?? ""];
    }).flat();

    return [
      r.createdAt ?? "",
      r.teamName,
      r.teamSize,
      r.university,
      r.selectedDomain,
      r.experienceLevel,
      r.projectIdea,
      ...memberCells,
    ];
  });

  const lines = [headers, ...rows].map((row) => row.map(csvEscape).join(","));
  return lines.join("\n");
}

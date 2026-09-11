import { createAdminClient } from "@/utils/supabase/admin";

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
  userEmail: string | null;
};

export async function listRegistrations(): Promise<RegistrationRecord[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    teamName: row.team_name ?? "",
    teamSize: row.team_size != null ? String(row.team_size) : "",
    university: row.university ?? "",
    selectedDomain: row.domain ?? "",
    experienceLevel: row.experience_level ?? "",
    members: Array.isArray(row.members) ? row.members : [],
    projectIdea: row.project_idea ?? "",
    acceptedTerms: Boolean(row.accepted_terms),
    acceptedConduct: Boolean(row.accepted_conduct),
    createdAt: row.created_at ?? null,
    userEmail: row.user_email ?? null,
  }));
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
    "registeredBy",
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
      r.userEmail ?? "",
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

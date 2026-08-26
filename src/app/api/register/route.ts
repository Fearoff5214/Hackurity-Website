import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebaseAdmin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type MemberInput = {
  name: string;
  email: string;
  role: string;
  portfolio: string;
};

type RegisterBody = {
  teamName: string;
  teamSize: string;
  university: string;
  selectedDomain: string;
  experienceLevel: string;
  members: MemberInput[];
  projectIdea: string;
  acceptedTerms: boolean;
  acceptedConduct: boolean;
};

function isMember(value: unknown): value is MemberInput {
  if (typeof value !== "object" || value === null) return false;
  const m = value as Record<string, unknown>;
  return (
    typeof m.name === "string" &&
    typeof m.email === "string" &&
    typeof m.role === "string" &&
    typeof m.portfolio === "string"
  );
}

function validate(body: unknown): { data: RegisterBody } | { error: string } {
  if (typeof body !== "object" || body === null) return { error: "Invalid request body." };
  const b = body as Record<string, unknown>;

  if (typeof b.teamName !== "string" || !b.teamName.trim()) return { error: "Team name is required." };
  if (b.teamSize !== "3" && b.teamSize !== "4") return { error: "Team size must be 3 or 4." };
  if (typeof b.university !== "string" || !b.university.trim()) return { error: "University is required." };
  if (typeof b.selectedDomain !== "string" || !b.selectedDomain) return { error: "Track selection is required." };
  if (typeof b.experienceLevel !== "string" || !b.experienceLevel) return { error: "Experience level is required." };
  if (typeof b.projectIdea !== "string" || !b.projectIdea.trim()) return { error: "Project idea is required." };
  if (b.acceptedTerms !== true) return { error: "Terms & Conditions must be accepted." };
  if (b.acceptedConduct !== true) return { error: "Code of Conduct must be accepted." };

  if (!Array.isArray(b.members) || b.members.length !== Number(b.teamSize) || !b.members.every(isMember)) {
    return { error: "Member details are incomplete." };
  }
  for (const member of b.members as MemberInput[]) {
    if (!member.name.trim()) return { error: "Every member needs a name." };
    if (!EMAIL_RE.test(member.email)) return { error: "Every member needs a valid email." };
    if (!member.role) return { error: "Every member needs a role." };
  }

  return {
    data: {
      teamName: b.teamName.trim(),
      teamSize: b.teamSize,
      university: b.university.trim(),
      selectedDomain: b.selectedDomain,
      experienceLevel: b.experienceLevel,
      members: b.members as MemberInput[],
      projectIdea: b.projectIdea.trim(),
      acceptedTerms: true,
      acceptedConduct: true,
    },
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const result = validate(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const db = getAdminFirestore();
    const docRef = await db.collection("registrations").add({
      ...result.data,
      createdAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (err) {
    console.error("Failed to write registration to Firestore:", err);
    return NextResponse.json({ error: "Could not save registration. Please try again." }, { status: 500 });
  }
}

import { createClient } from "@/utils/supabase/client";

type TeamMember = {
  name: string;
  email: string;
  role: string;
  portfolio: string;
};

type RegistrationPayload = {
  teamName: string;
  teamSize: string;
  university: string;
  domain: string;
  experienceLevel: string;
  members: TeamMember[];
  projectIdea: string;
  acceptedTerms: boolean;
  acceptedConduct: boolean;
};

// Postgres error codes this registration flow specifically anticipates.
const DUPLICATE_ACCOUNT_ERRCODE = "23505"; // unique_violation on registrations_user_id_key
const DUPLICATE_MEMBER_ERRCODE = "HK001"; // custom code raised by prevent_duplicate_registration_emails()

function mapRegistrationError(error: { code?: string | null; message: string }): string {
  if (error.code === DUPLICATE_ACCOUNT_ERRCODE) {
    return "This Google account has already submitted a team registration. Each account can only register one team.";
  }

  if (error.code === DUPLICATE_MEMBER_ERRCODE || error.message?.includes("DUPLICATE_REGISTRATION")) {
    return "One of the emails on this team is already registered on another team. Double check your teammates' emails.";
  }

  return error.message;
}

export async function submitRegistration(payload: RegistrationPayload) {
  const supabase = createClient();

  const { error } = await supabase.from("registrations").insert({
    team_name: payload.teamName,
    team_size: Number(payload.teamSize),
    university: payload.university,
    domain: payload.domain,
    experience_level: payload.experienceLevel,
    members: payload.members,
    project_idea: payload.projectIdea,
    accepted_terms: payload.acceptedTerms,
    accepted_conduct: payload.acceptedConduct,
  });

  if (error) {
    throw new Error(mapRegistrationError(error));
  }
}

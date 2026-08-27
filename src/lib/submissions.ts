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
    throw new Error(error.message);
  }
}

type SponsorInquiryPayload = {
  company: string;
  phone: string;
  email: string;
  name: string;
  message: string;
};

export async function submitSponsorInquiry(payload: SponsorInquiryPayload) {
  const supabase = createClient();

  const { error } = await supabase.from("sponsor_inquiries").insert({
    company: payload.company,
    phone: payload.phone,
    email: payload.email,
    name: payload.name,
    message: payload.message,
  });

  if (error) {
    throw new Error(error.message);
  }
}

type SponsorApplicationPayload = {
  email: string;
  phone: string;
  pastSponsors: string;
  tier: string;
};

export async function submitSponsorApplication(payload: SponsorApplicationPayload) {
  const supabase = createClient();

  const { error } = await supabase.from("sponsor_applications").insert({
    email: payload.email,
    phone: payload.phone,
    past_sponsors: payload.pastSponsors || null,
    tier: payload.tier,
  });

  if (error) {
    throw new Error(error.message);
  }
}

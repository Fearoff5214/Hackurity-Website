-- Run this in the Supabase SQL editor (Project > SQL Editor) for zgfirmebbdbdlmwbwjoi.
-- Creates the table backing the Hackurity team registration form and locks it down
-- so the public anon key can only insert, never read or modify existing rows.

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  team_name text not null,
  team_size int not null,
  university text not null,
  domain text not null,
  experience_level text not null,
  members jsonb not null,
  project_idea text not null,
  accepted_terms boolean not null,
  accepted_conduct boolean not null
);

alter table public.registrations enable row level security;

create policy "Allow public inserts"
  on public.registrations
  for insert
  to anon
  with check (true);

create table if not exists public.sponsor_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company text not null,
  phone text not null,
  email text not null,
  name text not null,
  message text not null
);

alter table public.sponsor_inquiries enable row level security;

create policy "Allow public inserts"
  on public.sponsor_inquiries
  for insert
  to anon
  with check (true);

create table if not exists public.sponsor_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  phone text not null,
  past_sponsors text,
  tier text not null
);

alter table public.sponsor_applications enable row level security;

create policy "Allow public inserts"
  on public.sponsor_applications
  for insert
  to anon
  with check (true);

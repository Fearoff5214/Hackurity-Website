-- Run this in the Supabase SQL editor (Project > SQL Editor) for zgfirmebbdbdlmwbwjoi.
-- Creates the table backing the Hackurity team registration form and locks it down
-- so a signed-in user can only insert a row tied to their own account, never read
-- or modify existing rows. The admin dashboard reads this table server-side with
-- the service role key, which bypasses RLS entirely.

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
  accepted_conduct boolean not null,
  user_id uuid references auth.users(id) default auth.uid(),
  user_email text default (auth.jwt() ->> 'email')
);

-- Existing installs: run these two lines once if the table predates the columns above.
-- alter table public.registrations add column if not exists user_id uuid references auth.users(id) default auth.uid();
-- alter table public.registrations add column if not exists user_email text default (auth.jwt() ->> 'email');

alter table public.registrations enable row level security;

drop policy if exists "Allow public inserts" on public.registrations;

-- Requires Google sign-in (Authentication > Providers > Google) so every
-- registration is tied to a verified account instead of an anonymous visitor.
create policy "Allow authenticated inserts"
  on public.registrations
  for insert
  to authenticated
  with check (auth.uid() = user_id);

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

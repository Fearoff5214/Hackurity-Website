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

-- Idempotent: only add the unique constraint if it isn't already there
-- (plain "add constraint if not exists" isn't valid Postgres syntax).
-- Guarantees a Google account can never insert a second registration row.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'registrations_user_id_key'
  ) then
    alter table public.registrations
      add constraint registrations_user_id_key unique (user_id);
  end if;
end $$;

-- Lets a signed-in user check (client-side) whether *their own* account has
-- already registered a team, without exposing anyone else's row.
drop policy if exists "Allow read of own registration" on public.registrations;

create policy "Allow read of own registration"
  on public.registrations
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Case-insensitive duplicate-email guard. Blocks a submission if the
-- signed-in leader's own account email, or any teammate email listed in
-- `members`, already appears anywhere in an existing registration — either
-- as another row's user_email or as a member email on someone else's team.
-- Runs security definer so it can see every existing row for the
-- cross-account check even though callers themselves can only SELECT their
-- own row.
create or replace function public.prevent_duplicate_registration_emails()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  submission_emails text[];
  duplicate_email text;
begin
  -- Every email involved in this submission: the leader's account email
  -- plus every member email, lowercased/trimmed and de-duplicated.
  select array_agg(distinct lower(trim(email_value)))
  into submission_emails
  from (
    select coalesce(new.user_email, '') as email_value
    union all
    select coalesce(member ->> 'email', '')
    from jsonb_array_elements(coalesce(new.members, '[]'::jsonb)) as member
  ) as all_emails
  where trim(email_value) <> '';

  if submission_emails is null or array_length(submission_emails, 1) is null then
    return new;
  end if;

  -- Does any *other* existing row already use one of these emails, either as
  -- its account owner's email or as one of its listed team members' emails?
  select existing_email
  into duplicate_email
  from (
    select r.user_email as existing_email
    from public.registrations r
    where r.id <> new.id
      and lower(trim(coalesce(r.user_email, ''))) = any (submission_emails)
    union all
    select member ->> 'email' as existing_email
    from public.registrations r,
         jsonb_array_elements(coalesce(r.members, '[]'::jsonb)) as member
    where r.id <> new.id
      and lower(trim(coalesce(member ->> 'email', ''))) = any (submission_emails)
  ) as existing_emails
  limit 1;

  if duplicate_email is not null then
    raise exception
      'DUPLICATE_REGISTRATION: % has already been registered on another team.', duplicate_email
      using errcode = 'HK001';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_prevent_duplicate_registration_emails on public.registrations;

create trigger trg_prevent_duplicate_registration_emails
  before insert or update on public.registrations
  for each row
  execute function public.prevent_duplicate_registration_emails();

-- Optional / stretch: narrow boolean-only check other code (e.g. a live
-- per-field warning) could call without exposing anyone's registration
-- details. Not required for the trigger to work; safe to add later use.
create or replace function public.is_registration_duplicate(check_emails text[])
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.registrations r
    where lower(trim(coalesce(r.user_email, ''))) = any (
      select lower(trim(e)) from unnest(check_emails) as e
    )
    union all
    select 1
    from public.registrations r,
         jsonb_array_elements(coalesce(r.members, '[]'::jsonb)) as member
    where lower(trim(coalesce(member ->> 'email', ''))) = any (
      select lower(trim(e)) from unnest(check_emails) as e
    )
  );
$$;

revoke all on function public.is_registration_duplicate(text[]) from public;
grant execute on function public.is_registration_duplicate(text[]) to authenticated;

-- Existing installs: run this block once to retrofit duplicate-registration
-- protection onto a `registrations` table created before this migration.
-- do $$ begin if not exists (select 1 from pg_constraint where conname = 'registrations_user_id_key') then alter table public.registrations add constraint registrations_user_id_key unique (user_id); end if; end $$;
-- create policy "Allow read of own registration" on public.registrations for select to authenticated using (auth.uid() = user_id);
-- Then re-run the CREATE OR REPLACE FUNCTION / DROP+CREATE TRIGGER / RPC
-- statements above — they are all idempotent and safe to re-run as-is.

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

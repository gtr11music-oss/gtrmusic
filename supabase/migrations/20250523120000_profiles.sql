-- Task 2: profiles table, app_role enum, auth triggers
-- https://supabase.com/docs/guides/auth/managing-user-data

-- ---------------------------------------------------------------------------
-- Enum
-- ---------------------------------------------------------------------------
create type public.app_role as enum (
  'admin',
  'artist',
  'support',
  'user'
);

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text not null default '',
  avatar_url text,
  role public.app_role not null default 'user',
  is_premium boolean not null default false,
  email_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_email_lowercase check (email = lower(email))
);

comment on table public.profiles is 'GTRmusic user profile — one row per auth.users';
comment on column public.profiles.role is 'RBAC: admin | artist | support | user';

create index profiles_role_idx on public.profiles (role);
create index profiles_email_idx on public.profiles (email);

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auth: create profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_name text;
begin
  v_email := lower(coalesce(new.email, ''));
  v_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    split_part(v_email, '@', 1),
    'user'
  );

  insert into public.profiles (
    id,
    email,
    display_name,
    avatar_url,
    email_verified
  )
  values (
    new.id,
    v_email,
    v_name,
    new.raw_user_meta_data ->> 'avatar_url',
    new.email_confirmed_at is not null
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Auth: sync email_verified when user confirms email
-- ---------------------------------------------------------------------------
create or replace function public.handle_user_email_verified()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is not null
    and (old.email_confirmed_at is null or old.email_confirmed_at is distinct from new.email_confirmed_at)
  then
    update public.profiles
    set email_verified = true
    where id = new.id;
  end if;

  return new;
end;
$$;

create trigger on_auth_user_email_confirmed
  after update of email_confirmed_at on auth.users
  for each row
  execute function public.handle_user_email_verified();

-- ---------------------------------------------------------------------------
-- RLS (baseline — expanded in Task 8)
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Inserts only via handle_new_user (security definer)
revoke insert on public.profiles from authenticated, anon;
grant select, update on public.profiles to authenticated;

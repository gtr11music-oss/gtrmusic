-- Task 6: ad_stats, user_subscriptions, artist_payouts

do $$ begin
  create type public.subscription_status as enum ('active', 'canceled', 'past_due', 'trialing');
exception when duplicate_object then null;
end $$;

create table if not exists public.ad_stats (
  id uuid primary key default gen_random_uuid(),
  page_path text not null,
  visit_count bigint not null default 0,
  recorded_date date not null default current_date,
  unique (page_path, recorded_date)
);

create table if not exists public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  provider text not null default 'stripe',
  external_id text,
  status public.subscription_status not null default 'trialing',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artist_payouts (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.profiles (id) on delete cascade,
  amount_cents bigint not null,
  currency text not null default 'EGP',
  mashreq_account_ref text,
  mashreq_iban text,
  status text not null default 'pending',
  requested_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists user_subscriptions_user_idx on public.user_subscriptions (user_id);
create index if not exists ad_stats_date_idx on public.ad_stats (recorded_date);
create index if not exists artist_payouts_artist_idx on public.artist_payouts (artist_id);

drop trigger if exists user_subscriptions_set_updated_at on public.user_subscriptions;
create trigger user_subscriptions_set_updated_at
  before update on public.user_subscriptions
  for each row execute function public.set_updated_at();

alter table public.ad_stats enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.artist_payouts enable row level security;

-- Sync is_premium when subscription becomes active
create or replace function public.sync_premium_from_subscription()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'active' then
    update public.profiles set is_premium = true where id = new.user_id;
  elsif new.status in ('canceled', 'past_due') then
    update public.profiles set is_premium = false where id = new.user_id;
  end if;
  return new;
end;
$$;

drop trigger if exists subscription_sync_premium on public.user_subscriptions;
create trigger subscription_sync_premium
  after insert or update of status on public.user_subscriptions
  for each row execute function public.sync_premium_from_subscription();

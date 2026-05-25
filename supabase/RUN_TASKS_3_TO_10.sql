-- Task 3: songs + song_status

do $$ begin
  create type public.song_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null;
end $$;

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  genre text,
  description text,
  audio_path text not null,
  cover_path text,
  duration_seconds integer,
  status public.song_status not null default 'pending',
  play_count bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists songs_artist_id_idx on public.songs (artist_id);
create index if not exists songs_status_idx on public.songs (status);
create index if not exists songs_title_idx on public.songs using gin (to_tsvector('simple', title));

drop trigger if exists songs_set_updated_at on public.songs;
create trigger songs_set_updated_at
  before update on public.songs
  for each row execute function public.set_updated_at();

alter table public.songs enable row level security;
-- Task 4: playlists, playlist_songs, likes, follows

create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_path text,
  owner_id uuid references public.profiles (id) on delete set null,
  is_public boolean not null default true,
  is_editorial boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.playlist_songs (
  playlist_id uuid not null references public.playlists (id) on delete cascade,
  song_id uuid not null references public.songs (id) on delete cascade,
  position integer not null default 0,
  added_at timestamptz not null default now(),
  primary key (playlist_id, song_id)
);

create table if not exists public.likes (
  user_id uuid not null references public.profiles (id) on delete cascade,
  song_id uuid not null references public.songs (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, song_id)
);

create table if not exists public.follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  following_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint follows_no_self check (follower_id <> following_id)
);

create index if not exists playlist_songs_playlist_idx on public.playlist_songs (playlist_id);
create index if not exists likes_song_idx on public.likes (song_id);
create index if not exists follows_following_idx on public.follows (following_id);

drop trigger if exists playlists_set_updated_at on public.playlists;
create trigger playlists_set_updated_at
  before update on public.playlists
  for each row execute function public.set_updated_at();

alter table public.playlists enable row level security;
alter table public.playlist_songs enable row level security;
alter table public.likes enable row level security;
alter table public.follows enable row level security;
-- Task 5: artist_requests, support_tickets, ticket_messages

do $$ begin
  create type public.ticket_status as enum ('open', 'in_progress', 'resolved', 'closed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.artist_request_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null;
end $$;

create table if not exists public.artist_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  social_links text[],
  document_path text,
  status public.artist_request_status not null default 'pending',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  subject text not null,
  status public.ticket_status not null default 'open',
  assigned_to uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists artist_requests_user_idx on public.artist_requests (user_id);
create index if not exists support_tickets_user_idx on public.support_tickets (user_id);
create index if not exists ticket_messages_ticket_idx on public.ticket_messages (ticket_id);

drop trigger if exists artist_requests_set_updated_at on public.artist_requests;
create trigger artist_requests_set_updated_at
  before update on public.artist_requests
  for each row execute function public.set_updated_at();

drop trigger if exists support_tickets_set_updated_at on public.support_tickets;
create trigger support_tickets_set_updated_at
  before update on public.support_tickets
  for each row execute function public.set_updated_at();

alter table public.artist_requests enable row level security;
alter table public.support_tickets enable row level security;
alter table public.ticket_messages enable row level security;
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
-- Task 7: Storage buckets audio + covers

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'audio',
    'audio',
    false,
    52428800,
    array['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm']
  ),
  (
    'covers',
    'covers',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
-- Task 8: RLS profiles + helper

create or replace function public.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_support_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'support')
  );
$$;

-- Public read limited profile fields for social
drop policy if exists "profiles_select_public" on public.profiles;
create policy "profiles_select_public"
  on public.profiles for select to authenticated
  using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p.role from public.profiles p where p.id = auth.uid())
    and is_premium = (select p.is_premium from public.profiles p where p.id = auth.uid())
  );

drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update"
  on public.profiles for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "profiles_select_own" on public.profiles;
-- Task 9: RLS songs, playlists, social, storage

-- Songs
drop policy if exists "songs_select_approved" on public.songs;
create policy "songs_select_approved"
  on public.songs for select
  using (status = 'approved' or artist_id = auth.uid() or public.is_admin());

drop policy if exists "songs_insert_artist" on public.songs;
create policy "songs_insert_artist"
  on public.songs for insert to authenticated
  with check (
    artist_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('artist', 'admin')
    )
  );

drop policy if exists "songs_update_artist_own" on public.songs;
create policy "songs_update_artist_own"
  on public.songs for update to authenticated
  using (artist_id = auth.uid() or public.is_admin());

drop policy if exists "songs_delete_admin" on public.songs;
create policy "songs_delete_admin"
  on public.songs for delete to authenticated
  using (public.is_admin());

-- Playlists
drop policy if exists "playlists_select_public" on public.playlists;
create policy "playlists_select_public"
  on public.playlists for select
  using (is_public or owner_id = auth.uid() or public.is_admin());

drop policy if exists "playlists_admin_all" on public.playlists;
create policy "playlists_admin_all"
  on public.playlists for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "playlists_owner_manage" on public.playlists;
create policy "playlists_owner_manage"
  on public.playlists for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- Playlist songs
drop policy if exists "playlist_songs_select" on public.playlist_songs;
create policy "playlist_songs_select"
  on public.playlist_songs for select
  using (
    exists (
      select 1 from public.playlists p
      where p.id = playlist_id
        and (p.is_public or p.owner_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "playlist_songs_manage" on public.playlist_songs;
create policy "playlist_songs_manage"
  on public.playlist_songs for all to authenticated
  using (public.is_admin() or exists (
    select 1 from public.playlists p where p.id = playlist_id and p.owner_id = auth.uid()
  ))
  with check (public.is_admin() or exists (
    select 1 from public.playlists p where p.id = playlist_id and p.owner_id = auth.uid()
  ));

-- Likes & follows
drop policy if exists "likes_all_own" on public.likes;
create policy "likes_all_own"
  on public.likes for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "follows_select" on public.follows;
create policy "follows_select"
  on public.follows for select to authenticated
  using (true);

drop policy if exists "follows_manage_own" on public.follows;
create policy "follows_manage_own"
  on public.follows for all to authenticated
  using (follower_id = auth.uid())
  with check (follower_id = auth.uid());

-- Storage
drop policy if exists "audio_upload_artist" on storage.objects;
create policy "audio_upload_artist"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'audio'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "audio_read_approved" on storage.objects;
create policy "audio_read_approved"
  on storage.objects for select to authenticated
  using (bucket_id = 'audio');

drop policy if exists "covers_upload_own" on storage.objects;
create policy "covers_upload_own"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'covers'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "covers_public_read" on storage.objects;
create policy "covers_public_read"
  on storage.objects for select
  using (bucket_id = 'covers');
-- Task 10: RLS tickets, subscriptions, ad_stats, payouts

-- Artist requests
drop policy if exists "artist_requests_select_own" on public.artist_requests;
create policy "artist_requests_select_own"
  on public.artist_requests for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "artist_requests_insert_own" on public.artist_requests;
create policy "artist_requests_insert_own"
  on public.artist_requests for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "artist_requests_admin" on public.artist_requests;
create policy "artist_requests_admin"
  on public.artist_requests for update to authenticated
  using (public.is_admin());

-- Support tickets
drop policy if exists "tickets_user" on public.support_tickets;
create policy "tickets_user"
  on public.support_tickets for select to authenticated
  using (user_id = auth.uid() or public.is_support_or_admin());

drop policy if exists "tickets_insert" on public.support_tickets;
create policy "tickets_insert"
  on public.support_tickets for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "tickets_support_update" on public.support_tickets;
create policy "tickets_support_update"
  on public.support_tickets for update to authenticated
  using (public.is_support_or_admin());

-- Ticket messages
drop policy if exists "ticket_messages_select" on public.ticket_messages;
create policy "ticket_messages_select"
  on public.ticket_messages for select to authenticated
  using (
    exists (
      select 1 from public.support_tickets t
      where t.id = ticket_id
        and (t.user_id = auth.uid() or public.is_support_or_admin())
    )
  );

drop policy if exists "ticket_messages_insert" on public.ticket_messages;
create policy "ticket_messages_insert"
  on public.ticket_messages for insert to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.support_tickets t
      where t.id = ticket_id
        and (t.user_id = auth.uid() or public.is_support_or_admin())
    )
  );

-- Subscriptions
drop policy if exists "subscriptions_own" on public.user_subscriptions;
create policy "subscriptions_own"
  on public.user_subscriptions for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "subscriptions_insert_own" on public.user_subscriptions;
create policy "subscriptions_insert_own"
  on public.user_subscriptions for insert to authenticated
  with check (user_id = auth.uid());

-- Ad stats: insert via service; admin read
drop policy if exists "ad_stats_admin_read" on public.ad_stats;
create policy "ad_stats_admin_read"
  on public.ad_stats for select to authenticated
  using (public.is_admin());

-- Payouts
drop policy if exists "payouts_artist" on public.artist_payouts;
create policy "payouts_artist"
  on public.artist_payouts for select to authenticated
  using (artist_id = auth.uid() or public.is_admin());

drop policy if exists "payouts_insert_artist" on public.artist_payouts;
create policy "payouts_insert_artist"
  on public.artist_payouts for insert to authenticated
  with check (
    artist_id = auth.uid()
    and exists (
      select 1 from public.profiles where id = auth.uid() and role in ('artist', 'admin')
    )
  );

-- Approve artist request → promote role
create or replace function public.handle_artist_request_approved()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'approved' and old.status is distinct from 'approved' then
    update public.profiles set role = 'artist' where id = new.user_id;
  end if;
  return new;
end;
$$;

drop trigger if exists artist_request_approved on public.artist_requests;
create trigger artist_request_approved
  after update of status on public.artist_requests
  for each row execute function public.handle_artist_request_approved();

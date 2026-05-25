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

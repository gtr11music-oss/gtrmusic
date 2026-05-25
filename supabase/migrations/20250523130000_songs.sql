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

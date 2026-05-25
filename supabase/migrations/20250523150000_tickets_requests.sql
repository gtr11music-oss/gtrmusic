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

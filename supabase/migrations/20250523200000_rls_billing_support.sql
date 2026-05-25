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

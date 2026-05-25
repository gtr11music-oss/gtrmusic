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

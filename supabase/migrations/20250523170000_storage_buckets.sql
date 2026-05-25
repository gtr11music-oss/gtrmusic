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

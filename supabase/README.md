# Supabase — GTRmusic

## Task 1 ✅

- Copy `.env.example` → `.env.local`
- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Optional: `SUPABASE_SERVICE_ROLE_KEY` for admin scripts (Task 8+)

Verify:

```bash
npm run dev
curl http://localhost:3000/api/health
```

## Task 2 ✅ — `profiles`

Migration: `supabase/migrations/20250523120000_profiles.sql`

See `docs/TASK-02.md` for apply + verify steps.

## Tasks 3–10

Additional SQL migrations under `supabase/migrations/` in order.

## CLI (optional)

```bash
npx supabase login
npx supabase link --project-ref <your-ref>
npx supabase db push
npx supabase gen types typescript --linked > types/database.ts
```

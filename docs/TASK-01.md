# Task 1 — Environment Setup ✅

## Deliverables

| Item | Path |
|------|------|
| Roadmap (26 tasks) | `docs/ROADMAP.md` |
| Env template | `.env.example` |
| Env helpers | `lib/env.ts` |
| Browser client | `lib/supabase/client.ts` |
| Server client | `lib/supabase/server.ts` |
| Admin (service role) client | `lib/supabase/admin.ts` |
| Session middleware | `lib/supabase/middleware.ts` + root `middleware.ts` |
| DB types stub | `types/database.ts` |
| Health API | `GET /api/health` |

## Setup steps

1. Create a Supabase project at https://supabase.com
2. Copy `.env.example` to `.env.local`
3. Paste **Project URL** and **anon key** from Settings → API
4. Paste **service_role** key (server only) for later admin tasks
5. Run `npm run dev` and open `/api/health`

Expected before Task 2:

```json
{
  "status": "healthy",
  "checks": {
    "supabase_connection": "connected (schema pending — Task 2)"
  }
}
```

## What does NOT change yet

- Existing Zustand/mock UI keeps working (Task 24 migration)
- Auth UI still uses demo login until Task 11
- Roles in UI may show `verified_artist` until Task 12 aligns with `artist`

## Next: Task 3

See `docs/TASK-02.md` (profiles ✅). Continue with `songs` table.

# Task 2 — Database: `profiles` + RBAC enums ✅

## Deliverables

| Item | Path |
|------|------|
| SQL migration | `supabase/migrations/20250523120000_profiles.sql` |
| Enum `app_role` | `admin`, `artist`, `support`, `user` |
| Table `profiles` | Linked to `auth.users` |
| Signup trigger | `handle_new_user` → auto-insert profile |
| Email verify sync | `handle_user_email_verified` |
| Baseline RLS | Own-row select/update (Task 8 adds admin/support/public) |

## Apply migration

**Supabase Dashboard (SQL Editor):**

1. Open your project → **SQL Editor**
2. Paste contents of `supabase/migrations/20250523120000_profiles.sql`
3. Run

**Or Supabase CLI:**

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
npx supabase gen types typescript --linked > types/database.ts
```

## Verify

```bash
npm run dev
curl http://localhost:3000/api/health
```

Expected after migration:

```json
{
  "status": "healthy",
  "checks": {
    "supabase_connection": "connected"
  },
  "roadmap_task": 2
}
```

Register a test user in Supabase Auth (or Task 11 UI). Confirm a row appears:

```sql
select id, email, role, email_verified from public.profiles limit 5;
```

## Promote first admin (manual, one-time)

After your account exists in Auth:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin@example.com';
```

## Schema

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | `auth.users.id` |
| `email` | text | Lowercase enforced |
| `display_name` | text | From metadata or email local-part |
| `avatar_url` | text | Nullable |
| `role` | `app_role` | Default `user` |
| `is_premium` | boolean | Task 20 |
| `email_verified` | boolean | Synced from Auth |
| `created_at` / `updated_at` | timestamptz | Auto |

## What does NOT change yet

- UI still uses Zustand/mock auth (Task 11)
- Full RLS matrix (Task 8)
- `songs` and other tables (Tasks 3–6)

## Next: Task 3

`songs` table + moderation `song_status` enum.

# GTRmusic — 26-Task Development Roadmap

**Lead Developer protocol:** Complete tasks in order. Do not skip ahead unless a dependency is explicitly waived. Mark status: `⬜ Pending` | `🔄 In Progress` | `✅ Done`.

| # | Task | Status |
|---|------|--------|
| 1 | Environment setup (Next.js, Supabase, env vars, clients) | ✅ Done |
| 2 | Database schema: `profiles` + RBAC enums | ✅ Done |
| 3 | Database schema: `songs` + moderation status | ⬜ Pending |
| 4 | Database schema: `playlists`, `playlist_songs`, social (`likes`, `follows`) | ⬜ Pending |
| 5 | Database schema: `artist_requests`, `support_tickets`, messages | ⬜ Pending |
| 6 | Database schema: `ad_stats`, `user_subscriptions`, payouts metadata | ⬜ Pending |
| 7 | Supabase Storage: `audio`, `covers` buckets + policies | ⬜ Pending |
| 8 | RLS: profiles & auth-linked rows | ⬜ Pending |
| 9 | RLS: songs, storage objects, playlists | ⬜ Pending |
| 10 | RLS: tickets, subscriptions, ad_stats | ⬜ Pending |
| 11 | Auth: email/password + mandatory email verification | ⬜ Pending |
| 12 | RBAC middleware & server role guards (admin, artist, support, user) | ⬜ Pending |
| 13 | User profile self-service (name, avatar — no admin approval) | ⬜ Pending |
| 14 | Artist upload pipeline (MP3 + cover → pending review) | ⬜ Pending |
| 15 | Admin moderation queue (approve/reject songs) | ⬜ Pending |
| 16 | Artist upgrade requests (`artist_requests`) | ⬜ Pending |
| 17 | Support ticketing system (realtime) | ⬜ Pending |
| 18 | Search API + likes/follows engagement | ⬜ Pending |
| 19 | Admin playlist CRUD | ⬜ Pending |
| 20 | Premium gate: `is_premium` → download permission | ⬜ Pending |
| 21 | Payments: Stripe/Paymob subscriptions + webhooks (no local card storage) | ⬜ Pending |
| 22 | Payouts: artist earnings + Mashreq bank metadata | ⬜ Pending |
| 23 | AdSense logic: `ad_stats` page visits + projected earnings | ⬜ Pending |
| 24 | Migrate UI from mock/Zustand to Supabase data layer | ⬜ Pending |
| 25 | Admin dashboard: users, content, earnings, ads | ⬜ Pending |
| 26 | Production hardening: monitoring, docs, seed, CI | ⬜ Pending |

## Roles (canonical)

| Role | Access |
|------|--------|
| `admin` | Full system: users, moderation, playlists, earnings |
| `artist` | Upload songs, artist stats |
| `support` | `support_tickets` only |
| `user` | Stream, profile, request artist upgrade |

## Stack

- **Frontend:** Next.js 16 (App Router), RTL Arabic UI (existing)
- **Backend:** Supabase (Auth, Postgres, Storage, Realtime)
- **Payments:** Stripe or Paymob via secure webhooks only

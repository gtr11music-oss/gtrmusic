# GTRmusic — 26-Task Development Roadmap

**Lead Developer protocol:** Complete tasks in order. Do not skip ahead unless a dependency is explicitly waived. Mark status: `⬜ Pending` | `🔄 In Progress` | `✅ Done`.

| # | Task | Status |
|---|------|--------|
| 1 | Environment setup (Next.js, Supabase, env vars, clients) | ✅ Done |
| 2 | Database schema: `profiles` + RBAC enums | ✅ Done |
| 3 | Database schema: `songs` + moderation status | ✅ Done |
| 4 | Database schema: `playlists`, `playlist_songs`, social (`likes`, `follows`) | ✅ Done |
| 5 | Database schema: `artist_requests`, `support_tickets`, messages | ✅ Done |
| 6 | Database schema: `ad_stats`, `user_subscriptions`, payouts metadata | ✅ Done |
| 7 | Supabase Storage: `audio`, `covers` buckets + policies | ✅ Done |
| 8 | RLS: profiles & auth-linked rows | ✅ Done |
| 9 | RLS: songs, storage objects, playlists | ✅ Done |
| 10 | RLS: tickets, subscriptions, ad_stats | ✅ Done |
| 11 | Auth: email/password + mandatory email verification | ✅ Done |
| 12 | RBAC middleware & server role guards (admin, artist, support, user) | ✅ Done |
| 13 | User profile self-service (name, avatar — no admin approval) | ✅ Done |
| 14 | Artist upload pipeline (MP3 + cover → pending review) | ✅ Done |
| 15 | Admin moderation queue (approve/reject songs) | ✅ Done |
| 16 | Artist upgrade requests (`artist_requests`) | ✅ Done |
| 17 | Support ticketing system (realtime) | 🔄 API ready |
| 18 | Search API + likes/follows engagement | ✅ Done |
| 19 | Admin playlist CRUD | ✅ Done |
| 20 | Premium gate: `is_premium` → download permission | ✅ Done |
| 21 | Payments: Stripe/Paymob subscriptions + webhooks (no local card storage) | 🔄 Stripe stub |
| 22 | Payouts: artist earnings + Mashreq bank metadata | ✅ Done |
| 23 | AdSense logic: `ad_stats` page visits + projected earnings | ✅ Done |
| 24 | Migrate UI from mock/Zustand to Supabase data layer | 🔄 In Progress |
| 25 | Admin dashboard: users, content, earnings, ads | 🔄 In Progress |
| 26 | Production hardening: monitoring, docs, seed, CI | 🔄 CI added |

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

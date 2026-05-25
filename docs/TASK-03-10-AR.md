# المهام 3–10 — خطوة واحدة في Supabase

## ماذا تفعل

1. Supabase → **SQL Editor** → **New query**
2. افتح الملف من المشروع:  
   `supabase/RUN_TASKS_3_TO_10.sql`
3. **Ctrl+A** → **Ctrl+C** → الصق في Supabase → **Run**

## بعد النجاح

في **Table Editor** يجب أن ترى جداول مثل:

- `songs`
- `playlists`
- `support_tickets`
- `ad_stats`

وفي **Storage** → Buckets: `audio` و `covers`

## تحقق

```bash
npm run dev
```

http://localhost:3000/api/health

---

**ملاحظة:** إذا ظهر خطأ `already exists` — تجاهله إن كان الجدول موجوداً.

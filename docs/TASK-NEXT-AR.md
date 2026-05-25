# الخطوات التالية (بعد كمل)

## 1) SQL (إن لم تشغّله)

الصق في Supabase SQL Editor:

`supabase/RUN_TASKS_3_TO_10.sql`

## 2) مفتاح الخادم

في `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

من: Settings → API → Secret key

## 3) Realtime للتذاكر

Supabase Dashboard → **Database** → **Replication** → فعّل Realtime لجدول `ticket_messages`

## 4) أول مدير

```sql
update public.profiles set role = 'admin' where email = 'بريدك@example.com';
```

## 5) تجربة

```bash
npm run dev
```

| المسار | ماذا تختبر |
|--------|------------|
| `/register` + تأكيد البريد | Auth |
| `/upload` | رفع أغنية (فنان) |
| `/admin` → المراجعة | قبول/رفض |
| `/chat` → تذاكر الدعم | تذكرة + رسائل |
| `/search?q=...` | بحث Supabase |

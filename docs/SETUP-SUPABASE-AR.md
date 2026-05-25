# إعداد Supabase — خطوة بخطوة (عربي)

## 1) مفاتيح المشروع

1. https://supabase.com/dashboard → مشروعك
2. **Settings** → **API**
3. انسخ:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY` (سري — لا تشاركه)

## 2) ملف البيئة على جهازك

في مجلد المشروع `gtrmusic` أنشئ ملف **`.env.local`** (نسخ من `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

ثم:

```bash
npm run dev
```

## 3) تشغيل SQL (مرة واحدة)

**المكان الوحيد:** Supabase Dashboard → **SQL Editor** → New query

### إذا ظهر: `app_role already exists`

لا تشغّل الملف الأول. شغّل فقط:

`supabase/migrations/20250523120001_profiles_idempotent_repair.sql`

(انسخ محتواه من المشروع والصقه → Run)

### إذا لم تشغّل أي شيء من قبل

شغّل بالترتيب:

1. `20250523120000_profiles.sql` (ينشئ enum + جدول)
2. إذا فشل على enum، شغّل `20250523120001_profiles_idempotent_repair.sql`

## 4) تحقق

- Dashboard → **Table Editor** → جدول `profiles`
- المتصفح: http://localhost:3000/api/health → `"supabase_connection": "connected"`

## 5) أول مدير

```sql
update public.profiles set role = 'admin' where email = 'gtr11music@gmail.com';
```

(غيّر البريد لبريدك المسجّل في Auth)

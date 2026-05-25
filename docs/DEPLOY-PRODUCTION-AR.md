# نشر GTRmusic — النسخة الإنتاجية

## 1) Supabase (مرة واحدة)

1. شغّل SQL: `supabase/migrations/20250523120001_profiles_idempotent_repair.sql` (إن لم يكن profiles موجوداً)
2. شغّل SQL: `supabase/RUN_TASKS_3_TO_10.sql`
3. **Database → Replication** → فعّل Realtime لـ `ticket_messages`
4. عيّن مديراً:

```sql
update public.profiles set role = 'admin' where email = 'بريدك@example.com';
```

## 2) نشر على Vercel

1. https://vercel.com → Import من GitHub: `gtr11music-oss/gtrmusic`
2. **Environment Variables** (Production):

| المتغير | القيمة |
|---------|--------|
| `NEXT_PUBLIC_APP_MODE` | `production` |
| `NEXT_PUBLIC_SUPABASE_URL` | من Supabase API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key (سري) |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | من Google reCAPTCHA |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | من Google AdSense `ca-pub-...` |
| `NEXT_PUBLIC_ADSENSE_SLOT_*` | معرفات وحدات الإعلان |

3. Deploy

**ربط Google AdSense:** [docs/GOOGLE-ADSENSE-AR.md](GOOGLE-ADSENSE-AR.md)

## 3) بعد النشر

- `https://your-domain.vercel.app/api/health` → healthy + connected
- سجّل حساباً حقيقياً + فعّل البريد
- `/admin` للمدير فقط

## 4) ما لم يعد تجريبياً في الإنتاج

- تسجيل `admin@` وهمي — **معطّل**
- كتالوج mock — **معطّل** (بيانات Supabase فقط)
- دردشة وهمية — **معطّل** (تذاكر دعم فقط)
- Premium تجريبي — **معطّل** (Stripe لاحقاً)

## 5) التطوير المحلي (اختياري)

في `.env.local` للتجربة مع mock:

```env
NEXT_PUBLIC_ALLOW_DEMO_MODE=true
```

**لا تضع هذا على Vercel.**

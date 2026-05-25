# GTRmusic

منصة بث موسيقي عربية احترافية — PWA، ربح للمبدعين، إشراف، توثيق، وذكاء اصطناعي.

## التشغيل

```bash
npm install
npm run dev
```

افتح http://localhost:3000 — على الجوال: «تثبيت التطبيق» أو Add to Home Screen.

## الأدوار

| البريد يبدأ بـ | الدور |
|----------------|--------|
| `admin@` | مدير |
| `artist@` / `verified@` | فنان موثق |
| أي بريد آخر | مستخدم |

كلمة المرور: 6 أحرف على الأقل.

## الميزات

- **PWA**: manifest، service worker، offline، تثبيت، إشعارات
- **فنان**: رفع أغاني/بودكاست (مراجعة إدارية)، تحليلات، ربح، طلب توثيق
- **مجتمع**: متابعة، إعجاب، تعليقات، مشاركة، دردشة مباشرة، إشعارات
- **إدارة**: مستخدمون، محتوى، بلاغات، strikes، إيرادات، توثيق
- **قانوني**: `/legal/privacy`, `terms`, `copyright`, `dmca`, `community`, `contact`, `report`, `verification`
- **أمان**: rate limit، reCAPTCHA (عيّن `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`)، تحقق رفع

## مسارات رئيسية

| المسار | الوصف |
|--------|--------|
| `/dashboard` | لوحة الفنان (رفع، تحليلات، ربح، توثيق) |
| `/monetization` | الربح وطلبات السحب |
| `/chat` | دردشة مباشرة |
| `/profile` | الملف الشخصي |
| `/admin` | لوحة الإدارة |
| `/premium` | اشتراك بدون إعلانات |

## تطبيق أصلي (Android / iOS)

راجع [docs/NATIVE.md](docs/NATIVE.md) لـ Capacitor و React Native.

## Supabase (Roadmap Task 1–2)

**دليل عربي مفصل:** [docs/SETUP-SUPABASE-AR.md](docs/SETUP-SUPABASE-AR.md)

```bash
cp .env.example .env.local
# أضف مفاتيح Supabase من Dashboard → Settings → API
npm run dev
# تحقق: http://localhost:3000/api/health
```

- Migration أساسي: `supabase/migrations/20250523120000_profiles.sql`
- إصلاح إذا `app_role already exists`: `20250523120001_profiles_idempotent_repair.sql`

Roadmap: [docs/ROADMAP.md](docs/ROADMAP.md)

## متغيرات البيئة

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
NEXT_PUBLIC_CDN_URL=
```

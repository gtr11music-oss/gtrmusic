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

## متغيرات البيئة

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
NEXT_PUBLIC_CDN_URL=
```

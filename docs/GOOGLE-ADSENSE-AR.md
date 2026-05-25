# ربط Google AdSense — خطوة بخطوة

الموقع **منشور على Vercel** عبر GitHub. لا تحتاج رفع ملفات جديدة يدوياً — فقط إعداد Google + متغيرات Vercel.

---

## الخطوة 1: حساب AdSense

1. https://www.google.com/adsense
2. سجّل الدخول بحساب Google
3. أضف موقعك: رابط Vercel مثل `https://gtrmusic.vercel.app`
4. انتظر **موافقة Google** (قد تستغرق أياماً)

---

## الخطوة 2: انسخ معرف الناشر

بعد الموافقة:

1. AdSense → **الحساب** → **معلومات الحساب**
2. انسخ **معرف الناشر** بصيغة: `ca-pub-XXXXXXXXXXXXXXXX`

---

## الخطوة 3: أنشئ وحدات إعلانية (Ad units)

1. AdSense → **الإعلانات** → **حسب الوحدة**
2. أنشئ 4 وحدات (أو واحدة Auto):
   - Banner
   - Sidebar
   - In-feed
   - Player
3. انسخ **معرف كل وحدة** (رقم طويل)

---

## الخطوة 4: أضف المتغيرات في Vercel

1. https://vercel.com → مشروع **gtrmusic**
2. **Settings** → **Environment Variables**
3. أضف (Production):

| الاسم | القيمة |
|-------|--------|
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | `ca-pub-...` |
| `NEXT_PUBLIC_ADSENSE_SLOT_BANNER` | رقم وحدة البانر |
| `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR` | رقم وحدة الشريط |
| `NEXT_PUBLIC_ADSENSE_SLOT_INFEED` | رقم وحدة In-feed |
| `NEXT_PUBLIC_ADSENSE_SLOT_PLAYER` | رقم وحدة Player |

4. **Deployments** → **Redeploy** (إعادة نشر)

---

## الخطوة 5: reCAPTCHA (اختياري — تسجيل الدخول)

1. https://www.google.com/recaptcha/admin
2. نوع: **v2** مربع اختيار
3. النطاقات: `gtrmusic.vercel.app` + `localhost`
4. انسخ **Site key** → في Vercel:

```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...
```

5. Redeploy

---

## ملاحظات

- بدون `NEXT_PUBLIC_ADSENSE_CLIENT_ID` تظهر مساحة رمادية (تجريبية).
- الإحصائيات الداخلية تُسجَّل في Supabase عبر `/api/ads/track`.
- لا تضع `ca-pub` في GitHub — فقط في Vercel.

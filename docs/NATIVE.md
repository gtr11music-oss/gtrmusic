# تحويل GTRmusic لتطبيق أصلي

المشروع جاهز كـ **PWA** ويمكن لفّه بـ:

## Capacitor (موصى به)

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init GTRmusic com.gtrmusic.app --web-dir=out
npm run build
npx cap add android
npx cap add ios
```

استخدم `output: 'export'` في `next.config.ts` للبناء الثابت، أو استضف الويب على CDN واجعل التطبيق WebView.

## React Native / Expo

- مشاركة: `types/`, `lib/ai/`, `lib/constants/`, منطق Zustand
- واجهة: إعادة بناء الشاشات بـ React Native components
- الصوت: `expo-av` أو `react-native-track-player`

## ما هو جاهز اليوم

- `manifest.webmanifest` + `sw.js` + تثبيت الشاشة الرئيسية
- RTL عربي، أدوار مستخدمين، API-ready stores
- CDN: `NEXT_PUBLIC_CDN_URL`

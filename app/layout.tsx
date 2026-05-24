import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "GTRmusic — منصة البث الموسيقي العربية",
    template: "%s | GTRmusic",
  },
  description:
    "استمع لأفضل الموسيقى العربية، البودكاست، وقوائم التشغيل. تطبيق PWA — ربح للمبدعين، Premium، وتوصيات ذكية.",
  keywords: ["موسيقى عربية", "بث موسيقي", "بودكاست", "GTRmusic", "PWA"],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GTRmusic",
  },
  openGraph: {
    title: "GTRmusic",
    description: "منصة البث الموسيقي العربية الاحترافية",
    locale: "ar_SA",
    type: "website",
  },
  robots: { index: true, follow: true },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a1628" },
    { color: "#0a1628" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} dark h-full`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-full touch-manipulation font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

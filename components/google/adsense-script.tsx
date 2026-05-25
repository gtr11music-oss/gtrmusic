"use client";

import Script from "next/script";
import { getAdSenseClientId } from "@/lib/google/config";

/** Loads Google AdSense once per app */
export function AdSenseScript() {
  const clientId = getAdSenseClientId();
  if (!clientId) return null;

  return (
    <Script
      id="adsense-init"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

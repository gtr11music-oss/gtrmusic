"use client";

import { AudioEngine } from "@/components/player/audio-engine";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { PushSetup } from "@/components/pwa/push-setup";
import { AdSenseScript } from "@/components/google/adsense-script";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdSenseScript />
      {children}
      <AudioEngine />
      <ServiceWorkerRegister />
      <InstallPrompt />
      <PushSetup />
    </>
  );
}

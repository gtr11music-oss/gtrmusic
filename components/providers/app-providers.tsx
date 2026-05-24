"use client";

import { AudioEngine } from "@/components/player/audio-engine";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { PushSetup } from "@/components/pwa/push-setup";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AudioEngine />
      <ServiceWorkerRegister />
      <InstallPrompt />
      <PushSetup />
    </>
  );
}

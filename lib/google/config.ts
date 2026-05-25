/** Google services — env only, never commit secrets */

export function getAdSenseClientId(): string | undefined {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();
}

export function isAdSenseEnabled(): boolean {
  return Boolean(getAdSenseClientId());
}

export function getRecaptchaSiteKey(): string | undefined {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim();
}

export function isRecaptchaEnabled(): boolean {
  return Boolean(getRecaptchaSiteKey());
}

const slotEnv: Record<string, string | undefined> = {
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
  banner: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER,
  "in-feed": process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED,
  player: process.env.NEXT_PUBLIC_ADSENSE_SLOT_PLAYER,
};

export function getAdSenseSlot(placement: keyof typeof slotEnv): string | undefined {
  return slotEnv[placement]?.trim();
}

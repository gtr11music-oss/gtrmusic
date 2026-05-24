/** شروط تفعيل الربح من GTRmusic */
export const MONETIZATION_REQUIREMENTS = {
  minStreams: 100_000,
  minFollowers: 10_000,
} as const;

/** معدل الربح التقديري لكل 1000 استماع (دولار) — نموذج يشبه YouTube */
export const REVENUE_PER_1000_STREAMS = 2.5;

export const PREMIUM_PRICE_MONTHLY = 29.99;

export const PAYOUT_MINIMUM = 50;

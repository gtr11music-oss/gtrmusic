import type { CreatorEarnings, MonthlyAnalytics } from "@/types";
import { REVENUE_PER_1000_STREAMS } from "@/lib/constants/monetization";

export function buildMonthlyAnalytics(streams: number): MonthlyAnalytics[] {
  const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"];
  return months.map((month, i) => {
    const factor = 0.7 + i * 0.05;
    const monthStreams = Math.round((streams / 6) * factor);
    return {
      month,
      streams: monthStreams,
      listenHours: Math.round((monthStreams * 3.5) / 60),
      revenue: (monthStreams / 1000) * REVENUE_PER_1000_STREAMS,
      followers: Math.round(800 + i * 420),
    };
  });
}

export function computeCreatorEarnings(
  totalStreams: number,
  totalFollowers: number,
  listenHours: number,
  paidOut = 0
): CreatorEarnings {
  const estimatedRevenue = (totalStreams / 1000) * REVENUE_PER_1000_STREAMS;
  const availableBalance = Math.max(0, estimatedRevenue - paidOut);
  const monthly = buildMonthlyAnalytics(totalStreams);

  return {
    totalStreams,
    totalFollowers,
    listenHours,
    estimatedRevenue,
    availableBalance,
    pendingPayout: 0,
    monthly,
    eligible:
      totalStreams >= 100_000 && totalFollowers >= 10_000,
  };
}

export const platformRevenueMock = {
  totalRevenue: 284_500,
  adRevenue: 142_200,
  premiumRevenue: 98_300,
  creatorPayouts: 44_000,
  monthlyGrowth: [12, 18, 15, 22, 28, 35],
};

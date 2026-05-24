"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  Clock,
  Users,
  Headphones,
  CheckCircle2,
  XCircle,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { PayoutSection } from "@/components/monetization/payout-section";
import { useMonetizationStore } from "@/lib/store/monetization-store";
import { MONETIZATION_REQUIREMENTS } from "@/lib/constants/monetization";

export function MonetizationDashboard() {
  const getEarnings = useMonetizationStore((s) => s.getEarnings);
  const earnings = getEarnings();

  const streamProgress = Math.min(
    100,
    (earnings.totalStreams / MONETIZATION_REQUIREMENTS.minStreams) * 100
  );
  const followerProgress = Math.min(
    100,
    (earnings.totalFollowers / MONETIZATION_REQUIREMENTS.minFollowers) * 100
  );

  const cards = [
    {
      label: "الإيراد التقديري",
      value: `$${earnings.estimatedRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-gtr-accent",
    },
    {
      label: "الرصيد المتاح",
      value: `$${earnings.availableBalance.toFixed(2)}`,
      icon: Wallet,
      color: "text-primary",
    },
    {
      label: "ساعات الاستماع",
      value: earnings.listenHours.toLocaleString("ar-EG"),
      icon: Clock,
      color: "text-purple-400",
    },
    {
      label: "إجمالي التشغيل",
      value: earnings.totalStreams.toLocaleString("ar-EG"),
      icon: Headphones,
      color: "text-orange-400",
    },
    {
      label: "المتابعون",
      value: earnings.totalFollowers.toLocaleString("ar-EG"),
      icon: Users,
      color: "text-blue-400",
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">لوحة الربح</h1>
          <p className="text-muted-foreground">
            اربح من استماعاتك مثل YouTube — بعد استيفاء الشروط
          </p>
        </div>
        <Badge
          variant={earnings.eligible ? "default" : "secondary"}
          className={earnings.eligible ? "bg-gtr-accent text-black" : ""}
        >
          {earnings.eligible ? (
            <>
              <CheckCircle2 className="ms-1 size-3" /> مفعّل
            </>
          ) : (
            <>
              <XCircle className="ms-1 size-3" /> غير مفعّل
            </>
          )}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">شروط التفعيل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>100,000 تشغيل كحد أدنى</span>
              <span>{streamProgress.toFixed(0)}%</span>
            </div>
            <Progress value={streamProgress} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>10,000 متابع كحد أدنى</span>
              <span>{followerProgress.toFixed(0)}%</span>
            </div>
            <Progress value={followerProgress} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {c.label}
                </CardTitle>
                <c.icon className={`size-4 ${c.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold tabular-nums">{c.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>الإيرادات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={earnings.monthly} type="area" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>التشغيلات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={earnings.monthly} type="bar" />
          </CardContent>
        </Card>
      </div>

      <PayoutSection earnings={earnings} />
    </div>
  );
}

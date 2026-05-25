"use client";

import { motion } from "framer-motion";
import { Crown, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  usePremiumStore,
  PREMIUM_FEATURES,
  PREMIUM_PRICE_MONTHLY,
} from "@/lib/store/premium-store";
import { AdSlot } from "@/components/ads/ad-slot";
import { useAuthStore } from "@/lib/store/auth-store";
import { isProductionApp } from "@/lib/config/app-mode";

export function PremiumPlans() {
  const user = useAuthStore((s) => s.user);
  const storePremium = usePremiumStore((s) => s.isPremium);
  const isPremium = user?.isPremium === true || storePremium;
  const expiresAt = usePremiumStore((s) => s.expiresAt);
  const cancel = usePremiumStore((s) => s.cancel);
  const production = isProductionApp();

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Crown className="size-8 text-amber-400" />
          GTRmusic Premium
        </h1>
        <p className="mt-2 text-muted-foreground">
          اشتراك اختياري بدون إعلانات وميزات حصرية
        </p>
      </motion.div>

      <Card className="border-primary/30 gtr-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Premium</CardTitle>
            {isPremium && <Badge className="bg-gtr-accent text-black">نشط</Badge>}
          </div>
          <p className="text-3xl font-bold">
            ${PREMIUM_PRICE_MONTHLY}
            <span className="text-base font-normal text-muted-foreground"> / شهر</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="space-y-2">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="size-4 text-gtr-accent" />
                {f}
              </li>
            ))}
          </ul>
          {isPremium ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">ينتهي في: {expiresAt}</p>
              <Button variant="outline" onClick={cancel}>
                إلغاء الاشتراك
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {production
                  ? "الاشتراك عبر Stripe/Paymob — فعّل STRIPE_SECRET_KEY وربط webhook في Vercel."
                  : "للتجربة المحلية فقط: NEXT_PUBLIC_ALLOW_DEMO_MODE=true"}
              </p>
              {!production && (
                <Button
                  className="w-full bg-gtr-accent text-black hover:bg-gtr-accent/90"
                  size="lg"
                  disabled
                >
                  الدفع الإلكتروني قريباً
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {!isPremium && <AdSlot placement="banner" label="إعلان" />}
    </div>
  );
}

"use client";

import { useState } from "react";
import { CreditCard, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useMonetizationStore } from "@/lib/store/monetization-store";
import { PAYOUT_MINIMUM } from "@/lib/constants/monetization";
import type { CreatorEarnings } from "@/types";

export function PayoutSection({ earnings }: { earnings: CreatorEarnings }) {
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const payoutMethod = useMonetizationStore((s) => s.payoutMethod);
  const payoutEmail = useMonetizationStore((s) => s.payoutEmail);
  const payouts = useMonetizationStore((s) => s.payouts);
  const setPayoutMethod = useMonetizationStore((s) => s.setPayoutMethod);
  const requestPayout = useMonetizationStore((s) => s.requestPayout);

  const handleMethod = (method: "stripe" | "paypal") => {
    const email = prompt(
      method === "stripe"
        ? "أدخل بريد حساب Stripe"
        : "أدخل بريد PayPal"
    );
    if (email) setPayoutMethod(method, email);
  };

  const handlePayout = () => {
    const num = parseFloat(amount);
    const result = requestPayout(num);
    setMsg(result.ok ? "تم طلب السحب بنجاح" : (result.error ?? "خطأ"));
    if (result.ok) setAmount("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="size-5" />
          طلب سحب الأرباح
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <Button
            variant={payoutMethod === "stripe" ? "default" : "outline"}
            className="gap-2"
            onClick={() => handleMethod("stripe")}
          >
            <CreditCard className="size-4" />
            Stripe
          </Button>
          <Button
            variant={payoutMethod === "paypal" ? "default" : "outline"}
            className="gap-2"
            onClick={() => handleMethod("paypal")}
          >
            PayPal
          </Button>
        </div>
        {payoutEmail && (
          <p className="text-sm text-muted-foreground">
            الحساب المرتبط: {payoutEmail} ({payoutMethod})
          </p>
        )}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Label>المبلغ (USD) — الحد الأدنى ${PAYOUT_MINIMUM}</Label>
            <Input
              type="number"
              dir="ltr"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="mt-1"
            />
          </div>
          <Button
            className="self-end bg-gtr-accent text-black hover:bg-gtr-accent/90"
            disabled={!earnings.eligible}
            onClick={handlePayout}
          >
            طلب السحب
          </Button>
        </div>
        {msg && <p className="text-sm text-primary">{msg}</p>}
        {payouts.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium">طلبات سابقة</p>
            <ul className="space-y-2">
              {payouts.slice(0, 5).map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"
                >
                  <span>${p.amount} — {p.method}</span>
                  <Badge variant="secondary">{p.status}</Badge>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

interface RecaptchaFieldProps {
  onVerify: (verified: boolean) => void;
  className?: string;
}

/** reCAPTCHA v2 checkbox — أو تحقق تجريبي عند غياب المفتاح */
export function RecaptchaField({ onVerify, className }: RecaptchaFieldProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (v: boolean) => {
    setChecked(v);
    onVerify(v);
  };

  if (SITE_KEY) {
    return (
      <div className={cn("space-y-2", className)}>
        <Label>التحقق الأمني (reCAPTCHA)</Label>
        <div
          className="g-recaptcha min-h-[78px] rounded-md border border-border bg-muted/30 p-2"
          data-sitekey={SITE_KEY}
        />
        <p className="text-xs text-muted-foreground">
          أضف سكربت Google reCAPTCHA في الإنتاج
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => handleChange(e.target.checked)}
          className="size-4 rounded border-border"
        />
        لست روبوتاً (تحقق تجريبي — عيّن NEXT_PUBLIC_RECAPTCHA_SITE_KEY)
      </Label>
    </div>
  );
}

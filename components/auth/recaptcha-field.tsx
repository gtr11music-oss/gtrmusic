"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getRecaptchaSiteKey, isRecaptchaEnabled } from "@/lib/google/config";

interface RecaptchaFieldProps {
  onVerify: (verified: boolean) => void;
  className?: string;
}

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: () => void;
          "expired-callback": () => void;
        }
      ) => number;
    };
  }
}

export function RecaptchaField({ onVerify, className }: RecaptchaFieldProps) {
  const siteKey = getRecaptchaSiteKey();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  const renderWidget = useCallback(() => {
    if (!siteKey || !containerRef.current || !window.grecaptcha) return;
    if (widgetId.current !== null) return;
    widgetId.current = window.grecaptcha.render(containerRef.current, {
      sitekey: siteKey,
      callback: () => onVerify(true),
      "expired-callback": () => onVerify(false),
    });
  }, [siteKey, onVerify]);

  useEffect(() => {
    if (ready) renderWidget();
  }, [ready, renderWidget]);

  if (isRecaptchaEnabled() && siteKey) {
    return (
      <div className={cn("space-y-2", className)}>
        <Script
          src="https://www.google.com/recaptcha/api.js?render=explicit"
          async
          defer
          strategy="afterInteractive"
          onReady={() => setReady(true)}
        />
        <Label>التحقق الأمني</Label>
        <div ref={containerRef} className="min-h-[78px]" />
      </div>
    );
  }

  const [checked, setChecked] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);
            onVerify(e.target.checked);
          }}
          className="size-4 rounded border-border"
        />
        لست روبوتاً (أضف NEXT_PUBLIC_RECAPTCHA_SITE_KEY في Vercel)
      </Label>
    </div>
  );
}

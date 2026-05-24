"use client";

import { useState } from "react";
import Link from "next/link";
import { LegalDocument } from "@/components/legal/legal-document";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/auth-store";
import { useReportsStore } from "@/lib/store/reports-store";
import type { ReportType } from "@/types";
import { RecaptchaField } from "@/components/auth/recaptcha-field";

export default function ReportAbusePage() {
  const user = useAuthStore((s) => s.user);
  const submitReport = useReportsStore((s) => s.submitReport);
  const [type, setType] = useState<ReportType>("abuse");
  const [target, setTarget] = useState("");
  const [desc, setDesc] = useState("");
  const [captchaOk, setCaptchaOk] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !captchaOk) return;
    submitReport(type, "track", target, target, user.id, user.name, desc);
    setDone(true);
  };

  if (done) {
    return (
      <LegalDocument title="تم الإرسال" lastUpdated="">
        <p>شكراً. سيُراجع فريق الإشراف بلاغك.</p>
        <Link href="/" className="text-primary">
          العودة للرئيسية
        </Link>
      </LegalDocument>
    );
  }

  return (
    <LegalDocument title="الإبلاغ عن إساءة" lastUpdated="23 مايو 2026">
      <form onSubmit={handleSubmit} className="space-y-4 not-prose">
        <div>
          <Label>نوع البلاغ</Label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ReportType)}
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
          >
            <option value="stolen_music">موسيقى مسروقة</option>
            <option value="fake_account">حساب وهمي</option>
            <option value="abuse">إساءة</option>
            <option value="copyright">حقوق نشر</option>
          </select>
        </div>
        <div>
          <Label>الهدف (رابط أو اسم)</Label>
          <Input value={target} onChange={(e) => setTarget(e.target.value)} required />
        </div>
        <div>
          <Label>التفاصيل</Label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="mt-1 min-h-[100px] w-full rounded-md border border-input bg-transparent p-3 text-sm"
            required
          />
        </div>
        <RecaptchaField onVerify={setCaptchaOk} />
        <Button type="submit" disabled={!user}>
          {user ? "إرسال" : "سجّل الدخول أولاً"}
        </Button>
      </form>
    </LegalDocument>
  );
}

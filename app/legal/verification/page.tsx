"use client";

import Link from "next/link";
import { LegalDocument } from "@/components/legal/legal-document";
import { VerificationRequestForm } from "@/components/verification/verification-request-form";
import { Button } from "@/components/ui/button";

export default function VerificationRequestPage() {
  return (
    <div className="min-h-dvh gtr-gradient">
      <header className="border-b border-border p-4">
        <Link href="/" className="text-primary text-sm">
          ← الرئيسية
        </Link>
      </header>
      <div className="mx-auto max-w-lg p-6">
        <h1 className="mb-2 text-2xl font-bold">طلب التوثيق</h1>
        <p className="mb-6 text-muted-foreground">
          للفنانين والمبدعين — ارفع الروابط ووثيقة الهوية
        </p>
        <VerificationRequestForm />
        <Button asChild variant="link" className="mt-4">
          <Link href="/login">تسجيل الدخول مطلوب</Link>
        </Button>
      </div>
    </div>
  );
}

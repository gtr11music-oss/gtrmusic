"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useReportsStore } from "@/lib/store/reports-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { checkRateLimit } from "@/lib/security/rate-limit";
import type { ReportType } from "@/types";

const reportTypes: { value: ReportType; label: string }[] = [
  { value: "stolen_music", label: "موسيقى مسروقة" },
  { value: "fake_account", label: "حساب وهمي" },
  { value: "abuse", label: "إساءة أو تحرش" },
  { value: "copyright", label: "انتهاك حقوق نشر" },
  { value: "spam", label: "بريد مزعج / سبام" },
  { value: "other", label: "أخرى" },
];

interface ReportDialogProps {
  targetType: "track" | "user" | "comment";
  targetId: string;
  targetLabel: string;
}

export function ReportDialog({ targetType, targetId, targetLabel }: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ReportType>("stolen_music");
  const [description, setDescription] = useState("");
  const [done, setDone] = useState(false);
  const submitReport = useReportsStore((s) => s.submitReport);
  const user = useAuthStore((s) => s.user);

  const handleSubmit = () => {
    if (!user) return;
    const rl = checkRateLimit(`report-${user.id}`, 5, 300_000);
    if (!rl.allowed) return;
    submitReport(
      type,
      targetType,
      targetId,
      targetLabel,
      user.id,
      user.name,
      description || "بلاغ بدون تفاصيل"
    );
    setDone(true);
    setTimeout(() => {
      setOpen(false);
      setDone(false);
      setDescription("");
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
          <Flag className="size-4" />
          إبلاغ
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إبلاغ عن: {targetLabel}</DialogTitle>
        </DialogHeader>
        {done ? (
          <p className="text-gtr-accent">تم إرسال البلاغ. شكراً لمساعدتك.</p>
        ) : (
          <div className="space-y-4">
            <div>
              <Label>نوع البلاغ</Label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ReportType)}
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              >
                {reportTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>التفاصيل</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 min-h-[80px] w-full rounded-md border border-input bg-transparent p-3 text-sm"
                placeholder="صف المشكلة..."
              />
            </div>
            <Button className="w-full" onClick={handleSubmit} disabled={!user}>
              {user ? "إرسال البلاغ" : "سجّل الدخول أولاً"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

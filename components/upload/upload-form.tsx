"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle, Loader2, Music, Mic2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ar } from "@/lib/i18n/ar";
import { useUploadStore } from "@/lib/store/upload-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { useNotificationsStore } from "@/lib/store/notifications-store";
import {
  validateAudioUpload,
  validateImageUpload,
  compressAudioPlaceholder,
  optimizeImagePlaceholder,
} from "@/lib/security/upload-validation";
import { checkRateLimit, detectSuspiciousActivity } from "@/lib/security/rate-limit";
import { RecaptchaField } from "@/components/auth/recaptcha-field";
import { useSupabaseAuth } from "@/lib/auth/client-auth";
import { canUploadContent } from "@/lib/auth/roles";
import { isDemoModeAllowed, isProductionApp } from "@/lib/config/app-mode";
import { isSupabaseConfigured } from "@/lib/env";
import type { UploadContentType } from "@/types";

const genres = ["خليجي", "مصري", "لبناني", "بوب", "راب", "عربي", "بودكاست"];

export function UploadForm() {
  const addUpload = useUploadStore((s) => s.addUpload);
  const user = useAuthStore((s) => s.user);
  const addNotification = useNotificationsStore((s) => s.add);
  const useSupabase = useSupabaseAuth();
  const [contentType, setContentType] = useState<UploadContentType>("music");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState(user?.name ?? "");
  const [genre, setGenre] = useState(genres[0]);
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [captchaOk, setCaptchaOk] = useState(false);
  const uploadTimes = useRef<number[]>([]);

  const handleFiles = async (audio?: File, image?: File) => {
    const errs: string[] = [];
    if (audio) {
      const v = validateAudioUpload(audio);
      if (!v.valid) errs.push(...v.errors);
      else {
        setProcessing(true);
        await compressAudioPlaceholder(audio);
        setProcessing(false);
      }
    }
    if (image) {
      const v = validateImageUpload(image);
      if (!v.valid) errs.push(...v.errors);
      else await optimizeImagePlaceholder(image);
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaOk) {
      setErrors(["أكمل التحقق الأمني"]);
      return;
    }
    const rl = checkRateLimit("upload-global", 5, 300_000);
    if (!rl.allowed) {
      setErrors(["رفوعات كثيرة — حاول لاحقاً"]);
      return;
    }
    uploadTimes.current.push(Date.now());
    if (detectSuspiciousActivity(uploadTimes.current, 5)) {
      setErrors(["نشاط مشبوه — تم الإيقاف مؤقتاً"]);
      return;
    }
    if (!title.trim() || !artist.trim() || !user) return;

    const audioInput = document.getElementById("audio-file") as HTMLInputElement;
    const imageInput = document.getElementById("cover-file") as HTMLInputElement;
    const audioFile = audioInput?.files?.[0];
    const imageFile = imageInput?.files?.[0];

    if (!audioFile) {
      setErrors(["ملف الصوت مطلوب"]);
      return;
    }

    const ok = await handleFiles(audioFile, imageFile);
    if (!ok) return;

    if (
      (useSupabase || isProductionApp()) &&
      isSupabaseConfigured() &&
      canUploadContent(user.role)
    ) {
      const form = new FormData();
      form.append("title", title);
      form.append("genre", contentType === "podcast" ? "بودكاست" : genre);
      form.append("audio", audioFile);
      if (imageFile) form.append("cover", imageFile);

      const res = await fetch("/api/songs/upload", { method: "POST", body: form });
      if (!res.ok) {
        const j = await res.json();
        setErrors([j.error ?? "فشل الرفع"]);
        return;
      }

      addNotification({
        userId: user.id,
        title: "رفع قيد المراجعة",
        body: "تم رفع الأغنية إلى Supabase للمراجعة",
        type: "moderation",
        href: "/dashboard",
      });
      setTitle("");
      setDescription("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      return;
    }

    if (isProductionApp() || !isDemoModeAllowed()) {
      setErrors(["الرفع يتطلب Supabase — فعّل المفاتيح في .env"]);
      return;
    }

    addUpload({
      type: contentType,
      title,
      artist,
      genre: contentType === "podcast" ? "بودكاست" : genre,
      description: contentType === "podcast" ? description : undefined,
      cover: imageFile ? URL.createObjectURL(imageFile) : undefined,
      uploadedBy: user.id,
      uploadedByName: user.name,
    });

    addNotification({
      userId: user.id,
      title: "رفع قيد المراجعة",
      body: `تم إرسال ${contentType === "music" ? "أغنيتك" : "بودكاستك"} للموافقة`,
      type: "moderation",
      href: "/dashboard",
    });

    setTitle("");
    setDescription("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="size-5 text-primary" />
            {ar.upload.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            يتطلب المحتوى موافقة الإدارة قبل النشر العام
          </p>
        </CardHeader>
        <CardContent>
          <Tabs
            value={contentType}
            onValueChange={(v) => setContentType(v as UploadContentType)}
          >
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="music" className="flex-1 gap-2">
                <Music className="size-4" />
                أغنية
              </TabsTrigger>
              <TabsTrigger value="podcast" className="flex-1 gap-2">
                <Mic2 className="size-4" />
                بودكاست
              </TabsTrigger>
            </TabsList>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{contentType === "music" ? ar.upload.trackTitle : "عنوان الحلقة"}</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>{contentType === "music" ? ar.upload.artistName : "اسم البرنامج"}</Label>
                <Input value={artist} onChange={(e) => setArtist(e.target.value)} required />
              </div>
              {contentType === "music" ? (
                <div className="space-y-2">
                  <Label>{ar.upload.genre}</Label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    {genres.filter((g) => g !== "بودكاست").map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>الوصف</Label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[80px] w-full rounded-md border border-input bg-transparent p-3 text-sm"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="audio-file">ملف الصوت</Label>
                <Input id="audio-file" type="file" accept="audio/*" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover-file">الصورة المصغرة</Label>
                <Input id="cover-file" type="file" accept="image/jpeg,image/png,image/webp" />
              </div>
              <RecaptchaField onVerify={setCaptchaOk} />
              {errors.length > 0 && (
                <ul className="text-sm text-destructive">
                  {errors.map((err) => (
                    <li key={err}>{err}</li>
                  ))}
                </ul>
              )}
              <Button type="submit" className="w-full gap-2" disabled={processing}>
                {processing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    جاري الضغط والرفع...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="size-4" />
                    أُرسل للمراجعة
                  </>
                ) : (
                  <>
                    <Upload className="size-4" />
                    إرسال للمراجعة
                  </>
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}

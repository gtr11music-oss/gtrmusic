"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadForm } from "@/components/upload/upload-form";
import { MonetizationDashboard } from "@/components/monetization/monetization-dashboard";
import { VerificationRequestForm } from "@/components/verification/verification-request-form";
import { ArtistAnalytics } from "@/components/artist/artist-analytics";
import { useAuthStore } from "@/lib/store/auth-store";
import { VerifiedBadge } from "@/components/ui/verified-badge";

export function ArtistDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
          لوحة الفنان
          <VerifiedBadge verified={user?.verified} />
        </h1>
        <p className="text-muted-foreground">مرحباً، {user?.name}</p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="mb-6 flex h-auto flex-wrap gap-1 bg-gtr-surface">
          <TabsTrigger value="upload">رفع محتوى</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          <TabsTrigger value="revenue">الأرباح</TabsTrigger>
          <TabsTrigger value="verify">التوثيق</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <UploadForm />
        </TabsContent>
        <TabsContent value="analytics">
          <ArtistAnalytics />
        </TabsContent>
        <TabsContent value="revenue">
          <MonetizationDashboard />
        </TabsContent>
        <TabsContent value="verify">
          <VerificationRequestForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

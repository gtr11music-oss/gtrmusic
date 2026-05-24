"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminModerationTab } from "@/components/admin/tabs/moderation-tab";
import { AdminRevenueTab } from "@/components/admin/tabs/revenue-tab";
import { AdminAnalyticsTab } from "@/components/admin/tabs/analytics-tab";
import { AdminReportsTab } from "@/components/admin/tabs/reports-tab";
import { AdminCopyrightTab } from "@/components/admin/tabs/copyright-tab";
import { AdminVerificationTab } from "@/components/admin/tabs/verification-tab";
import { AdminUploadsTab } from "@/components/admin/admin-panel";
import { AdminUsersTab } from "@/components/admin/tabs/users-tab";
import { AdminContentTab } from "@/components/admin/tabs/content-tab";

export function AdminDashboard() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="mb-6 text-3xl font-bold">لوحة الإدارة المتقدمة</h1>
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="mb-6 flex h-auto flex-wrap gap-1 bg-gtr-surface">
          <TabsTrigger value="revenue">الإيرادات</TabsTrigger>
          <TabsTrigger value="users">المستخدمون</TabsTrigger>
          <TabsTrigger value="content">المحتوى</TabsTrigger>
          <TabsTrigger value="ads">الإعلانات</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          <TabsTrigger value="reports">البلاغات</TabsTrigger>
          <TabsTrigger value="moderation">المراجعة</TabsTrigger>
          <TabsTrigger value="copyright">حقوق النشر</TabsTrigger>
          <TabsTrigger value="verification">التوثيق</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <AdminUsersTab />
        </TabsContent>
        <TabsContent value="content">
          <AdminContentTab />
        </TabsContent>
        <TabsContent value="revenue">
          <AdminRevenueTab />
        </TabsContent>
        <TabsContent value="ads">
          <div className="space-y-4">
            <p className="text-muted-foreground">إدارة مساحات AdSense والرعاة</p>
            <div className="grid gap-4 md:grid-cols-2">
              {(["banner", "sidebar", "in-feed", "player"] as const).map((p) => (
                <div
                  key={p}
                  className="rounded-lg border border-dashed border-border p-6 text-center text-sm"
                >
                  مساحة {p} — نشطة
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <AdminAnalyticsTab />
        </TabsContent>
        <TabsContent value="reports">
          <AdminReportsTab />
        </TabsContent>
        <TabsContent value="moderation">
          <AdminUploadsTab />
        </TabsContent>
        <TabsContent value="copyright">
          <AdminCopyrightTab />
        </TabsContent>
        <TabsContent value="verification">
          <AdminVerificationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

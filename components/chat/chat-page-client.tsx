"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatInterface } from "@/components/chat/chat-interface";
import { SupportTicketPanel } from "@/components/support/support-ticket-panel";
import { useSupabaseAuth } from "@/lib/auth/client-auth";
import { isDemoModeAllowed, isProductionApp } from "@/lib/config/app-mode";

export function ChatPageClient() {
  const useSupabase = useSupabaseAuth();
  const production = isProductionApp();

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-4 text-2xl font-bold">الدعم والدردشة</h1>
      {useSupabase || production ? (
        isDemoModeAllowed() ? (
          <Tabs defaultValue="support">
            <TabsList className="mb-4">
              <TabsTrigger value="support">تذاكر الدعم</TabsTrigger>
              <TabsTrigger value="community">مجتمع (تجريبي)</TabsTrigger>
            </TabsList>
            <TabsContent value="support">
              <SupportTicketPanel />
            </TabsContent>
            <TabsContent value="community">
              <ChatInterface />
            </TabsContent>
          </Tabs>
        ) : (
          <SupportTicketPanel />
        )
      ) : (
        <ChatInterface />
      )}
    </div>
  );
}

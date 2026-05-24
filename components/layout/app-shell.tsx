import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NowPlayingBar } from "@/components/player/now-playing-bar";
import { AdSlot } from "@/components/ads/ad-slot";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto pb-36 md:pb-28">
          <div className="flex">
            <div className="min-w-0 flex-1">{children}</div>
            <aside className="hidden w-48 shrink-0 p-4 xl:block">
              <div className="sticky top-20">
                <AdSlot placement="sidebar" />
              </div>
            </aside>
          </div>
        </main>
        <MobileNav />
        <NowPlayingBar />
      </div>
    </div>
  );
}

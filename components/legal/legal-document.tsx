import Link from "next/link";
import { Logo } from "@/components/layout/logo";

interface LegalDocumentProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalDocument({ title, lastUpdated, children }: LegalDocumentProps) {
  return (
    <div className="min-h-dvh gtr-gradient">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between p-4">
          <Logo />
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            الرئيسية
          </Link>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-4 py-10 prose prose-invert prose-headings:text-foreground">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">آخر تحديث: {lastUpdated}</p>
        <div className="mt-8 space-y-4 text-muted-foreground leading-relaxed">{children}</div>
      </article>
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <nav className="flex flex-wrap justify-center gap-4">
          <Link href="/legal/privacy">الخصوصية</Link>
          <Link href="/legal/terms">الشروط</Link>
          <Link href="/legal/contact">اتصل بنا</Link>
        </nav>
        <p className="mt-4">© {new Date().getFullYear()} GTRmusic</p>
      </footer>
    </div>
  );
}

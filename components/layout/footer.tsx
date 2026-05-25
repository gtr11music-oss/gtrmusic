import Link from "next/link";

const links = [
  { href: "/legal/privacy", label: "الخصوصية" },
  { href: "/legal/terms", label: "الشروط" },
  { href: "/legal/copyright", label: "حقوق النشر" },
  { href: "/legal/dmca", label: "DMCA" },
  { href: "/legal/community", label: "المجتمع" },
  { href: "/legal/contact", label: "اتصل بنا" },
  { href: "/legal/report", label: "إبلاغ" },
  { href: "/legal/verification", label: "التوثيق" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-sidebar/50 px-4 py-8 md:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
        <p className="font-semibold text-foreground">GTRmusic</p>
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-primary">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} GTRmusic — جاهز للتطبيق الأصلي (Capacitor)
        </p>
      </div>
    </footer>
  );
}

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gtrmusic.com";
  const routes = [
    "",
    "/search",
    "/trending",
    "/playlists",
    "/podcasts",
    "/library",
    "/chat",
    "/premium",
    "/login",
    "/register",
    "/legal/privacy",
    "/legal/terms",
    "/legal/contact",
  ];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.8,
  }));
}

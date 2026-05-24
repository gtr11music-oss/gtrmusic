const memoryCache = new Map<string, { data: unknown; expires: number }>();

export function cacheGet<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function cacheSet(key: string, data: unknown, ttlMs = 300_000) {
  memoryCache.set(key, { data, expires: Date.now() + ttlMs });
}

export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs = 300_000
): Promise<T> {
  const hit = cacheGet<T>(key);
  if (hit) return hit;
  const data = await fetcher();
  cacheSet(key, data, ttlMs);
  return data;
}

/** CDN-ready URL helper */
export function cdnUrl(path: string, base = process.env.NEXT_PUBLIC_CDN_URL ?? ""): string {
  if (!base || path.startsWith("http")) return path;
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

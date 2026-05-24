/** إعدادات تحسين البث والتخزين المؤقت */
export const STREAMING_CONFIG = {
  preload: "metadata" as const,
  bufferAheadSeconds: 30,
  crossOrigin: "anonymous" as const,
};

export function applyStreamingOptimizations(audio: HTMLAudioElement) {
  audio.preload = STREAMING_CONFIG.preload;
  try {
    audio.crossOrigin = STREAMING_CONFIG.crossOrigin;
  } catch {
    /* ignore */
  }
}

export function prefetchAudio(url: string) {
  if (typeof document === "undefined") return;
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "audio";
  link.href = url;
  document.head.appendChild(link);
}

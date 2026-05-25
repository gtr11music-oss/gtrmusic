/** Resolve playback URL — Supabase songs use signed URL API */
export async function resolveAudioUrl(audioUrl: string): Promise<string> {
  const match = audioUrl.match(/^\/api\/songs\/([^/]+)\/play$/);
  if (!match) return audioUrl;

  const res = await fetch(audioUrl);
  if (!res.ok) return audioUrl;
  const json = await res.json();
  return json.url ?? audioUrl;
}

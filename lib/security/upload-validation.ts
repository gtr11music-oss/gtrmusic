const ALLOWED_AUDIO = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/webm"];
const MAX_AUDIO_MB = 50;
const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_MB = 5;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateAudioUpload(file: File): ValidationResult {
  const errors: string[] = [];
  if (!ALLOWED_AUDIO.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|webm)$/i)) {
    errors.push("صيغة الصوت غير مدعومة");
  }
  if (file.size > MAX_AUDIO_MB * 1024 * 1024) {
    errors.push(`حجم الملف يتجاوز ${MAX_AUDIO_MB} ميجابايت`);
  }
  return { valid: errors.length === 0, errors };
}

export function validateImageUpload(file: File): ValidationResult {
  const errors: string[] = [];
  if (!ALLOWED_IMAGE.includes(file.type)) {
    errors.push("صيغة الصورة غير مدعومة (JPEG, PNG, WebP)");
  }
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    errors.push(`حجم الصورة يتجاوز ${MAX_IMAGE_MB} ميجابايت`);
  }
  return { valid: errors.length === 0, errors };
}

/** محاكاة ضغط الصوت — جاهز للربط بـ FFmpeg على الخادم */
export async function compressAudioPlaceholder(file: File): Promise<{ compressed: boolean; size: number }> {
  await new Promise((r) => setTimeout(r, 400));
  return { compressed: true, size: Math.round(file.size * 0.72) };
}

/** محاكاة تحسين الصور */
export async function optimizeImagePlaceholder(file: File): Promise<{ optimized: boolean; size: number }> {
  await new Promise((r) => setTimeout(r, 300));
  return { optimized: true, size: Math.round(file.size * 0.65) };
}

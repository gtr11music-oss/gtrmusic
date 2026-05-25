"use client";

import { useMemo } from "react";
import { useUploadStore } from "@/lib/store/upload-store";
import { buildPublicCatalog } from "@/lib/catalog/public-catalog";
import type { UploadItem } from "@/types";

function filterPublished(uploads: UploadItem[]) {
  return uploads.filter((u) => u.status === "published");
}

/**
 * لا تستخدم getPublished() داخل selector — يُرجع مصفوفة جديدة كل render
 * فيسبب: "getServerSnapshot should be cached to avoid an infinite loop"
 */
export function usePublicCatalog() {
  const uploads = useUploadStore((s) => s.uploads);

  return useMemo(() => buildPublicCatalog(filterPublished(uploads)), [uploads]);
}

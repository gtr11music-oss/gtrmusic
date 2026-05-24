import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedBadge({
  verified,
  className,
  size = "sm",
}: {
  verified?: boolean;
  className?: string;
  size?: "sm" | "md";
}) {
  if (!verified) return null;
  return (
    <BadgeCheck
      className={cn(
        "shrink-0 text-primary",
        size === "sm" ? "size-4" : "size-5",
        className
      )}
      aria-label="حساب موثق"
    />
  );
}

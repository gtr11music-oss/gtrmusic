"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ar } from "@/lib/i18n/ar";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  defaultValue?: string;
  onSubmit?: (query: string) => void;
  compact?: boolean;
  className?: string;
}

export function SearchBar({
  defaultValue = "",
  onSubmit,
  compact,
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={ar.search.placeholder}
        className={cn(
          "bg-muted/50 ps-10 text-start",
          compact ? "h-9 text-sm" : "h-10"
        )}
      />
    </form>
  );
}

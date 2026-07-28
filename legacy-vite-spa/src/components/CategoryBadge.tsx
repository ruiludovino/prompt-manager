import { CATEGORY_ICONS } from "../lib/icons";
import { CATEGORY_COLOR_SWATCH } from "../lib/store";
import type { Category } from "../lib/types";
import { Tag } from "lucide-react";

export function CategoryIconBadge({
  category,
  size = "md",
}: {
  category: Category | undefined;
  size?: "sm" | "md" | "lg";
}) {
  const Icon = category ? CATEGORY_ICONS[category.icon] ?? Tag : Tag;
  const color = category ? CATEGORY_COLOR_SWATCH[category.color] : "#66647a";
  const dims = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconSize = size === "lg" ? 22 : size === "sm" ? 14 : 18;
  return (
    <div
      className={`flex ${dims} shrink-0 items-center justify-center rounded-xl`}
      style={{ backgroundColor: `${color}22`, color }}
    >
      <Icon size={iconSize} strokeWidth={2} />
    </div>
  );
}

export function CategoryPill({ category }: { category: Category | undefined }) {
  const color = category ? CATEGORY_COLOR_SWATCH[category.color] : "#66647a";
  return (
    <span
      className="whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: `${color}22`, color }}
    >
      {category?.name ?? "Uncategorized"}
    </span>
  );
}

export function TagChip({ label }: { label: string }) {
  return (
    <span className="whitespace-nowrap rounded-full border border-border bg-surface-high px-2.5 py-0.5 text-xs text-text-muted">
      #{label}
    </span>
  );
}

import { Tag } from "lucide-react";
import { CATEGORY_ICONS } from "./icons";
import { CATEGORY_COLOR_SWATCH } from "@/lib/types";
import type { CategoryDTO } from "@/lib/types";

type CategoryLike = Pick<CategoryDTO, "name" | "color" | "icon"> | undefined;

export function CategoryIconBadge({
  category,
  size = "md",
}: {
  category: CategoryLike;
  size?: "sm" | "md" | "lg";
}) {
  const Icon = category ? (CATEGORY_ICONS[category.icon] ?? Tag) : Tag;
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

export function CategoryPill({ category }: { category: CategoryLike }) {
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

export function CategoryPills({ categories }: { categories: CategoryDTO[] }) {
  if (categories.length === 0) return <CategoryPill category={undefined} />;
  return (
    <div className="flex flex-wrap gap-1.5">
      {categories.map((c) => (
        <CategoryPill key={c.id} category={c} />
      ))}
    </div>
  );
}

export function TagChip({ label }: { label: string }) {
  return (
    <span className="whitespace-nowrap rounded-full border border-border bg-surface-high px-2.5 py-0.5 text-xs text-text-muted">
      #{label}
    </span>
  );
}

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Palette, Shapes, Trash2, Plus, X } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions";
import { CATEGORY_COLORS, CATEGORY_COLOR_SWATCH } from "@/lib/types";
import type { CategoryColor, CategoryDTO } from "@/lib/types";
import { CategoryIconBadge } from "@/components/CategoryBadge";
import { IconPicker } from "@/components/IconPicker";

function CategoryCard({ category, maxCount }: { category: CategoryDTO; maxCount: number }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [pickingColor, setPickingColor] = useState(false);
  const [pickingIcon, setPickingIcon] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [name, setName] = useState(category.name);

  const usagePct = maxCount === 0 ? 0 : Math.round((category.promptCount / maxCount) * 100);
  const color = CATEGORY_COLOR_SWATCH[category.color];

  const commitName = () => {
    const trimmed = name.trim();
    setRenaming(false);
    if (!trimmed || trimmed === category.name) return;
    startTransition(async () => {
      await updateCategory(category.id, { name: trimmed });
      router.refresh();
    });
  };

  const setColor = (c: CategoryColor) => {
    setPickingColor(false);
    startTransition(async () => {
      await updateCategory(category.id, { color: c });
      router.refresh();
    });
  };

  const setIcon = (icon: string) => {
    setPickingIcon(false);
    startTransition(async () => {
      await updateCategory(category.id, { icon });
      router.refresh();
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteCategory(category.id);
      router.refresh();
    });
  };

  return (
    <div className="group relative rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between">
        <CategoryIconBadge category={category} />
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-md p-1 text-text-faint hover:bg-surface-high hover:text-text"
            aria-label="Category options"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-surface-high shadow-xl">
              <button
                onClick={() => {
                  setRenaming(true);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-muted hover:bg-surface-highest"
              >
                <Pencil size={13} /> Rename
              </button>
              <button
                onClick={() => {
                  setPickingColor(true);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-muted hover:bg-surface-highest"
              >
                <Palette size={13} /> Change Color
              </button>
              <button
                onClick={() => {
                  setPickingIcon(true);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-muted hover:bg-surface-highest"
              >
                <Shapes size={13} /> Change Icon
              </button>
              <button
                onClick={() => {
                  setConfirmingDelete(true);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-surface-highest"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        {renaming ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => e.key === "Enter" && commitName()}
            className="w-full rounded-md border border-primary bg-surface-high px-2 py-1 text-sm text-text focus:outline-none"
          />
        ) : (
          <>
            <h3 className="font-display text-sm font-semibold text-text">{category.name}</h3>
            <button
              onClick={() => setRenaming(true)}
              className="text-text-faint opacity-0 transition group-hover:opacity-100 hover:text-text"
              aria-label="Edit name"
            >
              <Pencil size={12} />
            </button>
          </>
        )}
      </div>

      {pickingColor && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {CATEGORY_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className="h-5 w-5 rounded-full"
              style={{ backgroundColor: CATEGORY_COLOR_SWATCH[c] }}
              aria-label={c}
            />
          ))}
        </div>
      )}

      {pickingIcon && (
        <div className="mt-2">
          <IconPicker value={category.icon} onChange={setIcon} />
        </div>
      )}

      <p className="mt-1 text-xs text-text-faint">{category.description || "No description"}</p>
      <p className="mt-2 text-xs text-text-muted">
        {category.promptCount} prompt{category.promptCount === 1 ? "" : "s"}
      </p>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-highest">
        <div className="h-full rounded-full" style={{ width: `${usagePct}%`, backgroundColor: color }} />
      </div>

      {confirmingDelete && (
        <div className="absolute inset-0 flex flex-col justify-center gap-2 rounded-xl border border-danger/40 bg-bg-raised/95 p-4 text-sm">
          <p className="text-text">
            Delete "{category.name}"? Prompts keep their other categories.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmingDelete(false)}
              className="flex-1 rounded-md border border-border py-1.5 text-text-muted hover:bg-surface-high"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 rounded-md bg-danger py-1.5 font-medium text-white hover:bg-danger/80"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function CategoriesClient({
  categories,
  uncategorizedCount,
}: {
  categories: CategoryDTO[];
  uncategorizedCount: number;
}) {
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState<CategoryColor>("violet");
  const [newIcon, setNewIcon] = useState("Tag");

  const maxCount = Math.max(1, ...categories.map((c) => c.promptCount));

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await createCategory({ name: newName.trim(), color: newColor, icon: newIcon });
    setNewName("");
    setNewIcon("Tag");
    setShowNew(false);
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text">Categories</h1>
          <p className="mt-1 text-sm text-text-muted">Organize your team's prompts into groups</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
        >
          <Plus size={16} />
          New Category
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} maxCount={maxCount} />
        ))}

        {showNew ? (
          <div className="flex flex-col gap-3 rounded-xl border border-dashed border-primary/60 bg-surface p-4">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Category name"
              className="w-full rounded-md border border-border bg-surface-high px-2.5 py-1.5 text-sm text-text placeholder:text-text-faint focus:border-primary focus:outline-none"
            />
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  className="h-6 w-6 rounded-full"
                  style={{
                    backgroundColor: CATEGORY_COLOR_SWATCH[c],
                    outline: newColor === c ? "2px solid white" : "none",
                    outlineOffset: 2,
                  }}
                  aria-label={c}
                />
              ))}
            </div>
            <IconPicker value={newIcon} onChange={setNewIcon} />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover"
              >
                Create
              </button>
              <button
                onClick={() => setShowNew(false)}
                className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-text-muted hover:bg-surface-high"
              >
                <X size={12} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowNew(true)}
            className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-text-faint transition hover:border-primary/50 hover:text-primary"
          >
            <Plus size={22} />
            <span className="text-sm">Add Category</span>
          </button>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4">
        <div>
          <p className="text-sm font-medium text-text">Uncategorized</p>
          <p className="text-xs text-text-faint">{uncategorizedCount} prompts with no category assigned</p>
        </div>
        <Link
          href="/library"
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-muted hover:bg-surface-high hover:text-text"
        >
          Review
        </Link>
      </div>
    </div>
  );
}

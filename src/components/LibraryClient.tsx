"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus, X, LayoutGrid, List, Star } from "lucide-react";
import type { CategoryDTO, PromptDTO } from "@/lib/types";
import { PromptCard } from "./PromptCard";

type SortMode = "recent" | "az" | "most-used";
const PAGE_SIZE = 6;

export function LibraryClient({
  prompts,
  categories,
  favoritesOnly = false,
  initialCategoryId,
}: {
  prompts: PromptDTO[];
  categories: CategoryDTO[];
  favoritesOnly?: boolean;
  initialCategoryId?: string;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("recent");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategoryId ? [initialCategoryId] : [],
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [favOnly, setFavOnly] = useState(favoritesOnly);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const categoryLookup = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    prompts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [prompts]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
    setVisibleCount(PAGE_SIZE);
  };
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    setVisibleCount(PAGE_SIZE);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = prompts.filter((p) => {
      if (favOnly && !p.favorite) return false;
      if (selectedCategories.length && !selectedCategories.includes(p.categoryId ?? "")) return false;
      if (selectedTags.length && !selectedTags.every((t) => p.tags.includes(t))) return false;
      if (q) {
        const haystack = `${p.title} ${p.content} ${p.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sort === "az") result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "most-used") result = [...result].sort((a, b) => b.timesUsed - a.timesUsed);
    else
      result = [...result].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    return result;
  }, [prompts, query, sort, selectedCategories, selectedTags, favOnly]);

  const visible = filtered.slice(0, visibleCount);
  const categoryCount = (id: string) => prompts.filter((p) => p.categoryId === id).length;

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text">
            {favoritesOnly ? "Favorites" : "Prompt Library"}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {filtered.length} prompt{filtered.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/prompts/new"
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
        >
          <Plus size={16} />
          New Prompt
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex min-w-64 flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5">
          <Search size={16} className="text-text-faint" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Search prompts, tags, or content..."
            className="w-full bg-transparent text-sm text-text placeholder:text-text-faint focus:outline-none"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text focus:outline-none"
        >
          <option value="recent">Recently Used</option>
          <option value="az">A-Z</option>
          <option value="most-used">Most Used</option>
        </select>
        <div className="flex overflow-hidden rounded-lg border border-border">
          <button
            onClick={() => setView("grid")}
            className={`p-2.5 ${view === "grid" ? "bg-surface-high text-text" : "text-text-faint"}`}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2.5 ${view === "list" ? "bg-surface-high text-text" : "text-text-faint"}`}
            aria-label="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6 md:flex-row">
        <aside className="w-full shrink-0 space-y-6 md:w-56">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-faint">
              Category
            </h3>
            <div className="space-y-1">
              {categories.map((c) => (
                <label
                  key={c.id}
                  className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm text-text-muted hover:bg-surface-high"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(c.id)}
                      onChange={() => toggleCategory(c.id)}
                      className="accent-primary"
                    />
                    {c.name}
                  </span>
                  <span className="text-xs text-text-faint">{categoryCount(c.id)}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-faint">
              Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((t) => (
                <button key={t} onClick={() => toggleTag(t)}>
                  <span
                    className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs transition ${
                      selectedTags.includes(t)
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border bg-surface-high text-text-muted"
                    }`}
                  >
                    #{t}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-muted">
            <span className="flex items-center gap-2">
              <Star size={14} /> Favorites only
            </span>
            <input
              type="checkbox"
              checked={favOnly}
              onChange={(e) => {
                setFavOnly(e.target.checked);
                setVisibleCount(PAGE_SIZE);
              }}
              className="accent-primary"
            />
          </label>
        </aside>

        <div className="flex-1">
          {(selectedCategories.length > 0 || selectedTags.length > 0 || favOnly) && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {selectedCategories.map((id) => (
                <button
                  key={id}
                  onClick={() => toggleCategory(id)}
                  className="flex items-center gap-1 rounded-full border border-primary bg-primary-soft px-2.5 py-1 text-xs text-primary"
                >
                  {categoryLookup.get(id)?.name} <X size={12} />
                </button>
              ))}
              {selectedTags.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className="flex items-center gap-1 rounded-full border border-primary bg-primary-soft px-2.5 py-1 text-xs text-primary"
                >
                  #{t} <X size={12} />
                </button>
              ))}
              {favOnly && (
                <button
                  onClick={() => setFavOnly(false)}
                  className="flex items-center gap-1 rounded-full border border-primary bg-primary-soft px-2.5 py-1 text-xs text-primary"
                >
                  Favorites <X size={12} />
                </button>
              )}
            </div>
          )}

          {visible.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-text-faint">
              No prompts match your filters.
            </div>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3"
                  : "flex flex-col gap-3"
              }
            >
              {visible.map((p) => (
                <PromptCard key={p.id} prompt={p} category={categoryLookup.get(p.categoryId ?? "")} />
              ))}
            </div>
          )}

          {visibleCount < filtered.length && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-text-muted transition hover:bg-surface-high hover:text-text"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import type { CategoryDTO, PromptDTO } from "@/lib/types";
import { CategoryPill } from "./CategoryBadge";

export function CommandPalette({
  prompts,
  categories,
}: {
  prompts: PromptDTO[];
  categories: CategoryDTO[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return prompts.slice(0, 8);
    return prompts
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      )
      .slice(0, 8);
  }, [prompts, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[12vh]"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search size={17} className="text-text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prompts, tags, or content..."
            className="flex-1 bg-transparent text-sm text-text placeholder:text-text-faint focus:outline-none"
          />
          <button onClick={() => setOpen(false)} className="text-text-faint hover:text-text">
            <X size={16} />
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {results.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-text-faint">No prompts found.</p>
          )}
          {results.map((p) => {
            const category = categories.find((c) => c.id === p.categoryId);
            return (
              <button
                key={p.id}
                onClick={() => {
                  router.push(`/prompts/${p.id}`);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-surface-high"
              >
                <span className="truncate text-text">{p.title}</span>
                <CategoryPill category={category} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

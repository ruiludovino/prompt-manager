"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Check, Star } from "lucide-react";
import type { CategoryDTO, PromptDTO } from "@/lib/types";
import { toggleFavorite, recordUsage } from "@/lib/actions";
import { CategoryPills, TagChip } from "./CategoryBadge";
import { PromptText } from "./PromptText";
import { formatRelativeTime } from "@/lib/format";

export function PromptCard({
  prompt,
  categories,
}: {
  prompt: PromptDTO;
  categories: CategoryDTO[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [favorite, setFavorite] = useState(prompt.favorite);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.content);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    startTransition(async () => {
      await recordUsage(prompt.id);
      router.refresh();
    });
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite((f) => !f);
    startTransition(async () => {
      await toggleFavorite(prompt.id);
      router.refresh();
    });
  };

  return (
    <Link
      href={`/prompts/${prompt.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 transition hover:border-primary/50 hover:bg-surface-high"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-[15px] font-medium leading-snug text-text">
          {prompt.title}
        </h3>
        <CategoryPills categories={categories} />
      </div>

      <div className="rounded-lg border border-border-soft bg-surface-high/60 p-3">
        <PromptText content={prompt.content} className="line-clamp-3 text-text-muted" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {prompt.tags.map((t) => (
          <TagChip key={t} label={t} />
        ))}
      </div>

      <div className="mt-1 flex items-center justify-between border-t border-border-soft pt-3 text-xs text-text-faint">
        <span>Last used: {formatRelativeTime(prompt.lastUsedAt)}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleFavorite}
            aria-label="Toggle favorite"
            className="rounded-md p-1.5 text-text-faint transition hover:bg-surface-highest hover:text-amber-400"
          >
            <Star size={15} className={favorite ? "fill-amber-400 text-amber-400" : ""} />
          </button>
          <button
            onClick={handleCopy}
            aria-label="Copy prompt"
            className="rounded-md p-1.5 text-text-faint transition hover:bg-surface-highest hover:text-secondary"
          >
            {copied ? <Check size={15} className="text-success" /> : <Copy size={15} />}
          </button>
        </div>
      </div>
    </Link>
  );
}

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Check, Pencil, Copy as DuplicateIcon, Star, Trash2 } from "lucide-react";
import { toggleFavorite, recordUsage, duplicatePrompt, deletePrompt } from "@/lib/actions";

export function PromptDetailActions({
  promptId,
  content,
  isOwner,
  initialFavorite,
}: {
  promptId: string;
  content: string;
  isOwner: boolean;
  initialFavorite: boolean;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [favorite, setFavorite] = useState(initialFavorite);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    startTransition(async () => {
      await recordUsage(promptId);
      router.refresh();
    });
  };

  const handleFavorite = () => {
    setFavorite((f) => !f);
    startTransition(async () => {
      await toggleFavorite(promptId);
      router.refresh();
    });
  };

  const handleDuplicate = () => {
    startTransition(async () => {
      const newId = await duplicatePrompt(promptId);
      router.push(`/prompts/${newId}`);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deletePrompt(promptId);
      router.push("/library");
    });
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied" : "Copy Prompt"}
        </button>
        {isOwner && (
          <Link
            href={`/prompts/${promptId}/edit`}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-text-muted transition hover:bg-surface-high hover:text-text"
          >
            <Pencil size={15} />
            Edit
          </Link>
        )}
        <button
          onClick={handleDuplicate}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-text-muted transition hover:bg-surface-high hover:text-text"
        >
          <DuplicateIcon size={15} />
          Duplicate
        </button>
        <button
          onClick={handleFavorite}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-muted transition hover:bg-surface-high hover:text-text"
          aria-label="Toggle favorite"
        >
          <Star size={15} className={favorite ? "fill-amber-400 text-amber-400" : ""} />
        </button>
        {isOwner && (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="flex items-center gap-1.5 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger transition hover:bg-danger/20"
            aria-label="Delete prompt"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {confirmingDelete && (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm">
          <span className="text-text">Delete this prompt? This can't be undone.</span>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmingDelete(false)}
              className="rounded-md border border-border px-3 py-1.5 text-text-muted hover:bg-surface-high"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="rounded-md bg-danger px-3 py-1.5 font-medium text-white hover:bg-danger/80"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </>
  );
}

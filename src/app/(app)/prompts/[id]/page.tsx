import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Cpu, History, Lightbulb, Users } from "lucide-react";
import { auth } from "@/auth";
import { getPrompt, getCategories } from "@/lib/data";
import { CategoryPill, TagChip } from "@/components/CategoryBadge";
import { PromptText } from "@/components/PromptText";
import { PromptDetailActions } from "@/components/PromptDetailActions";
import { formatDate, formatRelativeTime } from "@/lib/format";

export default async function PromptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const [prompt, categories] = await Promise.all([getPrompt(id, userId), getCategories()]);
  if (!prompt) notFound();

  const category = categories.find((c) => c.id === prompt.categoryId);

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="flex items-center gap-1.5 text-sm text-text-faint">
        <Link href="/library" className="hover:text-text-muted">
          Library
        </Link>
        <ChevronRight size={14} />
        <span>{category?.name ?? "Uncategorized"}</span>
        <ChevronRight size={14} />
        <span className="text-text-muted">{prompt.title}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-semibold text-text">{prompt.title}</h1>
            <CategoryPill category={category} />
            {prompt.visibility === "team" && (
              <span className="flex items-center gap-1 rounded-full border border-secondary/40 bg-secondary-soft px-2.5 py-1 text-xs text-secondary">
                <Users size={12} /> Team Shared
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {prompt.tags.map((t) => (
              <TagChip key={t} label={t} />
            ))}
          </div>
          {!prompt.isOwner && (
            <p className="mt-2 text-xs text-text-faint">Shared by {prompt.ownerName ?? "a teammate"}</p>
          )}
        </div>

        <PromptDetailActions
          promptId={prompt.id}
          content={prompt.content}
          isOwner={prompt.isOwner}
          initialFavorite={prompt.favorite}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-surface-high/60 p-5">
            <PromptText content={prompt.content} className="text-text" />
          </div>

          {Object.keys(prompt.variableNotes).length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-sm font-semibold text-text">Variables</h2>
              <div className="mt-3 space-y-2">
                {Object.entries(prompt.variableNotes).map(([name, desc]) => (
                  <div key={name} className="flex items-start gap-3 text-sm">
                    <code className="shrink-0 rounded bg-secondary-soft px-1.5 py-0.5 font-mono text-xs text-secondary">
                      {`{{${name}}}`}
                    </code>
                    <span className="text-text-muted">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {prompt.notes && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-text">
                <Lightbulb size={15} className="text-amber-400" />
                Notes &amp; Usage Tips
              </h2>
              <p className="mt-2 text-sm text-text-muted">{prompt.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-text">
              <Cpu size={15} className="text-primary" />
              Recommended Settings
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-faint">Model</dt>
                <dd className="text-text">{prompt.model}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-faint">Temperature</dt>
                <dd className="text-text">{prompt.temperature}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-faint">Max Tokens</dt>
                <dd className="text-text">{prompt.maxTokens}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-faint">Visibility</dt>
                <dd className="text-text capitalize">{prompt.visibility}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="font-display text-sm font-semibold text-text">Metadata</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-faint">Created</dt>
                <dd className="text-text">{formatDate(prompt.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-faint">Last edited</dt>
                <dd className="text-text">{formatRelativeTime(prompt.updatedAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-faint">Times used</dt>
                <dd className="text-text">{prompt.timesUsed}</dd>
              </div>
            </dl>
            <button
              disabled
              className="mt-3 flex items-center gap-1.5 text-xs text-text-faint"
              title="Coming soon"
            >
              <History size={13} />
              Version history (coming soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

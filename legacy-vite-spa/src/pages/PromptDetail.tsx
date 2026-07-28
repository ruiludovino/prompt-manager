import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight,
  Copy,
  Check,
  Pencil,
  Copy as DuplicateIcon,
  Star,
  Trash2,
  Cpu,
  History,
  Lightbulb,
} from "lucide-react";
import { useStore } from "../lib/store";
import { CategoryPill, TagChip } from "../components/CategoryBadge";
import { PromptText } from "../components/PromptText";
import { formatDate, formatRelativeTime } from "../lib/format";

export function PromptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const prompt = useStore((s) => s.prompts.find((p) => p.id === id));
  const category = useStore((s) => s.categories.find((c) => c.id === prompt?.categoryId));
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const recordUsage = useStore((s) => s.recordUsage);
  const duplicatePrompt = useStore((s) => s.duplicatePrompt);
  const deletePrompt = useStore((s) => s.deletePrompt);

  const [copied, setCopied] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (!prompt) {
    return (
      <div className="mx-auto max-w-3xl px-8 py-16 text-center">
        <p className="text-text-muted">Prompt not found.</p>
        <Link to="/library" className="mt-3 inline-block text-primary hover:underline">
          Back to Library
        </Link>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
    } catch {
      /* clipboard unavailable */
    }
    recordUsage(prompt.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDuplicate = () => {
    const copy = duplicatePrompt(prompt.id);
    if (copy) navigate(`/prompts/${copy.id}`);
  };

  const handleDelete = () => {
    deletePrompt(prompt.id);
    navigate("/library");
  };

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="flex items-center gap-1.5 text-sm text-text-faint">
        <Link to="/library" className="hover:text-text-muted">
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
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {prompt.tags.map((t) => (
              <TagChip key={t} label={t} />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy Prompt"}
          </button>
          <Link
            to={`/prompts/${prompt.id}/edit`}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-text-muted transition hover:bg-surface-high hover:text-text"
          >
            <Pencil size={15} />
            Edit
          </Link>
          <button
            onClick={handleDuplicate}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-text-muted transition hover:bg-surface-high hover:text-text"
          >
            <DuplicateIcon size={15} />
            Duplicate
          </button>
          <button
            onClick={() => toggleFavorite(prompt.id)}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-muted transition hover:bg-surface-high hover:text-text"
            aria-label="Toggle favorite"
          >
            <Star size={15} className={prompt.favorite ? "fill-amber-400 text-amber-400" : ""} />
          </button>
          <button
            onClick={() => setConfirmingDelete(true)}
            className="flex items-center gap-1.5 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger transition hover:bg-danger/20"
            aria-label="Delete prompt"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {confirmingDelete && (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm">
          <span className="text-text">Delete "{prompt.title}"? This can't be undone.</span>
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
            <button className="mt-3 flex items-center gap-1.5 text-xs text-primary hover:underline">
              <History size={13} />
              View version history
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

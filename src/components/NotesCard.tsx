"use client";

import { useState } from "react";
import { Copy, Check, Lightbulb } from "lucide-react";

export function NotesCard({ notes }: { notes: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(notes);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-text">
          <Lightbulb size={15} className="text-amber-400" />
          Notes &amp; Usage Tips
        </h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-text-muted transition hover:bg-surface-high hover:text-text"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="mt-3 whitespace-pre-wrap break-words rounded-lg border border-border bg-surface-high/60 p-4 font-mono text-[13px] leading-relaxed text-text-muted">
        {notes}
      </pre>
    </div>
  );
}

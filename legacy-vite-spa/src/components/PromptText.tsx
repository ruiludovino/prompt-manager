interface PromptTextProps {
  content: string;
  className?: string;
}

export function PromptText({ content, className = "" }: PromptTextProps) {
  const parts = content.split(/(\{\{\s*[a-zA-Z0-9_]+\s*\}\})/g);
  return (
    <pre
      className={`whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed ${className}`}
    >
      {parts.map((part, i) => {
        if (/^\{\{\s*[a-zA-Z0-9_]+\s*\}\}$/.test(part)) {
          return (
            <span
              key={i}
              className="rounded bg-secondary-soft px-1 py-0.5 text-secondary"
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </pre>
  );
}

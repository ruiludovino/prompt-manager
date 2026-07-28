import { CATEGORY_ICONS, CATEGORY_ICON_NAMES } from "./icons";

export function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (icon: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {CATEGORY_ICON_NAMES.map((name) => {
        const Icon = CATEGORY_ICONS[name];
        const selected = value === name;
        return (
          <button
            key={name}
            onClick={() => onChange(name)}
            aria-label={name}
            className={`flex h-7 w-7 items-center justify-center rounded-md border transition ${
              selected
                ? "border-primary bg-primary-soft text-primary"
                : "border-border bg-surface-high text-text-muted hover:bg-surface-highest"
            }`}
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
}

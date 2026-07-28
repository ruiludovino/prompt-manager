import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Library,
  FolderKanban,
  Star,
  BookOpen,
  Plus,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/library", label: "Library", icon: Library, end: false },
  { to: "/categories", label: "Categories", icon: FolderKanban, end: false },
  { to: "/favorites", label: "Favorites", icon: Star, end: false },
  { to: "/tips", label: "Tips & Best Practices", icon: BookOpen, end: false },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-bg-raised">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
          <Sparkles size={17} strokeWidth={2.25} />
        </div>
        <span className="font-display text-[17px] font-semibold tracking-tight text-text">
          PromptVault
        </span>
      </div>

      <div className="px-3">
        <NavLink
          to="/prompts/new"
          className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(139,92,246,0.4)] transition hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]"
        >
          <Plus size={16} />
          New Prompt
        </NavLink>
      </div>

      <nav className="mt-5 flex flex-1 flex-col gap-0.5 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg border-l-2 px-3 py-2 text-sm transition ${
                isActive
                  ? "border-primary bg-primary-soft font-medium text-text"
                  : "border-transparent text-text-muted hover:bg-surface-high hover:text-text"
              }`
            }
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border-soft px-4 py-4 text-xs text-text-faint">
        <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono">
          Ctrl
        </kbd>{" "}
        +{" "}
        <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono">
          K
        </kbd>{" "}
        to search prompts
      </div>
    </aside>
  );
}

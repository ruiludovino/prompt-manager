"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  FolderKanban,
  Star,
  BookOpen,
  Plus,
  Sparkles,
} from "lucide-react";
import { SignOutButton } from "./SignOutButton";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/library", label: "Library", icon: Library },
  { href: "/categories", label: "Categories", icon: FolderKanban },
  { href: "/favorites", label: "Favorites", icon: Star },
  { href: "/tips", label: "Tips & Best Practices", icon: BookOpen },
];

export function Sidebar({
  user,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null };
}) {
  const pathname = usePathname();

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
        <Link
          href="/prompts/new"
          className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(139,92,246,0.4)] transition hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]"
        >
          <Plus size={16} />
          New Prompt
        </Link>
      </div>

      <nav className="mt-5 flex flex-1 flex-col gap-0.5 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg border-l-2 px-3 py-2 text-sm transition ${
                isActive
                  ? "border-primary bg-primary-soft font-medium text-text"
                  : "border-transparent text-text-muted hover:bg-surface-high hover:text-text"
              }`}
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border-soft px-4 py-3 text-xs text-text-faint">
        <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono">
          Ctrl
        </kbd>{" "}
        + <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono">K</kbd>{" "}
        to search prompts
      </div>

      <div className="flex items-center gap-2 border-t border-border-soft px-4 py-3">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "User"}
            width={28}
            height={28}
            className="rounded-full"
          />
        ) : (
          <div className="h-7 w-7 rounded-full bg-surface-highest" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-text">{user.name ?? "You"}</p>
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}

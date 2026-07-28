import { Link } from "react-router-dom";
import { FileText, FolderKanban, Star, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { useStore } from "../lib/store";
import { PromptCard } from "../components/PromptCard";
import { CategoryIconBadge } from "../components/CategoryBadge";

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof FileText;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Icon size={19} />
      </div>
      <div>
        <p className="font-display text-2xl font-semibold text-text">{value}</p>
        <p className="text-xs text-text-muted">
          {label}
          {hint && <span className="ml-1 text-success">{hint}</span>}
        </p>
      </div>
    </div>
  );
}

export function Dashboard() {
  const prompts = useStore((s) => s.prompts);
  const categories = useStore((s) => s.categories);

  const favoritesCount = prompts.filter((p) => p.favorite).length;
  const weekAgo = Date.now() - 7 * 86400000;
  const usedThisWeek = prompts.filter(
    (p) => p.lastUsedAt && new Date(p.lastUsedAt).getTime() >= weekAgo,
  ).length;

  const recent = [...prompts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const categoryCounts = categories.map((c) => ({
    category: c,
    count: prompts.filter((p) => p.categoryId === c.id).length,
  }));

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="glow-violet -mx-8 -mt-8 mb-6 rounded-b-2xl px-8 pb-6 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-text">Welcome back, Alex</h1>
            <p className="mt-1 text-sm text-text-muted">
              Here's what's happening in your prompt library today.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={FileText} label="Total Prompts" value={prompts.length} hint="+12%" />
        <StatCard icon={FolderKanban} label="Categories" value={categories.length} />
        <StatCard icon={Star} label="Favorites" value={favoritesCount} />
        <StatCard icon={TrendingUp} label="Used This Week" value={usedThisWeek} />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-text">Recent Prompts</h2>
        <Link to="/library" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {recent.map((p) => (
          <PromptCard key={p.id} prompt={p} />
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-text">Browse by Category</h2>
        <Link to="/categories" className="text-sm text-primary hover:underline">
          Manage categories
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {categoryCounts.map(({ category, count }) => (
          <Link
            key={category.id}
            to={`/library?category=${category.id}`}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5 transition hover:border-primary/50 hover:bg-surface-high"
          >
            <CategoryIconBadge category={category} size="sm" />
            <div>
              <p className="text-sm font-medium text-text">{category.name}</p>
              <p className="text-xs text-text-faint">{count} prompts</p>
            </div>
          </Link>
        ))}
      </div>

      <Link
        to="/tips"
        className="glow-cyan mt-10 flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4 transition hover:border-secondary/50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-soft text-secondary">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-text">Master Prompt Engineering</p>
            <p className="text-xs text-text-muted">
              Learn techniques to get better results from every prompt.
            </p>
          </div>
        </div>
        <ArrowRight size={18} className="text-text-faint" />
      </Link>
    </div>
  );
}

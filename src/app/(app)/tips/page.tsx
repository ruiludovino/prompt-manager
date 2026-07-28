"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, FilePlus2, FolderTree, Braces, X, ArrowRight } from "lucide-react";

const GETTING_STARTED = [
  {
    title: "Create your first prompt",
    description: "Click \"New Prompt\" and write your instructions using clear, direct language.",
    icon: FilePlus2,
  },
  {
    title: "Organize with categories & tags",
    description: "Group related prompts into categories and add tags so you can find them fast.",
    icon: FolderTree,
  },
  {
    title: "Reuse variables for flexibility",
    description: "Wrap fill-in slots in {{double curly braces}} to make one prompt work for many inputs.",
    icon: Braces,
  },
];

interface Technique {
  id: string;
  title: string;
  explanation: string;
  before: string;
  after: string;
}

const TECHNIQUES: Technique[] = [
  {
    id: "specific-context",
    title: "Be Specific & Give Context",
    explanation:
      "Vague prompts produce vague answers. Give the model the background it needs to make good decisions.",
    before: "Write something about our product launch.",
    after:
      "Write a 150-word LinkedIn post announcing our Series B product launch, targeting enterprise IT buyers, emphasizing 40% faster onboarding.",
  },
  {
    id: "output-format",
    title: "Define the Output Format",
    explanation: "Tell the model exactly how to structure its response so you can use it immediately.",
    before: "Give me some ideas for the roadmap.",
    after: "List 5 roadmap ideas as a markdown table with columns: Idea, Impact (1-5), Effort (1-5), Owner.",
  },
  {
    id: "role-prompting",
    title: "Use Role Prompting",
    explanation: "Assigning a persona sharpens tone, vocabulary, and the kind of judgment calls the model makes.",
    before: "Review this contract clause.",
    after:
      "Act as a senior contracts lawyer. Review this clause for ambiguity, one-sided terms, and missing definitions.",
  },
  {
    id: "few-shot",
    title: "Give Examples (Few-Shot)",
    explanation: "Show 1-3 examples of the input/output pattern you want; models imitate structure well.",
    before: "Classify these support tickets by urgency.",
    after:
      'Classify tickets by urgency. Example: "App won\'t open" -> High. "Where\'s the invite button?" -> Low. Now classify: ...',
  },
  {
    id: "break-steps",
    title: "Break Complex Tasks into Steps",
    explanation: "Ask the model to reason in stages instead of jumping straight to a final answer.",
    before: "Plan our Q3 marketing strategy.",
    after:
      "First list our Q2 learnings. Then propose 3 Q3 themes. Then for the strongest theme, draft a 4-week campaign plan.",
  },
  {
    id: "constraints",
    title: "Set Constraints (length, tone, format)",
    explanation: "Explicit limits keep output usable and consistent across runs.",
    before: "Summarize this article.",
    after: "Summarize this article in 3 bullet points, under 20 words each, in a neutral, factual tone.",
  },
];

const MISTAKES = [
  "Vague instructions with no goal or audience specified",
  "No examples when the desired output has a specific structure",
  "Overloading one prompt with too many unrelated tasks",
  "Forgetting to specify the output format you actually need",
  "Reusing a prompt across contexts without adjusting its variables",
];

const SECTIONS = [
  { id: "getting-started", label: "Getting Started" },
  { id: "structure", label: "Prompt Structure" },
  { id: "variables", label: "Using Variables" },
  { id: "techniques", label: "Advanced Techniques" },
  { id: "mistakes", label: "Common Mistakes" },
];

export default function TipsPage() {
  const [query, setQuery] = useState("");

  const filteredTechniques = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TECHNIQUES;
    return TECHNIQUES.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.explanation.toLowerCase().includes(q) ||
        t.before.toLowerCase().includes(q) ||
        t.after.toLowerCase().includes(q),
    );
  }, [query]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <div className="glow-violet -mx-8 -mt-8 rounded-b-2xl px-8 pb-8 pt-10 text-center">
        <h1 className="font-display text-3xl font-semibold text-text">
          Master the Art of Prompt Engineering
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-text-muted">
          Practical techniques to get better, more consistent results from AI models.
        </p>
        <div className="mx-auto mt-5 flex max-w-md items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5">
          <Search size={16} className="text-text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tips..."
            className="w-full bg-transparent text-sm text-text placeholder:text-text-faint focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-text-faint hover:text-text">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-text-muted transition hover:border-primary/50 hover:text-text"
          >
            {s.label}
          </button>
        ))}
      </div>

      <section id="getting-started" className="mt-12 scroll-mt-6">
        <h2 className="font-display text-lg font-semibold text-text">
          Getting Started with PromptVault
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {GETTING_STARTED.map((step, i) => (
            <div key={step.title} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-sm font-semibold text-primary">
                {i + 1}
              </div>
              <h3 className="mt-3 flex items-center gap-2 font-display text-sm font-semibold text-text">
                <step.icon size={15} className="text-text-muted" />
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="structure" className="mt-12 scroll-mt-6">
        <h2 id="variables" className="scroll-mt-6 font-display text-lg font-semibold text-text">
          Core Prompt Engineering Techniques
        </h2>
        <div id="techniques" className="mt-4 grid scroll-mt-6 grid-cols-1 gap-5 md:grid-cols-2">
          {filteredTechniques.map((t) => (
            <div key={t.id} className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-display text-[15px] font-semibold text-text">{t.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{t.explanation}</p>
              <div className="mt-3 space-y-2">
                <div className="rounded-lg border border-danger/30 bg-danger/10 p-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-danger">
                    Before
                  </p>
                  <p className="font-mono text-xs leading-relaxed text-text-muted">{t.before}</p>
                </div>
                <div className="rounded-lg border border-success/30 bg-success/10 p-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-success">
                    After
                  </p>
                  <p className="font-mono text-xs leading-relaxed text-text">{t.after}</p>
                </div>
              </div>
            </div>
          ))}
          {filteredTechniques.length === 0 && (
            <p className="text-sm text-text-faint md:col-span-2">No techniques match your search.</p>
          )}
        </div>
      </section>

      <section id="mistakes" className="mt-12 scroll-mt-6">
        <h2 className="font-display text-lg font-semibold text-text">Common Mistakes to Avoid</h2>
        <ul className="mt-4 space-y-2">
          {MISTAKES.map((m) => (
            <li
              key={m}
              className="flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-muted"
            >
              <X size={15} className="mt-0.5 shrink-0 text-danger" />
              {m}
            </li>
          ))}
        </ul>
      </section>

      <Link
        href="/prompts/new"
        className="glow-cyan mt-12 mb-4 flex items-center justify-between rounded-xl border border-border bg-surface px-6 py-5 transition hover:border-secondary/50"
      >
        <div>
          <p className="font-display text-base font-semibold text-text">
            Ready to put this into practice?
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Create a new prompt and apply what you've learned.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">
          Create a New Prompt <ArrowRight size={15} />
        </span>
      </Link>
    </div>
  );
}

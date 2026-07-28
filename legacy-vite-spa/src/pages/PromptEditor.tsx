import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Braces, Lightbulb, Plus, X } from "lucide-react";
import { useStore, CATEGORY_COLOR_SWATCH } from "../lib/store";
import { AI_MODELS, extractVariables, type CategoryColor, type Visibility } from "../lib/types";
import { PromptText } from "../components/PromptText";

const COLOR_OPTIONS = Object.keys(CATEGORY_COLOR_SWATCH) as CategoryColor[];

export function PromptEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const categories = useStore((s) => s.categories);
  const addCategory = useStore((s) => s.addCategory);
  const addPrompt = useStore((s) => s.addPrompt);
  const updatePrompt = useStore((s) => s.updatePrompt);
  const existing = useStore((s) => s.prompts.find((p) => p.id === id));

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [categoryId, setCategoryId] = useState<string | null>(existing?.categoryId ?? null);
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [model, setModel] = useState(existing?.model ?? AI_MODELS[0]);
  const [temperature, setTemperature] = useState(existing?.temperature ?? 0.7);
  const [maxTokens, setMaxTokens] = useState(existing?.maxTokens ?? 1500);
  const [visibility, setVisibility] = useState<Visibility>(existing?.visibility ?? "private");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [variableNotes, setVariableNotes] = useState<Record<string, string>>(
    existing?.variableNotes ?? {},
  );
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState<CategoryColor>("violet");

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setContent(existing.content);
      setCategoryId(existing.categoryId);
      setTags(existing.tags);
      setModel(existing.model);
      setTemperature(existing.temperature);
      setMaxTokens(existing.maxTokens);
      setVisibility(existing.visibility);
      setNotes(existing.notes);
      setVariableNotes(existing.variableNotes);
    }
  }, [existing]);

  const detectedVariables = useMemo(() => extractVariables(content), [content]);

  const insertVariable = () => {
    const textarea = textareaRef.current;
    const snippet = "{{variable_name}}";
    if (!textarea) {
      setContent((c) => c + snippet);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const next = content.slice(0, start) + snippet + content.slice(end);
    setContent(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
    });
  };

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  };
  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t));

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    const category = addCategory({
      name: newCategoryName.trim(),
      description: "",
      color: newCategoryColor,
      icon: "",
    });
    setCategoryId(category.id);
    setShowNewCategory(false);
    setNewCategoryName("");
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    const payload = {
      title: title.trim(),
      content,
      categoryId,
      tags,
      favorite: existing?.favorite ?? false,
      model,
      temperature,
      maxTokens,
      visibility,
      variableNotes,
      notes,
    };
    if (isEditing && existing) {
      updatePrompt(existing.id, payload);
      navigate(`/prompts/${existing.id}`);
    } else {
      const created = addPrompt(payload);
      navigate(`/prompts/${created.id}`);
    }
  };

  const handleCancel = () => {
    if (isEditing && existing) navigate(`/prompts/${existing.id}`);
    else navigate("/library");
  };

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-text">
          {isEditing ? "Edit Prompt" : "Create New Prompt"}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            className="rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-text-muted transition hover:bg-surface-high"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
          >
            Save Prompt
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., SEO Blog Post Optimizer"
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 font-display text-lg text-text placeholder:text-text-faint focus:border-primary focus:outline-none"
          />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex gap-1 rounded-lg border border-border p-0.5">
                <button
                  onClick={() => setMode("write")}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                    mode === "write" ? "bg-surface-high text-text" : "text-text-faint"
                  }`}
                >
                  Write
                </button>
                <button
                  onClick={() => setMode("preview")}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                    mode === "preview" ? "bg-surface-high text-text" : "text-text-faint"
                  }`}
                >
                  Preview
                </button>
              </div>
              <button
                onClick={insertVariable}
                className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-text-muted hover:bg-surface-high"
              >
                <Braces size={13} />
                Insert Variable
              </button>
            </div>

            {mode === "write" ? (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your prompt here. Use {{variable_name}} for fill-in slots..."
                rows={14}
                className="w-full rounded-lg border border-border bg-surface-high/60 p-4 font-mono text-[13px] leading-relaxed text-text placeholder:text-text-faint focus:border-primary focus:outline-none"
              />
            ) : (
              <div className="min-h-[20rem] rounded-lg border border-border bg-surface-high/60 p-4">
                <PromptText content={content || "Nothing to preview yet."} className="text-text" />
              </div>
            )}
          </div>

          {detectedVariables.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-4">
              <h2 className="font-display text-sm font-semibold text-text">
                Detected Variables
              </h2>
              <div className="mt-3 space-y-2">
                {detectedVariables.map((v) => (
                  <div key={v} className="flex items-center gap-3">
                    <code className="shrink-0 rounded bg-secondary-soft px-1.5 py-0.5 font-mono text-xs text-secondary">
                      {`{{${v}}}`}
                    </code>
                    <input
                      value={variableNotes[v] ?? ""}
                      onChange={(e) =>
                        setVariableNotes((prev) => ({ ...prev, [v]: e.target.value }))
                      }
                      placeholder="Describe what goes here..."
                      className="flex-1 rounded-md border border-border bg-surface-high px-2.5 py-1.5 text-sm text-text placeholder:text-text-faint focus:border-primary focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border bg-surface p-4">
            <h2 className="font-display text-sm font-semibold text-text">Notes &amp; Usage Tips</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any tips for getting the best results from this prompt..."
              className="mt-2 w-full rounded-md border border-border bg-surface-high px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-surface p-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-text-faint">
              Category
            </label>
            <select
              value={categoryId ?? ""}
              onChange={(e) => {
                if (e.target.value === "__new") setShowNewCategory(true);
                else setCategoryId(e.target.value || null);
              }}
              className="mt-2 w-full rounded-md border border-border bg-surface-high px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
            >
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
              <option value="__new">+ Create new category</option>
            </select>

            {showNewCategory && (
              <div className="mt-3 space-y-2 rounded-md border border-border-soft bg-surface-high p-3">
                <input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name"
                  className="w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-text placeholder:text-text-faint focus:border-primary focus:outline-none"
                />
                <div className="flex flex-wrap gap-1.5">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewCategoryColor(c)}
                      className="h-6 w-6 rounded-full"
                      style={{
                        backgroundColor: CATEGORY_COLOR_SWATCH[c],
                        outline: newCategoryColor === c ? "2px solid white" : "none",
                        outlineOffset: 2,
                      }}
                      aria-label={c}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateCategory}
                    className="rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-white hover:bg-primary-hover"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowNewCategory(false)}
                    className="rounded-md border border-border px-2.5 py-1.5 text-xs text-text-muted hover:bg-surface-highest"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-text-faint">
              Tags
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 rounded-full border border-border bg-surface-high px-2.5 py-0.5 text-xs text-text-muted"
                >
                  #{t}
                  <button onClick={() => removeTag(t)} aria-label={`Remove ${t}`}>
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag..."
                className="flex-1 rounded-md border border-border bg-surface-high px-2.5 py-1.5 text-sm text-text placeholder:text-text-faint focus:border-primary focus:outline-none"
              />
              <button
                onClick={addTag}
                className="rounded-md border border-border p-1.5 text-text-muted hover:bg-surface-highest"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-text-faint">
              Recommended Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-2 w-full rounded-md border border-border bg-surface-high px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
            >
              {AI_MODELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-text-faint">
                <span>Temperature</span>
                <span>{temperature.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="mt-1 w-full accent-primary"
              />
            </div>

            <div className="mt-4">
              <label className="text-xs text-text-faint">Max Tokens</label>
              <input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-border bg-surface-high px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-text-faint">
              Visibility
            </label>
            <div className="mt-2 flex rounded-lg border border-border p-0.5">
              {(["private", "team"] as Visibility[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setVisibility(v)}
                  className={`flex-1 rounded-md py-1.5 text-xs font-medium capitalize transition ${
                    visibility === v ? "bg-surface-high text-text" : "text-text-faint"
                  }`}
                >
                  {v === "team" ? "Team Shared" : "Private"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-border-soft bg-secondary-soft p-4 text-xs text-text-muted">
            <Lightbulb size={15} className="mt-0.5 shrink-0 text-secondary" />
            <span>
              Tip: Use <code className="text-secondary">{"{{double curly braces}}"}</code> to
              mark variables users will fill in. See{" "}
              <a href="#/tips" className="text-secondary hover:underline">
                Tips &amp; Best Practices
              </a>{" "}
              for more.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

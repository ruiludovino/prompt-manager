import { create } from "zustand";
import { persist } from "zustand/middleware";
import { seedCategories, seedPrompts } from "./seed";
import type { Category, CategoryColor, Prompt } from "./types";

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

interface StoreState {
  categories: Category[];
  prompts: Prompt[];

  addCategory: (data: Omit<Category, "id">) => Category;
  updateCategory: (id: string, data: Partial<Omit<Category, "id">>) => void;
  deleteCategory: (id: string) => void;

  addPrompt: (
    data: Omit<
      Prompt,
      "id" | "createdAt" | "updatedAt" | "timesUsed" | "lastUsedAt"
    >,
  ) => Prompt;
  updatePrompt: (id: string, data: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  duplicatePrompt: (id: string) => Prompt | undefined;
  toggleFavorite: (id: string) => void;
  recordUsage: (id: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      categories: seedCategories,
      prompts: seedPrompts,

      addCategory: (data) => {
        const category: Category = { ...data, id: makeId("cat") };
        set((s) => ({ categories: [...s.categories, category] }));
        return category;
      },
      updateCategory: (id, data) => {
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }));
      },
      deleteCategory: (id) => {
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== id),
          prompts: s.prompts.map((p) =>
            p.categoryId === id ? { ...p, categoryId: null } : p,
          ),
        }));
      },

      addPrompt: (data) => {
        const nowIso = new Date().toISOString();
        const prompt: Prompt = {
          ...data,
          id: makeId("p"),
          createdAt: nowIso,
          updatedAt: nowIso,
          timesUsed: 0,
          lastUsedAt: null,
        };
        set((s) => ({ prompts: [prompt, ...s.prompts] }));
        return prompt;
      },
      updatePrompt: (id, data) => {
        set((s) => ({
          prompts: s.prompts.map((p) =>
            p.id === id
              ? { ...p, ...data, updatedAt: new Date().toISOString() }
              : p,
          ),
        }));
      },
      deletePrompt: (id) => {
        set((s) => ({ prompts: s.prompts.filter((p) => p.id !== id) }));
      },
      duplicatePrompt: (id) => {
        const source = get().prompts.find((p) => p.id === id);
        if (!source) return undefined;
        const nowIso = new Date().toISOString();
        const copy: Prompt = {
          ...source,
          id: makeId("p"),
          title: `${source.title} (Copy)`,
          favorite: false,
          createdAt: nowIso,
          updatedAt: nowIso,
          timesUsed: 0,
          lastUsedAt: null,
        };
        set((s) => ({ prompts: [copy, ...s.prompts] }));
        return copy;
      },
      toggleFavorite: (id) => {
        set((s) => ({
          prompts: s.prompts.map((p) =>
            p.id === id ? { ...p, favorite: !p.favorite } : p,
          ),
        }));
      },
      recordUsage: (id) => {
        set((s) => ({
          prompts: s.prompts.map((p) =>
            p.id === id
              ? {
                  ...p,
                  timesUsed: p.timesUsed + 1,
                  lastUsedAt: new Date().toISOString(),
                }
              : p,
          ),
        }));
      },
    }),
    { name: "promptvault-storage" },
  ),
);

export const CATEGORY_COLOR_SWATCH: Record<CategoryColor, string> = {
  violet: "#8b5cf6",
  cyan: "#22d3ee",
  amber: "#f59e0b",
  rose: "#f43f5e",
  emerald: "#10b981",
  sky: "#38bdf8",
  orange: "#fb923c",
  indigo: "#6366f1",
};

export const CATEGORY_COLORS = [
  "violet",
  "cyan",
  "amber",
  "rose",
  "emerald",
  "sky",
  "orange",
  "indigo",
] as const;
export type CategoryColor = (typeof CATEGORY_COLORS)[number];

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

export type Visibility = "private" | "team";

export interface CategoryDTO {
  id: string;
  name: string;
  description: string;
  color: CategoryColor;
  icon: string;
  promptCount: number;
}

export interface PromptDTO {
  id: string;
  title: string;
  content: string;
  categoryId: string | null;
  tags: string[];
  favorite: boolean;
  model: string;
  temperature: number;
  maxTokens: number;
  visibility: Visibility;
  variableNotes: Record<string, string>;
  notes: string;
  timesUsed: number;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  ownerName: string | null;
  isOwner: boolean;
}

export const AI_MODELS = [
  "GPT-4 Turbo",
  "GPT-4o",
  "Claude 4.5 Sonnet",
  "Claude 4.5 Opus",
  "Gemini 2.5 Pro",
] as const;

export function extractVariables(content: string): string[] {
  const matches = content.match(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g) ?? [];
  const seen = new Set<string>();
  for (const m of matches) {
    seen.add(m.replace(/\{\{\s*|\s*\}\}/g, ""));
  }
  return Array.from(seen);
}

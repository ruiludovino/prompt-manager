export type CategoryColor =
  | "violet"
  | "cyan"
  | "amber"
  | "rose"
  | "emerald"
  | "sky"
  | "orange"
  | "indigo";

export interface Category {
  id: string;
  name: string;
  description: string;
  color: CategoryColor;
  icon: string;
}

export type Visibility = "private" | "team";

export interface Prompt {
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
  createdAt: string;
  updatedAt: string;
  timesUsed: number;
  lastUsedAt: string | null;
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
    const name = m.replace(/\{\{\s*|\s*\}\}/g, "");
    seen.add(name);
  }
  return Array.from(seen);
}

import { prisma } from "@/lib/prisma";
import type { CategoryDTO, PromptDTO } from "@/lib/types";
import type { Prisma } from "@prisma/client";

type PromptWithRelations = Prisma.PromptGetPayload<{
  include: { favorites: true; owner: { select: { id: true; name: true } } };
}>;

function toPromptDTO(p: PromptWithRelations, userId: string): PromptDTO {
  return {
    id: p.id,
    title: p.title,
    content: p.content,
    categoryId: p.categoryId,
    tags: p.tags,
    favorite: p.favorites.some((f) => f.userId === userId),
    model: p.model,
    temperature: p.temperature,
    maxTokens: p.maxTokens,
    visibility: p.visibility,
    variableNotes: (p.variableNotes as Record<string, string>) ?? {},
    notes: p.notes,
    timesUsed: p.timesUsed,
    lastUsedAt: p.lastUsedAt ? p.lastUsedAt.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    ownerId: p.ownerId,
    ownerName: p.owner.name,
    isOwner: p.ownerId === userId,
  };
}

const promptInclude = {
  favorites: true,
  owner: { select: { id: true, name: true } as const },
} satisfies Prisma.PromptInclude;

export async function getPrompts(userId: string): Promise<PromptDTO[]> {
  const prompts = await prisma.prompt.findMany({
    where: { OR: [{ ownerId: userId }, { visibility: "team" }] },
    include: promptInclude,
    orderBy: { updatedAt: "desc" },
  });
  return prompts.map((p) => toPromptDTO(p, userId));
}

export async function getPrompt(id: string, userId: string): Promise<PromptDTO | null> {
  const prompt = await prisma.prompt.findFirst({
    where: { id, OR: [{ ownerId: userId }, { visibility: "team" }] },
    include: promptInclude,
  });
  return prompt ? toPromptDTO(prompt, userId) : null;
}

export async function getCategories(): Promise<CategoryDTO[]> {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { prompts: true } } },
    orderBy: { name: "asc" },
  });
  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    color: c.color,
    icon: c.icon,
    promptCount: c._count.prompts,
  }));
}

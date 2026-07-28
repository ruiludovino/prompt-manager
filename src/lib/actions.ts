"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendTeamShareNotification } from "@/lib/resend";
import type { CategoryColor, Visibility } from "@/lib/types";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  return session.user.id;
}

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

async function notifyTeamShareIfNeeded(promptId: string, sharerId: string, wasTeamBefore: boolean) {
  const prompt = await prisma.prompt.findUnique({
    where: { id: promptId },
    include: { owner: { select: { name: true, email: true } } },
  });
  if (!prompt || prompt.visibility !== "team" || wasTeamBefore) return;

  const recipients = await prisma.user.findMany({
    where: { id: { not: sharerId } },
    select: { email: true },
  });

  await sendTeamShareNotification({
    sharedByName: prompt.owner.name ?? prompt.owner.email ?? "A teammate",
    promptTitle: prompt.title,
    promptUrl: `${appUrl()}/prompts/${prompt.id}`,
    recipientEmails: recipients.map((r) => r.email).filter((e): e is string => Boolean(e)),
  });
}

export interface PromptInput {
  title: string;
  content: string;
  categoryId: string | null;
  tags: string[];
  model: string;
  temperature: number;
  maxTokens: number;
  visibility: Visibility;
  variableNotes: Record<string, string>;
  notes: string;
}

export async function createPrompt(input: PromptInput) {
  const userId = await requireUserId();
  const created = await prisma.prompt.create({
    data: {
      ...input,
      ownerId: userId,
    },
  });
  await notifyTeamShareIfNeeded(created.id, userId, false);
  revalidatePath("/");
  revalidatePath("/library");
  return created.id;
}

export async function updatePrompt(id: string, input: PromptInput) {
  const userId = await requireUserId();
  const existing = await prisma.prompt.findUnique({ where: { id } });
  if (!existing || existing.ownerId !== userId) throw new Error("Not allowed");

  const wasTeamBefore = existing.visibility === "team";
  await prisma.prompt.update({ where: { id }, data: input });
  await notifyTeamShareIfNeeded(id, userId, wasTeamBefore);

  revalidatePath("/");
  revalidatePath("/library");
  revalidatePath(`/prompts/${id}`);
}

export async function deletePrompt(id: string) {
  const userId = await requireUserId();
  const existing = await prisma.prompt.findUnique({ where: { id } });
  if (!existing || existing.ownerId !== userId) throw new Error("Not allowed");
  await prisma.prompt.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/library");
}

export async function duplicatePrompt(id: string) {
  const userId = await requireUserId();
  const source = await prisma.prompt.findFirst({
    where: { id, OR: [{ ownerId: userId }, { visibility: "team" }] },
  });
  if (!source) throw new Error("Not found");

  const copy = await prisma.prompt.create({
    data: {
      title: `${source.title} (Copy)`,
      content: source.content,
      categoryId: source.categoryId,
      tags: source.tags,
      model: source.model,
      temperature: source.temperature,
      maxTokens: source.maxTokens,
      visibility: "private",
      variableNotes: source.variableNotes ?? {},
      notes: source.notes,
      ownerId: userId,
    },
  });
  revalidatePath("/");
  revalidatePath("/library");
  return copy.id;
}

export async function toggleFavorite(promptId: string) {
  const userId = await requireUserId();
  const existing = await prisma.favorite.findUnique({
    where: { userId_promptId: { userId, promptId } },
  });
  if (existing) {
    await prisma.favorite.delete({ where: { userId_promptId: { userId, promptId } } });
  } else {
    await prisma.favorite.create({ data: { userId, promptId } });
  }
  revalidatePath("/");
  revalidatePath("/library");
  revalidatePath("/favorites");
  revalidatePath(`/prompts/${promptId}`);
}

export async function recordUsage(promptId: string) {
  await requireUserId();
  await prisma.prompt.update({
    where: { id: promptId },
    data: { timesUsed: { increment: 1 }, lastUsedAt: new Date() },
  });
  revalidatePath(`/prompts/${promptId}`);
}

export async function createCategory(input: {
  name: string;
  description?: string;
  color: CategoryColor;
  icon?: string;
}) {
  await requireUserId();
  const category = await prisma.category.create({
    data: {
      name: input.name,
      description: input.description ?? "",
      color: input.color,
      icon: input.icon ?? "",
    },
  });
  revalidatePath("/categories");
  revalidatePath("/library");
  revalidatePath("/");
  return category.id;
}

export async function updateCategory(
  id: string,
  input: Partial<{ name: string; color: CategoryColor }>,
) {
  await requireUserId();
  await prisma.category.update({ where: { id }, data: input });
  revalidatePath("/categories");
  revalidatePath("/library");
  revalidatePath("/");
}

export async function deleteCategory(id: string) {
  await requireUserId();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/categories");
  revalidatePath("/library");
  revalidatePath("/");
}

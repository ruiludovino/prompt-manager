import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCategories, getPrompt } from "@/lib/data";
import { PromptEditorForm } from "@/components/PromptEditorForm";

export default async function EditPromptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const [prompt, categories] = await Promise.all([getPrompt(id, userId), getCategories()]);
  if (!prompt) notFound();
  if (!prompt.isOwner) redirect(`/prompts/${id}`);

  return <PromptEditorForm categories={categories} existing={prompt} />;
}

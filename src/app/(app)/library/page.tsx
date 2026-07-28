import { auth } from "@/auth";
import { getPrompts, getCategories } from "@/lib/data";
import { LibraryClient } from "@/components/LibraryClient";

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const session = await auth();
  const userId = session!.user.id;
  const params = await searchParams;

  const [prompts, categories] = await Promise.all([getPrompts(userId), getCategories()]);

  return (
    <LibraryClient prompts={prompts} categories={categories} initialCategoryId={params.category} />
  );
}

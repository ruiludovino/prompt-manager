import { auth } from "@/auth";
import { getCategories, getPrompts } from "@/lib/data";
import { CategoriesClient } from "@/components/CategoriesClient";

export default async function CategoriesPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [categories, prompts] = await Promise.all([getCategories(), getPrompts(userId)]);
  const uncategorizedCount = prompts.filter((p) => p.categoryIds.length === 0).length;

  return <CategoriesClient categories={categories} uncategorizedCount={uncategorizedCount} />;
}

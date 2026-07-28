import { getCategories } from "@/lib/data";
import { PromptEditorForm } from "@/components/PromptEditorForm";

export default async function NewPromptPage() {
  const categories = await getCategories();
  return <PromptEditorForm categories={categories} />;
}

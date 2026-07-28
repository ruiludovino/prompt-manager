import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getPrompts, getCategories } from "@/lib/data";
import { Sidebar } from "@/components/Sidebar";
import { CommandPalette } from "@/components/CommandPalette";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const [prompts, categories] = await Promise.all([
    getPrompts(session.user.id),
    getCategories(),
  ]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg">
      <Sidebar user={session.user} />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <CommandPalette prompts={prompts} categories={categories} />
    </div>
  );
}

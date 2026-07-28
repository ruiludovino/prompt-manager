import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Writing", description: "Creative writing and copy assets", color: "violet", icon: "PenLine" },
  { name: "Code Generation", description: "Snippets, refactors, and reviews", color: "cyan", icon: "Terminal" },
  { name: "Marketing", description: "Campaigns, ads, and positioning", color: "amber", icon: "Megaphone" },
  { name: "Data Analysis", description: "Summaries, insights, and reports", color: "emerald", icon: "BarChart3" },
  { name: "Customer Support", description: "Replies, macros, and de-escalation", color: "rose", icon: "Headset" },
  { name: "Brainstorming", description: "Idea generation and exploration", color: "indigo", icon: "Lightbulb" },
  { name: "Research", description: "Deep dives and literature reviews", color: "sky", icon: "Search" },
  { name: "Product", description: "Specs, user stories, and roadmaps", color: "orange", icon: "Package" },
] as const;

async function main() {
  for (const c of categories) {
    await prisma.category.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    });
  }
  console.log(`Seeded ${categories.length} categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

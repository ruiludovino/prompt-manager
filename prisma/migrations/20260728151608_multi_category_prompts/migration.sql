-- CreateTable
CREATE TABLE "PromptCategory" (
    "promptId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromptCategory_pkey" PRIMARY KEY ("promptId","categoryId")
);

-- CreateIndex
CREATE INDEX "PromptCategory_categoryId_idx" ON "PromptCategory"("categoryId");

-- AddForeignKey
ALTER TABLE "PromptCategory" ADD CONSTRAINT "PromptCategory_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptCategory" ADD CONSTRAINT "PromptCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill existing single-category assignments into the new join table
INSERT INTO "PromptCategory" ("promptId", "categoryId")
SELECT "id", "categoryId" FROM "Prompt" WHERE "categoryId" IS NOT NULL;

-- DropForeignKey
ALTER TABLE "Prompt" DROP CONSTRAINT "Prompt_categoryId_fkey";

-- DropIndex
DROP INDEX "Prompt_categoryId_idx";

-- AlterTable
ALTER TABLE "Prompt" DROP COLUMN "categoryId";

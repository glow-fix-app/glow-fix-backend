-- AlterTable
ALTER TABLE "statuses" ADD COLUMN "name" TEXT;

-- Backfill existing rows safely by copying context to name where name is null
UPDATE "statuses" SET "name" = "context" WHERE "name" IS NULL;

-- Make name NOT NULL
ALTER TABLE "statuses" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "statuses_context_name_key" ON "statuses"("context", "name");

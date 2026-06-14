-- AlterTable
ALTER TABLE "audit_logs" ALTER COLUMN "entity_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "images" ALTER COLUMN "entity_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "rejection_reasons" ALTER COLUMN "entity_id" SET DATA TYPE TEXT;

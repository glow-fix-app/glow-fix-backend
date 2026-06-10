-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "location" SET DEFAULT ST_MakePoint(31.2357, 30.0444)::geography;

-- AlterTable
ALTER TABLE "diagnostic_reports" ADD COLUMN     "client_action" TEXT,
ADD COLUMN     "client_action_at" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "loyalty_transactions" ALTER COLUMN "booking_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "recommended_repairs" ADD COLUMN     "description" TEXT,
ADD COLUMN     "duration_minutes" INTEGER,
ADD COLUMN     "is_selected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "price_cents" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "title" TEXT;

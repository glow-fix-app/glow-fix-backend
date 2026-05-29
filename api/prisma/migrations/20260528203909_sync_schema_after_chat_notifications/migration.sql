-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "location" SET DEFAULT ST_MakePoint(31.2357, 30.0444)::geography;

-- CreateIndex
CREATE INDEX "notifications_recipient_user_id_read_at_created_at_idx" ON "notifications"("recipient_user_id", "read_at", "created_at");

-- CreateIndex
CREATE INDEX "notifications_type_id_idx" ON "notifications"("type_id");

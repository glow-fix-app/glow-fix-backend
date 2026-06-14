/*
  Warnings:

  - The primary key for the `bookings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `price_cents` on the `recommended_repairs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "booking_cancellations" DROP CONSTRAINT "booking_cancellations_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "booking_items" DROP CONSTRAINT "booking_items_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "booking_notes" DROP CONSTRAINT "booking_notes_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "booking_status" DROP CONSTRAINT "booking_status_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "diagnostic_reports" DROP CONSTRAINT "diagnostic_reports_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "loyalty_transactions" DROP CONSTRAINT "loyalty_transactions_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "payout_bookings" DROP CONSTRAINT "payout_bookings_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "disputes" DROP CONSTRAINT "disputes_booking_id_fkey";

-- AlterTable
ALTER TABLE "audit_logs" ALTER COLUMN "entity_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "booking_cancellations" ALTER COLUMN "booking_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "booking_items" ALTER COLUMN "booking_id" SET DATA TYPE TEXT,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "booking_notes" ALTER COLUMN "booking_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "booking_status" ALTER COLUMN "booking_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "sub_total" SET DEFAULT 0,
ALTER COLUMN "sub_total" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "discount" SET DEFAULT 0,
ALTER COLUMN "discount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "commission" SET DEFAULT 0,
ALTER COLUMN "commission" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "total_price" SET DEFAULT 0,
ALTER COLUMN "total_price" SET DATA TYPE DECIMAL(65,30),
ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "business_service" ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "businesses" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "conversations" ALTER COLUMN "booking_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "diagnostic_reports" ALTER COLUMN "booking_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "images" ALTER COLUMN "entity_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "loyalty_transactions" ALTER COLUMN "booking_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "booking_id" SET DATA TYPE TEXT,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "payout_bookings" ALTER COLUMN "booking_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "payouts" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "recommended_repairs" DROP COLUMN "price_cents",
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "rejection_reasons" ALTER COLUMN "entity_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "replied_at" TIMESTAMPTZ,
ADD COLUMN     "reply" TEXT,
ALTER COLUMN "booking_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "disputes" ALTER COLUMN "booking_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "booking_status" ADD CONSTRAINT "booking_status_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_cancellations" ADD CONSTRAINT "booking_cancellations_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_notes" ADD CONSTRAINT "booking_notes_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnostic_reports" ADD CONSTRAINT "diagnostic_reports_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_bookings" ADD CONSTRAINT "payout_bookings_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

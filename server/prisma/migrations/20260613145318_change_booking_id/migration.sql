/*
  Warnings:

  - The primary key for the `bookings` table will be changed. If it partially fails, the table could be left without primary key constraint.

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

-- AlterTable
ALTER TABLE "booking_cancellations" ALTER COLUMN "booking_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "booking_items" ALTER COLUMN "booking_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "booking_notes" ALTER COLUMN "booking_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "booking_status" ALTER COLUMN "booking_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "conversations" ALTER COLUMN "booking_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "diagnostic_reports" ALTER COLUMN "booking_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "loyalty_transactions" ALTER COLUMN "booking_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "booking_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "payout_bookings" ALTER COLUMN "booking_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "booking_id" SET DATA TYPE TEXT;

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

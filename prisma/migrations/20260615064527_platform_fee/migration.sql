/*
  Warnings:

  - Changed the type of `booking_id` on the `disputes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "disputes" DROP CONSTRAINT "disputes_booking_id_fkey";

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "platform_fee" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "disputes" DROP COLUMN "booking_id",
ADD COLUMN     "booking_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "client_platform_fee" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

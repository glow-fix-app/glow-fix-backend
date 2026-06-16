/*
  Warnings:

  - Changed the type of `booking_id` on the `disputes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "platform_fee" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "client_platform_fee" DECIMAL(65,30) NOT NULL DEFAULT 0;

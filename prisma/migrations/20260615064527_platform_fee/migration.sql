/*
  Warnings:

  - Added `platform_fee` to `bookings` table.
  - Added `client_platform_fee` to `settings` table.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "platform_fee" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "client_platform_fee" DECIMAL(65,30) NOT NULL DEFAULT 0;

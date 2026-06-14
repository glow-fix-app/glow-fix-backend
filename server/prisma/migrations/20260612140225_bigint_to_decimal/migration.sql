/*
  Warnings:

  - You are about to drop the column `price_cents` on the `recommended_repairs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "booking_items" ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "sub_total" SET DEFAULT 0,
ALTER COLUMN "sub_total" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "discount" SET DEFAULT 0,
ALTER COLUMN "discount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "commission" SET DEFAULT 0,
ALTER COLUMN "commission" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "total_price" SET DEFAULT 0,
ALTER COLUMN "total_price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "business_service" ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "payouts" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "recommended_repairs" DROP COLUMN "price_cents",
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL DEFAULT 0;

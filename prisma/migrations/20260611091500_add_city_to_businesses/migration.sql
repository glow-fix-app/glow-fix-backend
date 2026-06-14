-- AlterTable: add city column to businesses
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "city" TEXT;

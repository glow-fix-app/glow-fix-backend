-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "location" SET DEFAULT ST_MakePoint(31.2357, 30.0444)::geography;

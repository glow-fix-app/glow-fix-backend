-- Add bank/payment info columns to businesses table
-- These were defined in schema.prisma but never migrated to the database.
-- Using IF NOT EXISTS to be safe across all environments.

ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "bank_name" TEXT;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "bank_account_name" TEXT;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "bank_account_number" TEXT;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "swift_iban" TEXT;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "description" TEXT;

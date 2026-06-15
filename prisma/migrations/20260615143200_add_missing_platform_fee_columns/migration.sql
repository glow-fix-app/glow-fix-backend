-- This migration adds the columns that were supposed to be created by
-- 20260615064527_platform_fee but never actually ran because that
-- migration failed mid-transaction and was rolled back by PostgreSQL.
-- Using IF NOT EXISTS to make this safe to run on any environment.

-- Add platform_fee to bookings (if it doesn't exist yet)
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "platform_fee" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- Add client_platform_fee to settings (if it doesn't exist yet)
ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "client_platform_fee" DECIMAL(65,30) NOT NULL DEFAULT 0;

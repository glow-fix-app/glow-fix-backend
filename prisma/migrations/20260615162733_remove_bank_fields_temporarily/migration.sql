/*
  Warnings:

  - You are about to drop the column `bank_account_name` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `bank_account_number` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `bank_name` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `swift_iban` on the `businesses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "businesses" DROP COLUMN "bank_account_name",
DROP COLUMN "bank_account_number",
DROP COLUMN "bank_name",
DROP COLUMN "swift_iban";

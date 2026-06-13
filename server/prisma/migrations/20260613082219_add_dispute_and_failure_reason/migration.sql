-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "failure_reason" TEXT,
ADD COLUMN     "paid_at" TIMESTAMPTZ;

-- CreateTable
CREATE TABLE "disputes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "payment_id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photo_urls" TEXT[],
    "desired_outcome" TEXT NOT NULL,
    "suggested_amount" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "resolution" TEXT,
    "resolved_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "disputes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

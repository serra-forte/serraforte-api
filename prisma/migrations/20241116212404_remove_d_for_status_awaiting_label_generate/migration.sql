/*
  Warnings:

  - The values [LABEL_GENERATED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('REPROVED', 'APPROVED', 'PENDING', 'CANCELED', 'ANALYSIS', 'ANALYSE_REPROVED', 'CREATED', 'DONE', 'SENT', 'PROCESSED', 'REFUNDED', 'CHANGED', 'EXPIRED', 'AWAITING_LABEL', 'AWAITING_LABEL_PAYMENT_PROCESS', 'AWAITING_LABEL_GENERATED', 'LABEL_GENERATE');
ALTER TABLE "cancellations" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TABLE "cancellations" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "cancellations" ALTER COLUMN "status" SET DEFAULT 'PENDING';
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'CREATED';
COMMIT;

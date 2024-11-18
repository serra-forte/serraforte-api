/*
  Warnings:

  - You are about to drop the column `installment _count` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `installment _value` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "installment _count",
DROP COLUMN "installment _value",
ADD COLUMN     "installment_count" DECIMAL(65,30),
ADD COLUMN     "installment_value" DECIMAL(65,30);

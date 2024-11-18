/*
  Warnings:

  - You are about to drop the column `asaasId` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[asaasPaymentId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "asaasId",
ADD COLUMN     "asaasPaymentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payments_asaasPaymentId_key" ON "payments"("asaasPaymentId");

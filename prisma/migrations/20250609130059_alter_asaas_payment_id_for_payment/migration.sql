/*
  Warnings:

  - A unique constraint covering the columns `[asaasPaymentId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payments_asaasPaymentId_key" ON "payments"("asaasPaymentId");

/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `cancellations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cancellations_orderId_key" ON "cancellations"("orderId");

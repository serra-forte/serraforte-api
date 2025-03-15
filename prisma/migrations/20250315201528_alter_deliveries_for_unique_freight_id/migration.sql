/*
  Warnings:

  - A unique constraint covering the columns `[freight_id]` on the table `deliverys` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "deliverys_freight_id_key" ON "deliverys"("freight_id");

/*
  Warnings:

  - You are about to drop the column `company_name` on the `deliverys` table. All the data in the column will be lost.
  - You are about to drop the column `freight_id` on the `deliverys` table. All the data in the column will be lost.
  - You are about to drop the column `freight_link` on the `deliverys` table. All the data in the column will be lost.
  - You are about to drop the column `service_id` on the `deliverys` table. All the data in the column will be lost.
  - You are about to drop the column `service_name` on the `deliverys` table. All the data in the column will be lost.
  - You are about to drop the column `tracking_link` on the `deliverys` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "deliverys_freight_id_key";

-- AlterTable
ALTER TABLE "deliverys" DROP COLUMN "company_name",
DROP COLUMN "freight_id",
DROP COLUMN "freight_link",
DROP COLUMN "service_id",
DROP COLUMN "service_name",
DROP COLUMN "tracking_link";

-- CreateTable
CREATE TABLE "freights" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "service_id" DECIMAL(65,30),
    "service_name" TEXT,
    "freight_id" TEXT,
    "freight_link" TEXT,
    "tracking_link" TEXT,
    "company_name" TEXT,

    CONSTRAINT "freights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "freights_freight_id_key" ON "freights"("freight_id");

-- AddForeignKey
ALTER TABLE "freights" ADD CONSTRAINT "freights_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "deliverys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

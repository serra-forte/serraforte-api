/*
  Warnings:

  - You are about to drop the column `orderId` on the `boxes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "boxes" DROP CONSTRAINT "boxes_orderId_fkey";

-- AlterTable
ALTER TABLE "boxes" DROP COLUMN "orderId";

-- CreateTable
CREATE TABLE "boxes_in_orders" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "boxId" TEXT NOT NULL,

    CONSTRAINT "boxes_in_orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "boxes_in_orders" ADD CONSTRAINT "boxes_in_orders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boxes_in_orders" ADD CONSTRAINT "boxes_in_orders_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "boxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

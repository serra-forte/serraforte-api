/*
  Warnings:

  - You are about to drop the column `productId` on the `boxes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "boxes" DROP CONSTRAINT "boxes_productId_fkey";

-- AlterTable
ALTER TABLE "boxes" DROP COLUMN "productId";

-- CreateTable
CREATE TABLE "boxes_in_products" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "boxId" TEXT NOT NULL,

    CONSTRAINT "boxes_in_products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "boxes_in_products" ADD CONSTRAINT "boxes_in_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boxes_in_products" ADD CONSTRAINT "boxes_in_products_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "boxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

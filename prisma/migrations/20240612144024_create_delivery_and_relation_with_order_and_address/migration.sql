/*
  Warnings:

  - A unique constraint covering the columns `[deliveryId]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.
  - Made the column `user_id` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_fkey";

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "deliveryId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "user_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "deliverys" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "shipping_date" TIMESTAMPTZ,
    "delivery_date" TIMESTAMPTZ,
    "logintude" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "addressId" TEXT NOT NULL,

    CONSTRAINT "deliverys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "deliverys_id_key" ON "deliverys"("id");

-- CreateIndex
CREATE UNIQUE INDEX "deliverys_order_id_key" ON "deliverys"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_deliveryId_key" ON "addresses"("deliveryId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "deliverys"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverys" ADD CONSTRAINT "deliverys_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

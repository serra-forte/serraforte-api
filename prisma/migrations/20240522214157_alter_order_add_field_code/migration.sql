/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "orders_code_key" ON "orders"("code");

/*
  Warnings:

  - You are about to alter the column `sales` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "sales" SET DEFAULT 0,
ALTER COLUMN "sales" SET DATA TYPE INTEGER;

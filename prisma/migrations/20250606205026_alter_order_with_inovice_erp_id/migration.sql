/*
  Warnings:

  - You are about to drop the column `invoice_id` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "invoice_id",
ADD COLUMN     "invoice_id_erp" INTEGER;

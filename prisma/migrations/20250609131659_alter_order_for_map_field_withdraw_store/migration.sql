/*
  Warnings:

  - You are about to drop the column `withdrawStoreDate` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "withdrawStoreDate",
ADD COLUMN     "withdraw_store_date" TIMESTAMP(3);

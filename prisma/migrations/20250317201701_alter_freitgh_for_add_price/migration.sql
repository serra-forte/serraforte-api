/*
  Warnings:

  - You are about to drop the column `price` on the `deliverys` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "deliverys" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "freights" ADD COLUMN     "price" DECIMAL(65,30);

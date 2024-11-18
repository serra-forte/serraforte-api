/*
  Warnings:

  - You are about to drop the column `logintude` on the `deliverys` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "deliverys" DROP COLUMN "logintude",
ADD COLUMN     "longitude" DECIMAL(65,30);

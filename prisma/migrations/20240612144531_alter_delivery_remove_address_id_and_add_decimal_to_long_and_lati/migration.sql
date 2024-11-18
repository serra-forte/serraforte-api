/*
  Warnings:

  - You are about to drop the column `addressId` on the `deliverys` table. All the data in the column will be lost.
  - Changed the type of `logintude` on the `deliverys` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `latitude` on the `deliverys` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "deliverys" DROP COLUMN "addressId",
DROP COLUMN "logintude",
ADD COLUMN     "logintude" DECIMAL(65,30) NOT NULL,
DROP COLUMN "latitude",
ADD COLUMN     "latitude" DECIMAL(65,30) NOT NULL;

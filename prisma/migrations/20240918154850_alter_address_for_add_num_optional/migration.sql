/*
  Warnings:

  - The `num` column on the `addresses` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "num",
ADD COLUMN     "num" DECIMAL(65,30);

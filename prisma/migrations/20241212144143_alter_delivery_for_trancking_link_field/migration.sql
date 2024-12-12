/*
  Warnings:

  - You are about to drop the column `tracking_code` on the `deliverys` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "deliverys" DROP COLUMN "tracking_code",
ADD COLUMN     "tracking_link" TEXT;

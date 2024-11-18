/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `addresses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "addresses_userId_key" ON "addresses"("userId");

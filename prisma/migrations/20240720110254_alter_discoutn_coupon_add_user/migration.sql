/*
  Warnings:

  - Added the required column `userId` to the `discount_coupons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "discount_coupons" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "discount_coupons" ADD CONSTRAINT "discount_coupons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `type` to the `discount_coupons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "discount_coupons" ADD COLUMN     "type" TEXT NOT NULL;

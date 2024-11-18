/*
  Warnings:

  - The `payment_fee` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "income_value" DECIMAL(65,30),
DROP COLUMN "payment_fee",
ADD COLUMN     "payment_fee" DECIMAL(65,30);

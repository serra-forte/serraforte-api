/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Made the column `user_id` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_user_id_fkey";

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payments_user_id_key" ON "payments"("user_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

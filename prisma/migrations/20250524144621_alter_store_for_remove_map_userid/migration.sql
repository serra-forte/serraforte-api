/*
  Warnings:

  - You are about to drop the column `user_id` on the `stores` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "stores" DROP CONSTRAINT "stores_user_id_fkey";

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

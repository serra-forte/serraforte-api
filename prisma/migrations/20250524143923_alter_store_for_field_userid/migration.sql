/*
  Warnings:

  - You are about to drop the column `userId` on the `stores` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "stores" DROP CONSTRAINT "stores_userId_fkey";

-- DropIndex
DROP INDEX "stores_melhor_envio_id_key";

-- DropIndex
DROP INDEX "stores_userId_key";

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

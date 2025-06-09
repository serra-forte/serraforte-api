/*
  Warnings:

  - You are about to drop the `create_code_sequence` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `code` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "code",
ADD COLUMN     "code" INTEGER NOT NULL;

-- DropTable
DROP TABLE "create_code_sequence";

-- CreateIndex
CREATE UNIQUE INDEX "orders_code_key" ON "orders"("code");

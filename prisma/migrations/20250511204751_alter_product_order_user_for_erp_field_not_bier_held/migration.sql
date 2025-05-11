/*
  Warnings:

  - You are about to drop the column `bier_held_order_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `bier_held_product_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `bier_held_client_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `bier_held_user_id` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "bier_held_order_id",
ADD COLUMN     "erp_order_id" INTEGER;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "bier_held_product_id",
ADD COLUMN     "erp_product_id" INTEGER;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "bier_held_client_id",
DROP COLUMN "bier_held_user_id",
ADD COLUMN     "erp_client_id" INTEGER,
ADD COLUMN     "erp_user_id" INTEGER;

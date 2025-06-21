-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_shopping_cart_id_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "shopping_cart_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_shopping_cart_id_fkey" FOREIGN KEY ("shopping_cart_id") REFERENCES "shopping_carts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

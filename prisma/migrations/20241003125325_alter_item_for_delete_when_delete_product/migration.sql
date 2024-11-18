-- DropForeignKey
ALTER TABLE "Items" DROP CONSTRAINT "Items_product_id_fkey";

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

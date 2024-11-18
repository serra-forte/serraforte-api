-- DropForeignKey
ALTER TABLE "Items" DROP CONSTRAINT "Items_order_id_fkey";

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

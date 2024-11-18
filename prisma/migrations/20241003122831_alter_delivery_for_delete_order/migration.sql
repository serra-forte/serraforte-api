-- DropForeignKey
ALTER TABLE "deliverys" DROP CONSTRAINT "deliverys_order_id_fkey";

-- AddForeignKey
ALTER TABLE "deliverys" ADD CONSTRAINT "deliverys_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

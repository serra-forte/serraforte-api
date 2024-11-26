-- AlterTable
ALTER TABLE "boxes" ADD COLUMN     "orderId" TEXT;

-- AddForeignKey
ALTER TABLE "boxes" ADD CONSTRAINT "boxes_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

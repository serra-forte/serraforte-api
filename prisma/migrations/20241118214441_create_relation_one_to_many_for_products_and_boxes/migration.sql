-- AlterTable
ALTER TABLE "boxes" ADD COLUMN     "productId" TEXT;

-- AddForeignKey
ALTER TABLE "boxes" ADD CONSTRAINT "boxes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

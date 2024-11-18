-- AlterTable
ALTER TABLE "deliverys" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "deliverys" ADD CONSTRAINT "deliverys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

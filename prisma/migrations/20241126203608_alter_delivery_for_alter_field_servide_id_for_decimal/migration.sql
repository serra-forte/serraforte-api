/*
  Warnings:

  - The `service_id` column on the `deliverys` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "deliverys" DROP COLUMN "service_id",
ADD COLUMN     "service_id" DECIMAL(65,30);

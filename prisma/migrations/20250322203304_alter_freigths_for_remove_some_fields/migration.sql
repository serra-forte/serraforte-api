/*
  Warnings:

  - You are about to drop the column `company_name` on the `freights` table. All the data in the column will be lost.
  - You are about to drop the column `service_id` on the `freights` table. All the data in the column will be lost.
  - You are about to drop the column `service_name` on the `freights` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "freights" DROP COLUMN "company_name",
DROP COLUMN "service_id",
DROP COLUMN "service_name";

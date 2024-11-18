/*
  Warnings:

  - You are about to drop the column `idCustomerAsaas` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "idCustomerAsaas",
ADD COLUMN     "asaas_customer_id" TEXT;

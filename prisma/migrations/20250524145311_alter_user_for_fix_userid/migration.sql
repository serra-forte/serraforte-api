-- DropIndex
DROP INDEX "stores_melhor_envio_id_key";

-- DropIndex
DROP INDEX "stores_userId_key";

-- AlterTable
ALTER TABLE "stores" ALTER COLUMN "userId" DROP NOT NULL;

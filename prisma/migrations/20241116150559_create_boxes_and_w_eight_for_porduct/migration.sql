-- AlterTable
ALTER TABLE "products" ADD COLUMN     "weight" DECIMAL(65,30);

-- CreateTable
CREATE TABLE "boxes" (
    "id" TEXT NOT NULL,
    "height" DECIMAL(65,30) NOT NULL,
    "width" DECIMAL(65,30) NOT NULL,
    "length" DECIMAL(65,30) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "boxes_pkey" PRIMARY KEY ("id")
);

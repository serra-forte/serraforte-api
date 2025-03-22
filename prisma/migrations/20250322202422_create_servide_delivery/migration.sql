-- CreateTable
CREATE TABLE "service_deliveries" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "service_id" DECIMAL(65,30),
    "service_name" TEXT,
    "price" DECIMAL(65,30),
    "company_name" TEXT,

    CONSTRAINT "service_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_deliveries_deliveryId_key" ON "service_deliveries"("deliveryId");

-- AddForeignKey
ALTER TABLE "service_deliveries" ADD CONSTRAINT "service_deliveries_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "deliverys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

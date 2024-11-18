-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "cancellation_id" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notifications_id_key" ON "notifications"("id");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_cancellation_id_key" ON "notifications"("cancellation_id");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_cancellation_id_fkey" FOREIGN KEY ("cancellation_id") REFERENCES "cancellations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

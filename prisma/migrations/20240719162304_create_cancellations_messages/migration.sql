-- CreateTable
CREATE TABLE "cancellation_messages" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cancellationId" TEXT NOT NULL,
    "message" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cancellation_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cancellation_messages_id_key" ON "cancellation_messages"("id");

-- AddForeignKey
ALTER TABLE "cancellation_messages" ADD CONSTRAINT "cancellation_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cancellation_messages" ADD CONSTRAINT "cancellation_messages_cancellationId_fkey" FOREIGN KEY ("cancellationId") REFERENCES "cancellations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

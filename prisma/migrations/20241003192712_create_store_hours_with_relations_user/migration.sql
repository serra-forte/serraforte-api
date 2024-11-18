-- CreateTable
CREATE TABLE "store_hours" (
    "id" TEXT NOT NULL,
    "day_of_week" TEXT NOT NULL,
    "open_time" TIMESTAMP(3) NOT NULL,
    "close_time" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "store_hours_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "store_hours" ADD CONSTRAINT "store_hours_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[userId,day_of_week]` on the table `store_hours` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "store_hours_userId_day_of_week_key" ON "store_hours"("userId", "day_of_week");

/*
  Warnings:

  - Added the required column `name` to the `boxes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "boxes" ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

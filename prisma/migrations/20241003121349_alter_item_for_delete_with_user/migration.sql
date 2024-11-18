-- DropForeignKey
ALTER TABLE "Items" DROP CONSTRAINT "Items_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

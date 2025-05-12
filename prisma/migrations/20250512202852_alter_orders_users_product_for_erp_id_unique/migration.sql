/*
  Warnings:

  - A unique constraint covering the columns `[erp_order_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[erp_product_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[erp_user_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[erp_client_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "orders_erp_order_id_key" ON "orders"("erp_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_erp_product_id_key" ON "products"("erp_product_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_erp_user_id_key" ON "users"("erp_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_erp_client_id_key" ON "users"("erp_client_id");

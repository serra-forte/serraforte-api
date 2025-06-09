-- AlterTable
CREATE SEQUENCE orders_code_seq;
ALTER TABLE "orders" ALTER COLUMN "code" SET DEFAULT nextval('orders_code_seq');
ALTER SEQUENCE orders_code_seq OWNED BY "orders"."code";

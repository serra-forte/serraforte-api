-- CreateTable
CREATE TABLE "create_code_sequence" (
    "id" TEXT NOT NULL,
    "last_number" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "create_code_sequence_pkey" PRIMARY KEY ("id")
);

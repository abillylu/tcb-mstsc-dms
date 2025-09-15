-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'TCB', 'MSTSC', 'PLACEHOLDER_USER', 'PLACEHOLDER_TCB', 'PLACEHOLDER_MSTSC', 'ADMIN');

-- CreateTable
CREATE TABLE "users_table" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_type" "Role" DEFAULT 'USER',
    "signature" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "containers_table" (
    "id" TEXT NOT NULL,
    "van_number" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "containers_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statement_of_accounts_table" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "prepared_by_id" TEXT NOT NULL,
    "received_by_id" TEXT NOT NULL,
    "handled_by_id" TEXT NOT NULL,
    "soa_number" TEXT NOT NULL,
    "date_issued" TIMESTAMP(3) NOT NULL,
    "delivery_receipt" TEXT,
    "pull_out_receipt" TEXT,
    "equipment_receipt" TEXT,
    "condition_report" TEXT,
    "extra" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statement_of_accounts_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statement_of_accounts_on_containers_table" (
    "container_id" TEXT NOT NULL,
    "soa_id" TEXT NOT NULL,
    "date_delivered" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statement_of_accounts_on_containers_table_pkey" PRIMARY KEY ("container_id","soa_id")
);

-- CreateTable
CREATE TABLE "customers_table" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address_line_1" TEXT NOT NULL,
    "address_line_2" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT,
    "postal_code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_statements_table" (
    "id" TEXT NOT NULL,
    "soa_id" TEXT NOT NULL,
    "prepared_by_id" TEXT NOT NULL,
    "bs_number" TEXT NOT NULL,
    "date_issued" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "billing_statements_table_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_table_email_key" ON "users_table"("email");

-- CreateIndex
CREATE UNIQUE INDEX "statement_of_accounts_table_soa_number_key" ON "statement_of_accounts_table"("soa_number");

-- CreateIndex
CREATE UNIQUE INDEX "billing_statements_table_soa_id_key" ON "billing_statements_table"("soa_id");

-- CreateIndex
CREATE UNIQUE INDEX "billing_statements_table_bs_number_key" ON "billing_statements_table"("bs_number");

-- AddForeignKey
ALTER TABLE "statement_of_accounts_table" ADD CONSTRAINT "statement_of_accounts_table_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statement_of_accounts_table" ADD CONSTRAINT "statement_of_accounts_table_prepared_by_id_fkey" FOREIGN KEY ("prepared_by_id") REFERENCES "users_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statement_of_accounts_table" ADD CONSTRAINT "statement_of_accounts_table_received_by_id_fkey" FOREIGN KEY ("received_by_id") REFERENCES "users_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statement_of_accounts_table" ADD CONSTRAINT "statement_of_accounts_table_handled_by_id_fkey" FOREIGN KEY ("handled_by_id") REFERENCES "users_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statement_of_accounts_on_containers_table" ADD CONSTRAINT "statement_of_accounts_on_containers_table_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "containers_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statement_of_accounts_on_containers_table" ADD CONSTRAINT "statement_of_accounts_on_containers_table_soa_id_fkey" FOREIGN KEY ("soa_id") REFERENCES "statement_of_accounts_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_statements_table" ADD CONSTRAINT "billing_statements_table_soa_id_fkey" FOREIGN KEY ("soa_id") REFERENCES "statement_of_accounts_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_statements_table" ADD CONSTRAINT "billing_statements_table_prepared_by_id_fkey" FOREIGN KEY ("prepared_by_id") REFERENCES "users_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

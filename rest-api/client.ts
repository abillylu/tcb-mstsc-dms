import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient({
	omit: {
		billing_statements_table: {
			updatedAt: true,
		},
		containers_table: {
			updatedAt: true,
		},
		customers_table: {
			updatedAt: true,
		},
		statement_of_accounts_on_containers_table: {
			updatedAt: true,
		},
		statement_of_accounts_table: {
			updatedAt: true,
		},
		users_table: {
			updatedAt: true,
		},
	},
	transactionOptions: {
		maxWait: 5000,
		timeout: 10000,
	},
});

export default prisma;

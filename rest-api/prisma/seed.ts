import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const customerData: Prisma.customers_tableCreateInput[] = [
	{
		name: "Ecossential Foods Corp",
		address_line_1: "Warehouse 5A, Ignacio Complex",
		address_line_2: "#48 A. Rodriguez Ave., Manggahan",
		city: "Pasig City",
		region: "Metro Manila",
		postal_code: "1600",
	},
	{
		name: "Sample Customer",
		address_line_1: "Street Address, P.O. Box, Company Name, C/O",
		address_line_2: "Apartment, Suite, Unit, Building, Floor, etc.",
		city: "City",
		region: "VII",
		postal_code: "6000",
	},
];

async function main() {
	console.log("Start Seeding");
	for (const c of customerData) {
		const customer = await prisma.customers_table.create({
			data: c,
		});
		console.log(`Created customer with id: ${customer.id}`);
	}

	console.log("Seeding Finished");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (error) => {
		console.error(error);
		await prisma.$disconnect();
		process.exit(1);
	});

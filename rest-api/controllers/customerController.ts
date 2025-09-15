import prisma from "../client";

const getCustomers = async (req: any, res: any) => {
	const customers = await prisma.customers_table.findMany({
		orderBy: [
			{
				createdAt: "desc",
			},
		],
	});

	res.status(200).json(customers);
};

const createCustomer = async (req: any, res: any) => {
	let { name, address_line_1, address_line_2, city, region, postal_code } = req["body"];

	region = "";
	postal_code = "";

	let customer = await prisma.customers_table.create({
		data: {
			name,
			address_line_1,
			address_line_2,
			city,
			region,
			postal_code,
		},
	});

	res.status(200).json(customer);
};

module.exports = { getCustomers, createCustomer };

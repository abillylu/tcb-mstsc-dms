import prisma from "../client";

const getContainers = async (req: any, res: any) => {
	const containers = await prisma.containers_table.findMany({
		orderBy: [
			{
				createdAt: "desc",
			},
		],
	});

	res.status(200).json(containers);
};

const createContainer = async (req: any, res: any) => {
	let { van_number, size } = req.body;

	const container = await prisma.containers_table.create({
		data: { van_number, size },
	});

	res.status(200).json(container);
};

module.exports = { getContainers, createContainer };

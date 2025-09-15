import path from "path";
import prisma from "../client";
import { v4 } from "uuid";
const PdfPrinter = require("pdfmake");
require("dotenv").config;
import { signatures } from "../public/images/signatures";

const convertDate = (date: Date) =>
	date.toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric" });
const convertAmount = (amount: number) =>
	amount.toLocaleString("en-PH", { currency: "PHP", style: "currency" }).slice(1);

const getSOAs = async (req: any, res: any) => {
	const soas = await prisma.statement_of_accounts_table.findMany({
		include: {
			containers: {
				select: {
					date_delivered: true,
					location: true,
					amount: true,
					container: {
						select: {
							id: true,
							van_number: true,
							size: true,
						},
					},
				},
			},
			billing_statement: {
				select: {
					id: true,
					bs_number: true,
					date_issued: true,
					prepared_by: {
						select: {
							name: true,
						},
					},
					soa_id: true,
				},
			},
			customer: {
				select: {
					id: true,
					name: true,
					address_line_1: true,
					address_line_2: true,
					city: true,
				},
			},
			prepared_by: {
				select: {
					name: true,
				},
			},
			received_by: {
				select: {
					name: true,
				},
			},
			handled_by: {
				select: {
					name: true,
				},
			},
		},
		omit: {
			prepared_by_id: true,
			received_by_id: true,
			customer_id: true,
			handled_by_id: true,
		},
		orderBy: [
			{
				createdAt: "desc",
			},
		],
	});

	res.status(200).send(soas);
};

const getSOA = async (req: any, res: any) => {
	const soa = await prisma.statement_of_accounts_table.findFirst({
		where: {
			soa_number: "555.1",
		},
		include: {
			containers: {
				include: {
					container: true,
				},
			},
			customer: true,
			prepared_by: true,
			received_by: true,
			handled_by: true,
		},
	});

	res.status(200).json(soa);
};

const createSOA = async (req: any, res: any) => {
	let { soa_number, date_issued, customer_id, containers, prepared_by_id } = req.body;

	let soa_id = v4();
	let delivery_receipt, pull_out_receipt, equipment_receipt, condition_report, extra;
	delivery_receipt = pull_out_receipt = equipment_receipt = condition_report = extra = null;
	let received_by_id = String(process.env.SOA_RECEIVER);
	let handled_by_id = String(process.env.SOA_REPRESENTATIVE);

	let soa = {
		id: soa_id,
		customer_id,
		prepared_by_id,
		received_by_id,
		soa_number,
		date_issued,
		handled_by_id,
		delivery_receipt,
		pull_out_receipt,
		equipment_receipt,
		condition_report,
		extra,
	};

	let createSOAContainers: any = [];

	for (let container of containers) {
		const soac = {
			container_id: container.id,
			soa_id,
			date_delivered: container.date_delivered,
			location: container.location,
			amount: Number(container.amount),
		};

		const soaContainer = prisma.statement_of_accounts_on_containers_table.create({
			data: soac,
			include: {
				container: {
					select: {
						van_number: true,
						size: true,
					},
				},
			},
		});

		createSOAContainers.push(soaContainer);
	}

	const createSoa = prisma.statement_of_accounts_table.create({
		data: soa,
		include: {
			containers: {
				select: {
					date_delivered: true,
					location: true,
					amount: true,
					container: {
						select: {
							van_number: true,
							size: true,
						},
					},
				},
			},
			billing_statement: {
				select: {
					id: true,
					bs_number: true,
					date_issued: true,
					prepared_by: {
						select: {
							name: true,
						},
					},
					soa_id: true,
				},
			},
			customer: {
				select: {
					name: true,
					address_line_1: true,
					address_line_2: true,
					city: true,
				},
			},
			prepared_by: {
				select: {
					name: true,
				},
			},
			received_by: {
				select: {
					name: true,
				},
			},
			handled_by: {
				select: {
					name: true,
				},
			},
		},
		omit: {
			prepared_by_id: true,
			received_by_id: true,
			handled_by_id: true,
			customer_id: true,
		},
	});

	try {
		const transaction = await prisma.$transaction([createSoa, ...createSOAContainers]);

		const soa = {
			...transaction[0],
			containers: transaction.slice(1),
		};

		res.status(200).send(soa);
	} catch (error) {
		res.status(400).send({
			error: "SOA creation failed, please Add the SOA again",
		});
	}
};

const editSOA = async (req: any, res: any) => {
	let { id, soa_number, date_issued, customer_id, containers, prepared_by_id } = req.body;

	const deleteSOAContainers = prisma.statement_of_accounts_on_containers_table.deleteMany({
		where: {
			soa_id: {
				contains: id,
			},
		},
	});

	let createSOAContainers: any = [];

	for (let container of containers) {
		const soac = {
			container_id: container.id,
			soa_id: id,
			date_delivered: container.date_delivered,
			location: container.location,
			amount: Number(container.amount),
		};

		const soaContainer = prisma.statement_of_accounts_on_containers_table.create({
			data: soac,
			include: {
				container: {
					select: {
						id: true,
						van_number: true,
						size: true,
					},
				},
			},
		});

		createSOAContainers.push(soaContainer);
	}

	const updateSOA = prisma.statement_of_accounts_table.update({
		where: {
			id,
		},
		data: {
			soa_number,
			date_issued,
			customer_id,
			prepared_by_id,
		},
		include: {
			containers: {
				select: {
					date_delivered: true,
					location: true,
					amount: true,
					container: {
						select: {
							van_number: true,
							size: true,
						},
					},
				},
			},
			billing_statement: {
				select: {
					id: true,
					bs_number: true,
					date_issued: true,
					prepared_by: {
						select: {
							name: true,
						},
					},
					soa_id: true,
				},
			},
			customer: {
				select: {
					id: true,
					name: true,
					address_line_1: true,
					address_line_2: true,
					city: true,
				},
			},
			prepared_by: {
				select: {
					name: true,
				},
			},
			received_by: {
				select: {
					name: true,
				},
			},
			handled_by: {
				select: {
					name: true,
				},
			},
		},
		omit: {
			prepared_by_id: true,
			received_by_id: true,
			handled_by_id: true,
			customer_id: true,
		},
	});

	try {
		const transaction = await prisma.$transaction([
			deleteSOAContainers,
			...createSOAContainers,
			updateSOA,
		]);

		const soa = {
			...transaction[transaction.length - 1],
			containers: transaction.slice(1, transaction.length - 1),
		};

		res.status(200).send(soa);
	} catch (error) {
		res.status(400).send({
			error: "SOA update failed, please Update the SOA again",
		});
	}
};

const downloadSOA = async (req: any, res: any) => {
	const { soa_number, prepared_by, received_by } = req.body;

	const soa = await prisma.statement_of_accounts_table.findFirst({
		where: {
			soa_number,
		},
		include: {
			containers: {
				include: {
					container: true,
				},
			},
			customer: true,
			prepared_by: true,
			received_by: true,
			handled_by: true,
		},
	});

	const soaContainersTable: any = [];
	soaContainersTable.push(["Date Delivered", "Van #", "Location", "Van Size", "Amount"]);

	for (let container of soa!.containers) {
		soaContainersTable.push([
			convertDate(container.date_delivered),
			container.container.van_number,
			container.location,
			container.container.size,
			convertAmount(container.amount),
		]);
	}

	soaContainersTable.push([
		{ text: "", colSpan: 3 },
		"",
		"",
		{ text: "TOTAL", alignment: "right", color: "red" },
		{
			text: convertAmount(soa!.containers.reduce((acc, cur) => acc + cur.amount, 0)),
			color: "red",
		},
	]);

	const fonts = {
		ArialNarrow: {
			normal: path.join(__dirname, "../public/fonts/arialnarrow.ttf"),
			bold: path.join(__dirname, "../public/fonts/arialnarrow_bold.ttf"),
		},
	};

	const printer = new PdfPrinter(fonts);

	const signature_prepared_by_key = String(
		soa?.prepared_by?.signature === null
			? process.env.SIGNATURE_NONE
			: soa?.prepared_by?.signature,
	);
	const signature_received_by_key = String(process.env.SOA_RECEIVER_SIGNATURE);

	const signature_prepared_by =
		prepared_by && soa?.prepared_by?.signature != null
			? signatures[signature_prepared_by_key]
			: signatures["SIGNATURE_NONE"];
	const signature_received_by =
		received_by && soa?.received_by?.signature != null
			? signatures[signature_received_by_key]
			: signatures["SIGNATURE_NONE"];

	const docDef = {
		pageSize: "Letter",
		content: [
			{
				image: path.join(__dirname, "../public/images/MSTSC-logo.png"),
				width: 550,
				height: 100,
				alignment: "center",
				margin: [-10, 0, 0, 15],
			},
			{ text: "SOA " + soa_number, style: "header", alignment: "right" },
			{ text: convertDate(soa!.date_issued), style: "header", alignment: "left" },
			{ text: "Attention", style: "header", alignment: "left" },
			{ text: soa?.customer.name, style: "header", alignment: "left" },
			{ text: soa?.handled_by.name, style: "header", alignment: "left" },

			{
				style: "soaTable",
				table: {
					widths: ["*", 90, "*", "*", "*"],
					body: soaContainersTable,
				},
			},

			{
				text: "and pay or settle your account within 7 DAYS upon receiving this Statement of Account. PLEASE NOTIFY/ADVISE US OF ANY NEED FOR SUPPORTING DOCUMENTS WITHIN 7 DAYS FROM RECEIPT FOR THE PURPOSE OF RECTIFICATION AND COMPLIANCE ON OUR PART. OTHERWISE, ALL FIGURES REFLECTED ON THIS ACCOUNT IS CONSIDERED ACCURATE. FOR INQUIRY AND ASSISTANCE, PLEASE CALL 0921-200-0865 AND LOOK FOR JM VILLANO.",
				style: "description",
				margin: [0, 0, 0, 50],
			},
			{ text: "Prepared By:", style: "footer" },
			{
				text: soa?.prepared_by.name?.toUpperCase(),
				style: "footer",
				margin: [0, 0, 0, 50],
			},
			{
				svg: signature_prepared_by,
				width: 100,
				height: 100,
				absolutePosition: { x: 25, y: 300 + soaContainersTable.length * 15 },
			},
			{ text: "Received By:", style: "footer" },
			{
				text: soa?.received_by.name?.toUpperCase(),
				style: "footer",
				margin: [0, 0, 0, 50],
			},
			{
				svg: signature_received_by,
				width: 100,
				height: 100,
				absolutePosition: { x: 25, y: 370 + soaContainersTable.length * 15 },
			},
		],
		styles: {
			header: {
				fontSize: 9,
				bold: true,
				margin: [0, 0, 0, 10],
			},
			footer: {
				fontSize: 9,
				margin: [0, 0, 0, 0],
			},
			to: {
				margin: [0, 0, 0, 0],
			},
			description: {
				fontSize: 9,
				alignment: "justify",
				margin: [0, 0, 0, 20],
			},
			mailingAddress: {
				margin: [0, 0, 0, 0],
				alignment: "left",
			},
			billingSummary: {
				margin: [0, 0, 0, 0],
				alignment: "right",
			},
			subheader: {
				fontSize: 9,
				bold: true,
				margin: [0, 10, 0, 5],
			},
			infoTable: {
				fontSize: 9,
				margin: [0, 0, 0, 10],
			},
			soaTable: {
				fontSize: 9,
				margin: [0, 0, 0, 20],
				alignment: "center",
			},
			totalSoa: {
				fontSize: 9,
				margin: [0, 0, 0, 20],
				alignment: "center",
				bold: true,
			},
			paymentTable: {
				fontSize: 9,
				margin: [0, 0, 0, 10],
				alignment: "right",
				bold: true,
			},
			tableHeader: {
				bold: true,
				fontSize: 9,
				color: "black",
			},
		},
		defaultStyle: {
			font: "ArialNarrow",
		},
	};

	const pdfDoc = printer.createPdfKitDocument(docDef);
	const chunks: Buffer[] = [];

	await pdfDoc.on("data", (chunk: Buffer) => {
		chunks.push(chunk);
	});

	await pdfDoc.on("end", () => {
		const pdfBuffer = Buffer.concat(chunks);
		res.send(pdfBuffer);
	});

	await pdfDoc.end();
};

module.exports = { createSOA, editSOA, getSOAs, getSOA, downloadSOA };

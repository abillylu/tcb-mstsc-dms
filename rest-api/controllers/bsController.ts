import path from "path";
import prisma from "../client";
const PdfPrinter = require("pdfmake");
require("dotenv").config;
import { signatures } from "../public/images/signatures";

const convertDate = (date: Date) =>
	date.toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric" });
const convertAmount = (amount: number) =>
	amount.toLocaleString("en-PH", { currency: "PHP", style: "currency" }).slice(1);
const VAT_RATE = 1.12;
const LESS_WITHOLDING_TAX_RATE = 0.02;
const getAmounts = (totalAmount: number) => [
	totalAmount * VAT_RATE,
	totalAmount * LESS_WITHOLDING_TAX_RATE,
];

const getBSs = async (req: any, res: any) => {
	const bss = await prisma.billing_statements_table.findMany({
		include: {
			soa: {
				select: {
					soa_number: true,
				},
			},
		},
	});

	res.status(200).send(bss);
};

const createBS = async (req: any, res: any) => {
	let { bs_number, soa_id, prepared_by_id, date_issued } = req.body;

	let bs = {
		bs_number,
		soa_id,
		prepared_by_id,
		date_issued,
	};

	try {
		let tcb = await prisma.users_table.findFirst({
			where: {
				name: prepared_by_id,
			},
		});

		bs.prepared_by_id = tcb?.id;

		const billingStatement = await prisma.billing_statements_table.create({
			data: bs,
			include: {
				prepared_by: {
					select: {
						name: true,
					},
				},
			},
			omit: {
				createdAt: true,
				prepared_by_id: true,
			},
		});
		res.status(200).json(billingStatement);
	} catch (error) {
		res.status(401).send({
			error: "Billing Statement creation failed, please create the Billing Statement again",
		});
	}
};

const downloadBS = async (req: any, res: any) => {
	const { id, representative } = req.body;

	const bs = await prisma.billing_statements_table.findFirst({
		where: {
			id,
		},
		include: {
			soa: {
				include: {
					containers: {
						include: {
							container: true,
						},
					},
					customer: true,
					prepared_by: true,
					received_by: true,
				},
			},
			prepared_by: true,
		},
	});

	const soaContainersTable: any = [];
	soaContainersTable.push(["DATE", "CONTAINER #", "SIZE", "Location", "Amount", "SOA"]);

	let soaContainersTotal = 0;

	for (let container of bs!.soa.containers) {
		soaContainersTable.push([
			convertDate(container.date_delivered),
			container.container.van_number,
			container.container.size,
			container.location,
			convertAmount(container.amount),
		]);
		soaContainersTotal += container.amount;
	}

	let soaContainersLength = soaContainersTable.length - 1;

	let stripping1500CV = [
		convertDate(soaContainersTable[soaContainersLength][0]),
		"STRIPPING 1500/CV",
		`${soaContainersLength}x40`,
		soaContainersTable[soaContainersLength][3],
		convertAmount(1500 * soaContainersLength),
	];

	soaContainersTotal += 1500 * soaContainersLength;

	soaContainersTable.push(stripping1500CV);

	soaContainersTable[1].push({
		text: `\n${bs?.soa.soa_number}`,
		align: "center",
		rowSpan: soaContainersTable.length - 1,
	});

	const [withVAT, lessWitholdingTax] = getAmounts(soaContainersTotal);

	const fonts = {
		ArialNarrow: {
			normal: path.join(__dirname, "../public/fonts/arialnarrow.ttf"),
			bold: path.join(__dirname, "../public/fonts/arialnarrow_bold.ttf"),
		},
	};

	const printer = new PdfPrinter(fonts);

	const signature_representative_key = bs?.prepared_by.signature;

	const signature_representative =
		representative && signature_representative_key != null
			? signatures[signature_representative_key]
			: signatures["SIGNATURE_NONE"];

	const docDef = {
		pageSize: "Letter",
		content: [
			{
				image: path.join(__dirname, "../public/images/TCB-logo.png"),
				width: 500,
				height: 100,
				alignment: "center",
				margin: [-10, 0, 0, 15],
			},
			{ text: "BILLING STATEMENT", style: "header", alignment: "center" },
			{
				style: "infoTable",
				table: {
					widths: [20, 210, 50, 50, 210],
					body: [
						[
							{ text: "", border: [false, false, false, false] },
							{ text: "", border: [false, false, false, false] },
							{ text: "", border: [false, false, false, false] },
							{ text: "", border: [false, false, false, false] },
							{
								text: `NO. ${bs?.bs_number}`,
								border: [false, false, false, false],
							},
						],
						[
							{
								text: "To:",
								border: [false, false, false, false],
							},
							{
								text: `${bs?.soa.customer.name}\n${bs?.soa.customer.address_line_1}\n${bs?.soa.customer.address_line_2}\n${bs?.soa.customer.city}`,
								border: [false, false, false, false],
							},
							{ text: "", border: [false, false, false, false] },
							{ text: "", border: [false, false, false, false] },
							{
								text: `Date: ${convertDate(bs!.date_issued)}\n\nTOTAL CONTAINERS: ${bs?.soa.containers.length}`,
								border: [false, false, false, false],
							},
						],
					],
				},
			},
			{
				text: "STATEMENT OF ACCOUNT",
				style: "header",
				alignment: "center",
			},
			{
				text: "MIGHTY",
				style: "header",
				alignment: "left",
			},
			{
				style: "soaTable",
				table: {
					widths: ["*", 90, "*", "*", "*", "*"],
					body: soaContainersTable,
				},
			},
			{
				style: "totalSoa",
				table: {
					widths: ["*", 90, "*", "*", "*", "*"],
					body: [
						[
							{ text: "", border: [false, false, false, false] },
							{ text: "", border: [false, false, false, false] },
							{ text: "", border: [false, false, false, false] },
							{ text: "", border: [false, false, false, false] },
							{
								text: "TOTAL AMOUNT",
								border: [false, false, false, false],
							},
							{
								text: convertAmount(soaContainersTotal),
								border: [false, false, false, false],
							},
						],
					],
				},
			},
			{
				style: "paymentTable",
				table: {
					widths: ["*", "*", "*", "*"],
					body: [
						[
							{ text: "", border: [false, false, false, false] },
							{
								text: "TOTAL AMOUNT",
								border: [false, false, false, false],
							},
							{
								text: convertAmount(soaContainersTotal),
								border: [false, false, false, false],
							},
							{ text: "", border: [false, false, false, false] },
						],
						[
							{ text: "", border: [false, false, false, false] },
							{
								text: "VAT RATE",
								border: [false, false, false, false],
							},
							{
								text: VAT_RATE,
								border: [false, false, false, false],
							},
							{ text: "", border: [false, false, false, false] },
						],
						[
							{ text: "", border: [false, false, false, false] },
							{
								text: "WITH VAT",
								border: [false, true, false, false],
							},
							{
								text: convertAmount(withVAT),
								border: [false, true, false, false],
							},
							{ text: "", border: [false, false, false, false] },
						],
						[
							{ text: "", border: [false, false, false, false] },
							{
								text: "less witholding tax",
								border: [false, false, false, false],
							},
							{
								text: convertAmount(lessWitholdingTax),
								border: [false, false, false, false],
							},
							{ text: "", border: [false, false, false, false] },
						],
						[
							{ text: "", border: [false, false, false, false] },
							{
								text: "TOTAL AMOUNT PAYABLE",
								border: [false, true, false, false],
							},
							{
								text: convertAmount(withVAT - lessWitholdingTax),
								border: [false, true, false, false],
							},
							{ text: "", border: [false, false, false, false] },
						],
					],
				},
			},
			{ text: "PREPARED BY:", style: "footer" },
			{ text: bs?.prepared_by.name, style: "footer" },
			{ text: "LCB", style: "footer" },
			{
				svg: signature_representative,
				width: 100,
				height: 100,
				absolutePosition: { x: 25, y: 350 + soaContainersTable.length * 15 },
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
				margin: [0, 0, 0, 0],
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

module.exports = { createBS, getBSs, downloadBS };

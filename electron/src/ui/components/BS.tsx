import {
	Box,
	Button,
	Checkbox,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from "react";

const VAT_RATE = 1.12;
const LESS_WITHOLDING_TAX_RATE = 0.02;
const STRIPPING_1500 = 1500;
const convertAmount = (amount: number) =>
	amount.toLocaleString("en-PH", { currency: "PHP", style: "currency" }).slice(1);

const BS = (props: { soa: any; downloadBS: any; soaIndex: any }) => {
	const { soa, downloadBS, soaIndex } = props;
	const [representative, setRepresentative] = useState(false);

	let totalContainers = soa.containers.length;
	let strippingTotal = totalContainers * STRIPPING_1500;
	let totalAmount =
		soa.containers.reduce((acc: any, cur: { amount: any }) => acc + cur.amount, 0) +
		totalContainers * STRIPPING_1500;
	let totalAmountWithVAT = totalAmount * VAT_RATE;
	let lessWitholdingTax = totalAmount * LESS_WITHOLDING_TAX_RATE;
	let totalAmountPayable = totalAmountWithVAT - lessWitholdingTax;

	return (
		<Paper sx={{ m: 2, p: 5 }} variant="outlined">
			<Typography sx={{ color: "#1976d2", fontWeight: "900" }} variant="h5">
				Billing Statement {soa.billing_statement?.bs_number}
			</Typography>
			<TableContainer>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell>
								<Typography variant="subtitle1">{soa.c_name}</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="subtitle1">
									{"NO. " + soa.billing_statement?.bs_number}
								</Typography>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<Typography variant="subtitle1">{soa.c_address_line_1}</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="subtitle1">
									{"Date: " +
										new Date(soa.billing_statement!.date_issued).toLocaleString(
											"en-US",
											{
												year: "numeric",
												month: "long",
												day: "numeric",
											},
										)}
								</Typography>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<Typography variant="subtitle1">{soa.c_address_line_2}</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="subtitle1">
									{"TOTAL CONTAINERS: " + totalContainers}
								</Typography>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<Typography variant="subtitle1">{soa.c_city}</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="subtitle1"></Typography>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>

			<TableContainer sx={{ maxHeight: 440 }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>DATE DELIVERED</TableCell>
							<TableCell>CONTAINER #</TableCell>
							<TableCell>Location</TableCell>
							<TableCell>Van Size</TableCell>
							<TableCell>Amount</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{soa.containers.map(
							(
								container: {
									date_delivered: string | number | Date;
									container: {
										van_number:
											| string
											| number
											| bigint
											| boolean
											| ReactElement<
													unknown,
													string | JSXElementConstructor<any>
											  >
											| Iterable<ReactNode>
											| ReactPortal
											| Promise<
													| string
													| number
													| bigint
													| boolean
													| ReactPortal
													| ReactElement<
															unknown,
															string | JSXElementConstructor<any>
													  >
													| Iterable<ReactNode>
													| null
													| undefined
											  >
											| null
											| undefined;
										size:
											| string
											| number
											| bigint
											| boolean
											| ReactElement<
													unknown,
													string | JSXElementConstructor<any>
											  >
											| Iterable<ReactNode>
											| ReactPortal
											| Promise<
													| string
													| number
													| bigint
													| boolean
													| ReactPortal
													| ReactElement<
															unknown,
															string | JSXElementConstructor<any>
													  >
													| Iterable<ReactNode>
													| null
													| undefined
											  >
											| null
											| undefined;
									};
									location:
										| string
										| number
										| bigint
										| boolean
										| ReactElement<unknown, string | JSXElementConstructor<any>>
										| Iterable<ReactNode>
										| ReactPortal
										| Promise<
												| string
												| number
												| bigint
												| boolean
												| ReactPortal
												| ReactElement<
														unknown,
														string | JSXElementConstructor<any>
												  >
												| Iterable<ReactNode>
												| null
												| undefined
										  >
										| null
										| undefined;
									amount: number;
								},
								containerIndex: number,
							) => {
								return (
									<TableRow key={containerIndex + "-" + soaIndex + "-" + soa.id}>
										<TableCell key={containerIndex}>
											{new Date(container.date_delivered).toLocaleString(
												"en-US",
												{
													year: "numeric",
													month: "long",
													day: "numeric",
												},
											)}
										</TableCell>
										<TableCell>{container.container.van_number}</TableCell>
										<TableCell>{container.location}</TableCell>
										<TableCell>{container.container.size}</TableCell>
										<TableCell>{convertAmount(container.amount)}</TableCell>
									</TableRow>
								);
							},
						)}
						<TableRow>
							<TableCell key={soaIndex + " - STRIPPING1500/CV"}>
								{new Date().toLocaleString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</TableCell>
							<TableCell>STRIPPING 1500/CV</TableCell>
							<TableCell>LINAO</TableCell>
							<TableCell>{totalContainers + "x40"}</TableCell>
							<TableCell>{convertAmount(strippingTotal)}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell colSpan={3} />
							<TableCell align="left">TOTAL</TableCell>
							<TableCell>{convertAmount(totalAmount)}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell align="center">
								<Typography variant="subtitle2">TOTAL AMOUNT</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography variant="subtitle2">
									{convertAmount(totalAmount)}
								</Typography>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="center">
								<Typography variant="subtitle2">VAT RATE</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography variant="subtitle2">{VAT_RATE}</Typography>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="center">
								<Typography variant="subtitle2">WITH VAT</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography variant="subtitle2">
									{convertAmount(totalAmountWithVAT)}
								</Typography>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="center">
								<Typography variant="subtitle2">less witholding tax</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography variant="subtitle2">
									{convertAmount(lessWitholdingTax)}
								</Typography>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="center">
								<Typography variant="subtitle2">TOTAL AMOUNT PAYABLE</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography variant="subtitle2">
									{convertAmount(totalAmountPayable)}
								</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
				</Table>
			</TableContainer>
			<Typography variant="subtitle1">PREPARED BY</Typography>
			<Typography variant="subtitle1">{soa.billing_statement?.prepared_by.name}</Typography>
			<Typography variant="subtitle1" gutterBottom>
				Licensed Customs Broker
			</Typography>
			<Box>
				<Typography display={"inline"}>Affix Prepared by</Typography>
				<Checkbox
					name="representative-checkbox"
					checked={representative}
					onChange={() => setRepresentative(!representative)}
					required
				/>
			</Box>
			<Button
				variant="contained"
				onClick={() => {
					downloadBS(
						soa.billing_statement!.id,
						soa.billing_statement!.bs_number,
						representative,
					);
				}}
			>
				DOWNLOAD BILLING STATEMENT
			</Button>
		</Paper>
	);
};

export default BS;

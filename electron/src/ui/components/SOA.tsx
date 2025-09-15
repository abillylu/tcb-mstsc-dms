import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useReducer } from "react";

const initialState = {
	preparedBy: false,
	receivedBy: false,
};

const reducer = (state: { preparedBy: any; receivedBy: any }, action: any) => {
	switch (action.type) {
		case "change_prepared_by":
			return {
				...state,
				preparedBy: !state.preparedBy,
			};
		case "change_received_by":
			return {
				...state,
				receivedBy: !state.receivedBy,
			};
		default:
			return state;
	}
};

const convertAmount = (amount: number) =>
	amount.toLocaleString("en-PH", { currency: "PHP", style: "currency" }).slice(1);

const SOA = (props: { soa: any; downloadSOA: any }) => {
	const { soa, downloadSOA } = props;

	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<Paper sx={{ m: 2, p: 5 }} variant="outlined">
			<Typography sx={{ color: "#1976d2", fontWeight: "900" }} variant="h5" gutterBottom>
				SOA {soa.soa_number}
			</Typography>

			<Typography>
				Date issued:{" "}
				{new Date(soa.date_issued).toLocaleString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				Customer: {soa.c_name}
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				Representative: {soa.h_name}
			</Typography>

			<TableContainer sx={{ maxHeight: 440 }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Date Delivered</TableCell>
							<TableCell>Van #</TableCell>
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
									<TableRow key={containerIndex}>
										<TableCell>
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
							{/* <TableCell colSpan={4} /> */}
							<TableCell colSpan={4} align="right">
								TOTAL
							</TableCell>
							<TableCell align="left">
								{convertAmount(
									soa.containers.reduce(
										(acc: any, cur: { amount: any }) => acc + cur.amount,
										0,
									),
								)}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<Typography variant="subtitle1" gutterBottom>
				Prepared by: {soa.p_name}
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				Received by: {soa.r_name}
			</Typography>
			<Box>
				<Typography display={"inline"}>Affix Prepared By</Typography>
				<Checkbox
					name="prepared-by-checkbox"
					checked={state.preparedBy}
					onChange={() => dispatch({ type: "change_prepared_by" })}
					required
				/>
			</Box>
			<Box>
				<Typography display={"inline"}>Affix Received By</Typography>
				<Checkbox
					name="received-by-checkbox"
					checked={state.receivedBy}
					onChange={() => dispatch({ type: "change_received_by" })}
					required
				/>
			</Box>
			<Button
				variant="contained"
				onClick={() => {
					downloadSOA(soa.soa_number, state.preparedBy, state.receivedBy);
				}}
			>
				DOWNLOAD SOA
			</Button>
		</Paper>
	);
};

export default SOA;

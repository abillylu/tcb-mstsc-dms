import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useReducer } from "react";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Grid from "@mui/material/Grid2";
import "@fontsource/roboto/500.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import { useCustomersContext } from "../hooks/useCustomersContext";
import { useAuthContext } from "../hooks/useAuthContext";
import Heading from "./Heading";
import Alert from "@mui/material/Alert";
import useFetch from "../hooks/useFetch";
import FlashMessage from "./FlashMessage";
import { Auth } from "../context/AuthContext";

const initialState = {
	name: "",
	address_line_1: "",
	address_line_2: "",
	city: "",
	status: false,
	error: null,
	success: false,
};

interface AddCustomerState {
	name: string;
	address_line_1: string;
	address_line_2: string;
	city: string;
	status: boolean;
	error: boolean | null;
	success: boolean;
}

const reducer = (state: AddCustomerState, action: { type: string; payload: any }) => {
	switch (action.type) {
		case "change_name":
			return {
				...state,
				name: action.payload,
			};
		case "change_address_line_1":
			return {
				...state,
				address_line_1: action.payload,
			};
		case "change_address_line_2":
			return {
				...state,
				address_line_2: action.payload,
			};
		case "change_city":
			return {
				...state,
				city: action.payload,
			};
		case "change_status":
			return {
				...state,
				status: !state.status,
			};
		case "change_error":
			return {
				...state,
				error: action.payload,
			};
		case "change_success":
			return {
				...state,
				success: action.payload,
			};
		case "clear_inputs":
			return initialState;
		default:
			return state;
	}
};

const AddCustomer = () => {
	const { customers, dispatch: customersDispatch } = useCustomersContext();
	const { auth } = useAuthContext();
	const [state, dispatch] = useReducer(reducer, initialState);
	const [fetchResource] = useFetch();

	const addCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		dispatch({ type: "change_status", payload: null });
		dispatch({ type: "change_error", payload: null });

		const customer = {
			name: state.name,
			address_line_1: state.address_line_1,
			address_line_2: state.address_line_2,
			city: state.city,
		};

		const [ok, json] = await fetchResource(
			import.meta.env.VITE_CUSTOMERS_URL,
			"POST",
			customer,
			auth as Auth,
		);

		if (ok) {
			dispatch({ type: "clear_inputs", payload: null });
			customersDispatch({ type: "create_customer", payload: json });
			dispatch({ type: "change_success", payload: !state.success });
		} else {
			dispatch({ type: "change_status", payload: null });
			dispatch({ type: "change_error", payload: json.error });
		}
	};

	return (
		<Box sx={{ flexGrow: 1, "& .MuiTextField-root": { m: 2 } }}>
			<Grid direction="row" container spacing={3} columnSpacing={5} columns={4}>
				<Grid size={2}>
					<Heading text={"Add a Customer"} />
					<form onSubmit={addCustomer}>
						<TextField
							fullWidth
							disabled={state.status}
							type="text"
							label={"Name"}
							value={state.name}
							onChange={(e) => {
								dispatch({
									type: "change_name",
									payload: e.target.value,
								});
							}}
							required
						/>
						<TextField
							fullWidth
							disabled={state.status}
							type="text"
							label={"Address Line 1"}
							value={state.address_line_1}
							helperText="Street Address, P.O. Box, Company Name, C/O"
							onChange={(e) => {
								dispatch({
									type: "change_address_line_1",
									payload: e.target.value,
								});
							}}
							required
						/>

						<TextField
							fullWidth
							disabled={state.status}
							type="text"
							label={"Address Line 2"}
							value={state.address_line_2}
							helperText="Apartment, Suite, Unit, Building, Floor, etc."
							onChange={(e) => {
								dispatch({
									type: "change_address_line_2",
									payload: e.target.value,
								});
							}}
							required
						/>

						<TextField
							fullWidth
							disabled={state.status}
							type="text"
							label={"City"}
							value={state.city}
							onChange={(e) => {
								dispatch({
									type: "change_city",
									payload: e.target.value,
								});
							}}
							required
						/>

						<Button
							fullWidth
							type="submit"
							disabled={state.status}
							variant="contained"
							size="large"
							startIcon={<PersonAddIcon />}
							sx={{
								m: 2,
								height: "56px",
								fontSize: "16px",
								minWidth: "auto",
							}}
						>
							Add Customer
						</Button>
						{state.error && (
							<Alert variant="filled" severity="error">
								{state.error}
							</Alert>
						)}
						{state.success && (
							<FlashMessage
								message={"Added Customer successfully"}
								alertType={"success"}
								appear={state.success}
								setAppear={() => {
									dispatch({ type: "change_success", payload: !state.success });
								}}
							/>
						)}
					</form>
				</Grid>

				<Grid size={2}>
					<Heading text={"Current Customers"} />
					<Box
						sx={{
							width: "100%",
							display: "grid",
							gap: 2,
						}}
					>
						{customers &&
							customers.map((customer, customerIndex) => (
								<Card key={customerIndex}>
									<CardActionArea
										sx={{
											height: "100%",
											"&[data-active]": {
												backgroundColor: "action.selected",
												"&:hover": {
													backgroundColor: "action.selectedHover",
												},
											},
										}}
									>
										<CardContent sx={{ height: "100%" }}>
											<Typography variant="h5" component="div">
												{customer.name}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												{customer.address_line_1}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												{customer.address_line_2}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												{customer.city}
											</Typography>
										</CardContent>
									</CardActionArea>
								</Card>
							))}
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default AddCustomer;

import { useSOAsContext } from "../hooks/useSOAsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import Autocomplete from "@mui/material/Autocomplete";
import { useReducer } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import Alert from "@mui/material/Alert";
import Heading from "./Heading";
import Paper from "@mui/material/Paper";
import useFetch from "../hooks/useFetch";
import FlashMessage from "./FlashMessage";
import { Auth } from "../context/AuthContext";
import { SOA } from "../context/SOAsContext";

interface BillingStatementStateType {
	bs_number: string;
	soa: SOA | null;
	date_issued: Dayjs;
	prepared_by: string | null;
	status: boolean;
	error: boolean | undefined;
	success: boolean;
}

const initialState = {
	bs_number: "",
	soa: null,
	date_issued: dayjs(new Date().toISOString().split("T")[0]).set("hour", 12),
	prepared_by: null,
	status: false,
	error: null,
	success: false,
};

const reducer = (state: BillingStatementStateType, action: any) => {
	switch (action.type) {
		case "change_bs_number":
			return {
				...state,
				bs_number: action.payload,
			};
		case "change_soa_number":
			return {
				...state,
				soa: action.payload,
			};
		case "change_date_issued":
			return {
				...state,
				date_issued: action.payload,
			};
		case "change_prepared_by":
			return {
				...state,
				prepared_by: action.payload,
			};
		case "change_status":
			return {
				...state,
				status: !state.status,
			};
		case "clear_inputs":
			return initialState;
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
		default:
			return state;
	}
};

const AddBS = () => {
	const { SOAs, dispatch: SOAsDispatch } = useSOAsContext();
	const [state, dispatch] = useReducer(reducer, initialState);
	const { auth } = useAuthContext();
	const [fetchResource] = useFetch();

	const addBS = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		dispatch({ type: "change_status", payload: null });
		dispatch({ type: "change_error", payload: null });

		if (
			SOAs?.some((soa) => soa.soa_number === state.soa.id) ||
			SOAs?.some((soa) => soa.billing_statement?.bs_number === state.bs_number)
		) {
			dispatch({
				type: "change_error",
				payload: "The selected SOA is already associated with a Billing Statement",
			});
			dispatch({ type: "change_status", payload: null });
		} else {
			const bs = {
				bs_number: state.bs_number,
				soa_id: state.soa.id,
				date_issued: state.date_issued,
				prepared_by_id: state.prepared_by,
			};

			const [ok, json] = await fetchResource(
				import.meta.env.VITE_BSS_URL,
				"POST",
				bs,
				auth as Auth,
			);

			if (ok) {
				dispatch({ type: "clear_inputs", payload: null });
				SOAsDispatch({ type: "update_soa", payload: json });
				dispatch({ type: "change_success", payload: !state.success });
			} else {
				dispatch({ type: "change_status", payload: null });
				dispatch({ type: "change_error", payload: json.error });
			}
		}
	};

	return (
		<Box sx={{ flexGrow: 1, "& .MuiTextField-root": { m: 2 } }}>
			<Grid direction="row" container spacing={3} columnSpacing={5} columns={4}>
				<Grid size={2}>
					<Heading text={"Add a Billing Statement"} />
					<form onSubmit={addBS}>
						<TextField
							error={state.error}
							fullWidth
							disabled={state.status}
							type="text"
							label={"Billing Statement #"}
							value={state.bs_number}
							onChange={(e) => {
								dispatch({
									type: "change_bs_number",
									payload: e.target.value,
								});
							}}
							required
						/>
						<Autocomplete
							disabled={state.status}
							disablePortal
							options={SOAs?.filter((soa) => soa.billing_statement === null)!}
							getOptionLabel={(option) => option.soa_number}
							onChange={(event, value) => {
								console.log(event);
								dispatch({
									type: "change_soa_number",
									payload: value,
								});
							}}
							renderInput={(params) => (
								<TextField {...params} label="Select SOA" required />
							)}
							value={state.soa}
						/>
						<DatePicker
							sx={{
								width: "100%",
								"& .MuiInputBase-input.Mui-disabled": {
									WebkitTextFillColor: state.status ? "#9e9e9e" : "#000000",
								},
								"& .MuiFormLabel-root": {
									WebkitTextFillColor: state.status ? "#bdbdbd" : "#666666",
								},
							}}
							disabled={state.status}
							label="Date Issued"
							value={state.date_issued}
							onChange={(date) => {
								dispatch({
									type: "change_date_issued",
									payload: date,
								});
							}}
							slotProps={{ textField: { disabled: true } }}
							disableFuture
						/>
						<Autocomplete
							disabled={state.status}
							disablePortal
							options={["Eric Loue Lima", "Joseph Diamada"]}
							getOptionLabel={(option) => option}
							onChange={(event, value) => {
								console.log(event);
								dispatch({
									type: "change_prepared_by",
									payload: value,
								});
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Select Licensed Customs Broker"
									required
								/>
							)}
							value={state.prepared_by}
						/>
						<Button
							fullWidth
							disabled={state.status}
							type="submit"
							variant="contained"
							size="large"
							startIcon={<RequestQuoteIcon />}
							sx={{
								m: 2,
								height: "56px",
								fontSize: "16px",
								minWidth: "auto",
							}}
						>
							Create Billing Statement
						</Button>
						{state.error && (
							<Alert sx={{ m: 2, width: "100%" }} variant="filled" severity="error">
								{state.error}
							</Alert>
						)}
						{state.success && (
							<FlashMessage
								message={"Added Billing Statement successfully"}
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
					<Heading text={"Billing Statements"} />
					{SOAs?.filter((soa) => soa.billing_statement !== null).map((bs, bsIndex) => {
						return (
							<Paper
								sx={{
									m: 2,
									p: 2,
									width: "100%",
									fontSize: "16px",
									minWidth: "auto",
								}}
								key={bsIndex}
							>
								<h3>{bs.billing_statement?.bs_number}</h3>
								<p>{"SOA: " + bs.soa_number}</p>
							</Paper>
						);
					})}
				</Grid>
			</Grid>
		</Box>
	);
};

export default AddBS;

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useReducer, useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import "@fontsource/roboto/500.css";
import { useContainersContext } from "../hooks/useContainersContext";
import { useCustomersContext } from "../hooks/useCustomersContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";
import Autocomplete from "@mui/material/Autocomplete";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CreateIcon from "@mui/icons-material/Create";
import { useAuthContext } from "../hooks/useAuthContext";
import SOAContainers from "./SOAContainers";
import { useSOAsContext } from "../hooks/useSOAsContext";
import Heading from "./Heading";
import Alert from "@mui/material/Alert";
import useFetch from "../hooks/useFetch";
import FlashMessage from "./FlashMessage";
import Typography from "@mui/material/Typography";
import { Auth } from "../context/AuthContext";
import { Customer } from "../context/CustomersContext";

interface SOAFormState {
	soa_number: string;
	date_issued: Dayjs;
	customer: Customer | null;
	containers: any[];
	soaContainers: any[];
	location: string;
	amount: string;
	status: boolean;
	error: boolean | null;
	success: boolean;
}

const initialState = {
	soa_number: "",
	date_issued: dayjs(new Date().toISOString().split("T")[0]).set("hour", 12),
	customer: null,
	containers: [],
	soaContainers: [],
	location: "",
	amount: "",
	status: false,
	error: null,
	success: false,
};

const reducer = (state: SOAFormState, action: any) => {
	switch (action.type) {
		case "change_soa_number":
			return {
				...state,
				soa_number: action.payload,
			};
		case "change_date_issued":
			return {
				...state,
				date_issued: dayjs(action.payload.toISOString().split("T")[0]).set("hour", 12),
			};
		case "change_customer":
			return {
				...state,
				customer: action.payload,
			};
		case "change_containers":
			let index = action.payload.value.length - 1;

			if (action.payload.actionType === 0) {
				//0 === inserting, undefined === deleting
				(action.payload.value[index]["date_delivered"] = dayjs(
					new Date().toISOString().split("T")[0],
				).set("hour", 12)),
					(action.payload.value[index]["location"] = "");
				action.payload.value[index]["amount"] = "";
			}

			return {
				...state,
				containers: action.payload.value,
			};
		case "load_containers":
			return {
				...state,
				containers: action.payload.value,
			};

		case "change_location":
			return {
				...state,
				location: action.payload,
			};
		case "change_amount":
			return {
				...state,
				amount: action.payload,
			};
		case "update_container":
			let updatedContainers = state.containers.map(
				(container: { id: any; date_delivered: any; location: any; amount: any }) => {
					if (container.id === action.payload.id) {
						(container.date_delivered = action.payload.date_delivered),
							(container.location = action.payload.location),
							(container.amount = action.payload.amount);
					}

					return container;
				},
			);
			return {
				...state,
				containers: updatedContainers,
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

const AddSOA = (props: {
	mode: any;
	submitSOA: any;
	setSelectableSOAs: any;
	soaNumber: any;
	givenState: any;
}) => {
	const { mode, submitSOA, soaNumber, givenState } = props;

	const { containers } = useContainersContext();
	const { customers } = useCustomersContext();
	const { auth } = useAuthContext();
	const { SOAs, dispatch: SOAsDispatch } = useSOAsContext();
	const [state, dispatch] = useReducer(reducer, givenState == null ? initialState : givenState);
	const [loadContainers, setLoadContainers] = useState(true);
	const [fetchResource] = useFetch();

	if (mode === "edit" && loadContainers === true) {
		const getIdsContainers = givenState.containers.reduce(
			(acc: any, cur: { id: string; date_delivered: any; van_number: string }) => {
				if (!(cur.id in acc)) {
					return {
						...acc,
						[cur.id]: {
							id: cur.id,
							date_delivered: cur.date_delivered,
							van_number: cur.van_number,
						},
					};
				} else {
					return acc;
				}
			},
			{},
		);

		let value: any = [];
		for (let container of containers!) {
			if (container.id in getIdsContainers) {
				value.push(container);
			}
		}

		dispatch({
			type: "load_containers",
			payload: {
				value,
			},
		});

		setLoadContainers(false);
	}

	const addSOA = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		dispatch({ type: "change_status" });
		dispatch({ type: "change_error", payload: null });

		if (SOAs?.some((soa) => soa.soa_number === state.soa_number && mode !== "edit")) {
			dispatch({ type: "change_error", payload: "SOA number already exists." });
			dispatch({ type: "change_status" });
		} else {
			const soa = {
				id: "SOA",
				soa_number: state.soa_number,
				date_issued: state.date_issued,
				customer_id: state?.customer?.id,
				containers: state.containers,
				prepared_by_id: auth?.id,
			};

			if (mode === "edit") {
				soa.id = SOAs!.filter((soa) => soa.soa_number == soaNumber)[0].id;
			}

			const url =
				mode !== "edit"
					? import.meta.env.VITE_SOAS_URL
					: import.meta.env.VITE_SOAS_EDIT_URL;

			const [ok, json] = await fetchResource(url, "POST", soa, auth as Auth);

			if (ok) {
				dispatch({ type: "clear_inputs" });

				SOAsDispatch({ type: mode !== "edit" ? "create_soa" : "edit_soa", payload: json });

				dispatch({ type: "change_success", payload: !state.success });

				if (mode === "edit") {
					submitSOA();
				}
			} else {
				dispatch({ type: "change_status" });
				dispatch({ type: "change_error", payload: json.error });
			}
		}
	};

	return (
		<Box sx={{ flexGrow: 1, "& .MuiTextField-root": { m: 2 } }}>
			<form onSubmit={addSOA}>
				<Grid direction="row" container spacing={3} columnSpacing={5} columns={4}>
					<Grid size={2}>
						<Heading text={`${mode !== "edit" ? "Add" : "Edit"} SOA`} />
						<TextField
							disabled={state.status}
							type="text"
							fullWidth
							label={"Soa Number"}
							value={state.soa_number}
							onChange={(e) => {
								dispatch({
									type: "change_soa_number",
									payload: e.target.value,
								});
							}}
							required
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
							options={customers!}
							getOptionLabel={(option) => option.name}
							onChange={(event, value) => {
								console.log(event);
								dispatch({
									type: "change_customer",
									payload: value,
								});
							}}
							renderInput={(params) => (
								<TextField {...params} label="Customer" required />
							)}
							value={state.customer}
						/>
						<Autocomplete
							disabled={state.status}
							multiple
							options={containers!}
							getOptionLabel={(option) => option.van_number}
							onChange={(event, value) => {
								console.log(event);
								dispatch({
									type: "change_containers",
									payload: {
										value,
										actionType: (event.target as HTMLInputElement).value,
									},
								});
							}}
							value={state.containers}
							filterSelectedOptions
							renderInput={(params) => (
								<TextField
									{...params}
									label="Containers"
									placeholder="Containers"
									required={state.containers.length < 1 ? true : false}
								/>
							)}
						/>
						<TextField
							disabled={state.status}
							type="text"
							fullWidth
							label={"Location"}
							value={state.location}
							onChange={(e) => {
								dispatch({
									type: "change_location",
									payload: e.target.value,
								});
							}}
							required
						/>
						<TextField
							disabled={state.status}
							type="text"
							fullWidth
							label={"Amount"}
							value={state.amount}
							onChange={(e) => {
								dispatch({
									type: "change_amount",
									payload: e.target.value,
								});
							}}
							required
						/>

						<Button
							fullWidth
							disabled={state.status}
							type="submit"
							variant="contained"
							size="large"
							startIcon={mode !== "edit" ? <ReceiptIcon /> : <CreateIcon />}
							sx={{
								m: 2,
								height: "56px",
								fontSize: "16px",
								minWidth: "auto",
							}}
						>
							{`${mode !== "edit" ? "Create" : "Edit"} SOA`}
						</Button>
						{state.error && (
							<Alert sx={{ m: 2, width: "100%" }} variant="filled" severity="error">
								{state.error}
							</Alert>
						)}
						{state.success && (
							<FlashMessage
								message={`${mode !== "edit" ? "Added" : "Edited"} SOA successfully`}
								alertType={"success"}
								appear={state.success}
								setAppear={() => {
									dispatch({ type: "change_success", payload: !state.success });
								}}
							/>
						)}
					</Grid>
					<Grid size={2}>
						<Heading text={"Containers"} />
						<Box
							sx={{
								display: "grid",
								gap: 2,
								maxHeight: "650px",
								overflow: "auto",
							}}
						>
							{state.containers.length > 0 ? (
								<SOAContainers
									mode={mode}
									loadContainers={loadContainers}
									containers={[...state.containers]}
									dispatch={dispatch}
									location={state.location}
									amount={state.amount}
								/>
							) : (
								<Typography>SOAs require associated containers</Typography>
							)}
						</Box>
					</Grid>
				</Grid>
			</form>
		</Box>
	);
};

export default AddSOA;

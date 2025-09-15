import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useReducer } from "react";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";

interface SOAContainerFormState {
	date_delivered: Dayjs;
	location: string;
	amount: string;
	status: boolean;
	errorMessage: boolean;
}

const reducer = (state: SOAContainerFormState, action: { type: string; payload: any }) => {
	switch (action.type) {
		case "change_date_delivered":
			return {
				...state,
				date_delivered: dayjs(action.payload.toISOString().split("T")[0]).set("hour", 12),
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
		case "change_status":
			return {
				...state,
				errorMessage: false,
				status: action.payload,
			};
		case "revert_status":
			return {
				...state,
				errorMessage: false,
				status: false,
			};

		default:
			return state;
	}
};

const initialState = {
	date_delivered: dayjs(new Date().toISOString().split("T")[0]).set("hour", 12),
	location: "",
	amount: "",
	status: false,
	errorMessage: false,
};

const SOAContainerForm = (props: {
	mode: any;
	loadContainers: any;
	container: any;
	dispatch: any;
	location: any;
	amount: any;
}) => {
	const { mode, container, dispatch: mainSOADispatch, location, amount } = props;
	const [state, dispatch] = useReducer(
		reducer,
		mode !== "edit"
			? initialState
			: {
					...initialState,
					date_delivered: dayjs(new Date().toISOString().split("T")[0]).set("hour", 12),
				},
	);

	const addContainer = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch({ type: "change_status", payload: e.target.checked });
		mainSOADispatch({
			type: "update_container",
			payload: {
				id: container.id,
				van_number: container.van_number,
				size: container.size,
				date_delivered: state.date_delivered,
				location,
				amount,
				createdAt: container.createdAt,
				updatedAt: container.updatedAt,
			},
		});
	};

	return (
		<>
			<Typography variant="h6">{container.van_number}</Typography>
			<Box
				sx={{
					display: "flex",
					justifyContent: "spaceBetween",
					alignItems: "center",
					alignContent: "center",
					flexGrow: 1,
				}}
			>
				<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
					<DatePicker
						sx={{
							"& .MuiInputBase-input.Mui-disabled": {
								WebkitTextFillColor: state.status ? "#9e9e9e" : "#000000",
							},
							"& .MuiFormLabel-root": {
								WebkitTextFillColor: state.status ? "#bdbdbd" : "#666666",
							},
						}}
						disabled={state.status}
						label="Date Delivered"
						value={state.date_delivered}
						onChange={(date) => {
							dispatch({
								type: "change_date_delivered",
								payload: date,
							});
						}}
						slotProps={{ textField: { disabled: true } }}
						disableFuture
					/>
				</LocalizationProvider>
				<TextField
					error={state.errorMessage}
					required
					disabled={state.status}
					label="Location"
					variant="outlined"
					value={location}
					slotProps={{
						input: {
							readOnly: true,
						},
					}}
					onChange={(e) => {
						dispatch({
							type: "change_location",
							payload: e.target.value,
						});
					}}
				/>
				<TextField
					error={state.errorMessage}
					required
					disabled={state.status}
					label="Amount"
					type="number"
					variant="outlined"
					value={amount}
					slotProps={{
						input: {
							readOnly: true,
						},
					}}
					onChange={(e) => {
						dispatch({
							type: "change_amount",
							payload: e.target.value,
						});
					}}
				/>
				<Checkbox
					name="add-container-checkbox"
					checked={state.status}
					onChange={addContainer}
					inputProps={{ "aria-label": "controlled" }}
					required
				/>
			</Box>
			{state.errorMessage && (
				<Alert
					onClose={() => {
						dispatch({ type: "revert_status", payload: null });
					}}
					sx={{ m: "15px" }}
					variant="outlined"
					severity="error"
				>
					Please fill up necessary container information
				</Alert>
			)}
		</>
	);
};

export default SOAContainerForm;

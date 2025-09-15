import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useReducer } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import "@fontsource/roboto/500.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import { useContainersContext } from "../hooks/useContainersContext";
import Alert from "@mui/material/Alert";
import RvHookupIcon from "@mui/icons-material/RvHookup";
import { useAuthContext } from "../hooks/useAuthContext";
import Autocomplete from "@mui/material/Autocomplete";
import Heading from "./Heading";
import useFetch from "../hooks/useFetch";
import FlashMessage from "./FlashMessage";
import { Auth } from "../context/AuthContext";

const containerSizes = ["1x40", "2x40", "3x40"];

interface AddContainerState {
	van_number: string;
	size: string | null;
	status: boolean;
	error: boolean | null;
	success: boolean;
}

const initialState = {
	van_number: "",
	size: null,
	status: false,
	error: null,
	success: false,
};

const reducer = (state: AddContainerState, action: { type: any; payload: any }) => {
	switch (action.type) {
		case "change_van_number":
			return {
				...state,
				van_number: action.payload,
			};
		case "change_size":
			return {
				...state,
				size: action.payload,
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

const AddContainer = () => {
	const { containers, dispatch: containersDispatch } = useContainersContext();
	const { auth } = useAuthContext();
	const [state, dispatch] = useReducer(reducer, initialState);
	const [fetchResource] = useFetch();

	const addContainer = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch({ type: "change_error", payload: null });
		dispatch({ type: "change_status", payload: null });

		if (containers?.some((container) => container.van_number === state.van_number)) {
			dispatch({ type: "change_error", payload: "Van number already exists" });
			dispatch({ type: "change_status", payload: null });
		} else {
			const container = {
				van_number: state.van_number,
				size: state.size,
			};

			const [ok, json] = await fetchResource(
				import.meta.env.VITE_CONTAINERS_URL,
				"POST",
				container,
				auth as Auth,
			);

			if (ok) {
				dispatch({ type: "clear_inputs", payload: null });
				containersDispatch({ type: "create_container", payload: json });
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
					<Heading text={"Add a Van"} />
					<form onSubmit={addContainer}>
						<TextField
							fullWidth
							disabled={state.status}
							type="text"
							label={"Van Number"}
							value={state.van_number}
							onChange={(e) => {
								dispatch({
									type: "change_van_number",
									payload: e.target.value,
								});
							}}
							required
						/>

						<Autocomplete
							disabled={state.status}
							options={containerSizes}
							renderInput={(params) => (
								<TextField {...params} label="Container Size" required />
							)}
							getOptionLabel={(option) => option}
							onChange={(event, value) => {
								console.log(event);
								dispatch({ type: "change_size", payload: value });
							}}
							value={state.size}
						/>

						<Button
							fullWidth
							type="submit"
							disabled={state.status}
							variant="contained"
							size="large"
							startIcon={<RvHookupIcon />}
							sx={{
								ml: 2,
								height: "56px",
								fontSize: "16px",
							}}
						>
							Add Container Van
						</Button>
					</form>

					{state.error && (
						<Alert sx={{ m: 2, p: 1, width: "100%" }} variant="filled" severity="error">
							{state.error}
						</Alert>
					)}
					{state.success && (
						<FlashMessage
							message={"Added Container successfully"}
							alertType={"success"}
							appear={state.success}
							setAppear={() => {
								dispatch({ type: "change_success", payload: !state.success });
							}}
						/>
					)}
				</Grid>
				<Grid size={2}>
					<Heading text={"Current Container Vans"} />
					<Box
						sx={{
							display: "grid",
							gap: 2,
							maxHeight: "650px",
							overflow: "auto",
						}}
					>
						{containers &&
							containers.map((container, customerIndex) => (
								<Card
									variant="outlined"
									key={customerIndex}
									sx={{ m: 1, minWidth: 275 }}
								>
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
												{container.van_number}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												{container.size}
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

export default AddContainer;

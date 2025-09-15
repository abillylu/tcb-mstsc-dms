import { Box, Button, TextField } from "@mui/material";
import { useReducer } from "react";
import SendIcon from "@mui/icons-material/Send";
import Heading from "./Heading";

const initialState = {
	feedback: "",
	status: false,
	error: null,
};

const reducer = (state: any, action: { type: any; payload: any }) => {
	switch (action.type) {
		case "change_feedback":
			return {
				...state,
				feedback: action.payload,
			};
		default:
			return state;
	}
};

const Feedback = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const submitFeedback = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	return (
		<Box sx={{ alignContent: "center", justifyContent: "center", width: "50%" }}>
			<Heading text={"Feedback Form"} />
			<form onSubmit={submitFeedback}>
				<TextField
					multiline
					rows={10}
					sx={{ input: "500px" }}
					error={state.error}
					fullWidth
					disabled={state.status}
					type="text"
					label={"Feedback"}
					value={state.feedback}
					onChange={(e) => {
						dispatch({
							type: "change_feedback",
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
					startIcon={<SendIcon />}
					sx={{
						mt: 2,
						height: "56px",
						fontSize: "16px",
						minWidth: "auto",
					}}
				>
					Send Feedback
				</Button>
			</form>
		</Box>
	);
};

export default Feedback;

import { Button, FormControl, TextField } from "@mui/material";
import { useReducer } from "react";
import { useLogin } from "../hooks/useLogin";
import Alert from "@mui/material/Alert";

const initialState = {
	email: "",
	password: "",
};

const reducer = (state: any, action: any) => {
	switch (action.type) {
		case "change_email":
			return {
				...state,
				email: action.payload,
			};
		case "change_password":
			return {
				...state,
				password: action.payload,
			};
		default:
			return state;
	}
};

const LoginForm = () => {
	const { login, error, isLoading } = useLogin();
	const [state, dispatch] = useReducer(reducer, initialState);

	const userLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await login(state.email, state.password).then(() => {});
	};

	return (
		<FormControl>
			<form onSubmit={userLogin}>
				<TextField
					type="text"
					fullWidth
					label={"Email"}
					value={state.email}
					sx={{ pb: 2 }}
					onChange={(e) => {
						dispatch({
							type: "change_email",
							payload: e.target.value,
						});
					}}
					disabled={isLoading}
					required
				/>
				<TextField
					type="password"
					fullWidth
					label={"Password"}
					value={state.password}
					sx={{ pb: 2 }}
					onChange={(e) => {
						dispatch({
							type: "change_password",
							payload: e.target.value,
						});
					}}
					disabled={isLoading}
					required
				/>
				<Button
					type="submit"
					disabled={isLoading}
					variant="contained"
					sx={{
						maxWidth: "50px",
						maxHeight: "100px",
						minWidth: "500px",
						minHeight: "50px",
						mb: "15px",
					}}
				>
					Login
				</Button>
				{error && (
					<Alert variant="filled" severity="error">
						{error}
					</Alert>
				)}
			</form>
		</FormControl>
	);
};

export default LoginForm;

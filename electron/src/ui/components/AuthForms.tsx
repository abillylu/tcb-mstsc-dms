import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { Box, Button, ButtonGroup } from "@mui/material";
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthForms = () => {
	const [view, setView] = useState("Login");
	const [isLoading] = useState(false);

	const DemoPaper = styled(Paper)(({ theme }) => ({
		width: 550,
		height: view === "Login" ? 300 : 500,
		padding: theme.spacing(2),
		...theme.typography.body2,
		textAlign: "center",
		alignItems: "center",
		justifyContent: "center",
		margin: 100,
	}));

	return (
		<Stack direction="row">
			<Box
				style={{ overflow: "hidden" }}
				display="flex"
				justifyContent="center"
				alignItems="center"
				width="100vw"
				height="100vh"
			>
				<DemoPaper variant="outlined">
					<Box
						sx={{
							"& > *": {
								m: 2,
							},
						}}
					>
						<ButtonGroup size="large" aria-label="Large button group">
							<Button
								disabled={isLoading}
								variant={view === "Login" ? "contained" : "outlined"}
								onClick={() => {
									setView("Login");
								}}
							>
								Login
							</Button>
						</ButtonGroup>
					</Box>
					{view === "Login" ? <LoginForm /> : <SignupForm />}
				</DemoPaper>
			</Box>
		</Stack>
	);
};

export default AuthForms;

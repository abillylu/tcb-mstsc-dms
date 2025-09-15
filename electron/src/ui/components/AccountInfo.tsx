import CardContent from "@mui/material/CardContent";
import { useAuthContext } from "../hooks/useAuthContext";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";

const AccountInfo = () => {
	const { auth } = useAuthContext();

	return (
		<>
			<Card>
				<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						Account Information
					</Typography>
					<Typography gutterBottom variant="body1">
						NAME: {auth?.name}
					</Typography>
					<Typography gutterBottom variant="body1">
						EMAIL: {auth?.email}
					</Typography>
					<Typography gutterBottom variant="body1">
						ROLE: {auth?.type}
					</Typography>
				</CardContent>
			</Card>
		</>
	);
};

export default AccountInfo;

import { Alert } from "@mui/material";
import { useState, useEffect } from "react";

const FlashMessage = (props: { message: any; alertType: any; setAppear: any; appear: any }) => {
	const { message, alertType, setAppear, appear } = props;

	const [flashMessage, setFlashMessage] = useState(true);

	useEffect(() => {
		const showMessage = () => {
			setFlashMessage(!flashMessage);

			setAppear(!appear);
		};
		setTimeout(showMessage, 2500);
	}, []);

	return (
		<>
			{flashMessage && (
				<Alert sx={{ m: 2, width: "100%" }} variant="filled" severity={alertType}>
					{message}
				</Alert>
			)}
		</>
	);
};

export default FlashMessage;

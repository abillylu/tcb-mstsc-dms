import Typography from "@mui/material/Typography";

const Heading = (props: { text: string }) => {
	const { text } = props;

	return (
		<Typography
			variant="h4"
			sx={{
				display: { xs: "none", md: "flex" },
				fontFamily: "Roboto",
				fontWeight: 400,
				mb: 2,
			}}
		>
			{text}
		</Typography>
	);
};

export default Heading;

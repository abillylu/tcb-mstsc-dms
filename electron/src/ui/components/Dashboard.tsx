import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RvHookupIcon from "@mui/icons-material/RvHookup";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddCustomer from "../components/AddCustomer";
import AddContainer from "./AddContainer";
import AddSOA from "./AddSOA";
import EditSOA from "./EditSOA";
import { useAuthContext } from "../hooks/useAuthContext";
import SOAs from "./SOAs";
import Summary from "./Summary";
import AddBS from "./AddBS";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import BSs from "./BSs";
import { useState } from "react";
import Backlogs from "./Backlogs";
const drawerWidth = 240;

export default function Dashboard(props: { view: any; setView: any }) {
	const { view, setView } = props;
	const { auth } = useAuthContext();
	const [choice, setChoice] = useState("Dashboard");

	const options = [
		{ type: "Dashboard", icon: <DashboardIcon />, view: <Summary /> },
		{
			type: "Add Customer",
			icon: <PersonAddIcon />,
			view: <AddCustomer />,
		},
		{
			type: "Add Container",
			icon: <RvHookupIcon />,
			view: <AddContainer />,
		},
		{
			type: "Create Statement of Account",
			icon: <PostAddIcon />,
			view: (
				<AddSOA
					mode={undefined}
					submitSOA={undefined}
					setSelectableSOAs={undefined}
					soaNumber={undefined}
					givenState={undefined}
				/>
			),
		},
		{
			type: "Edit Statement of Account",
			icon: <PostAddIcon />,
			view: <EditSOA />,
		},
		{
			type: "Statement of Accounts",
			icon: <ReceiptIcon />,
			view: <SOAs />,
		},
		{
			type: "Create Billing Statement",
			icon: <AttachMoneyIcon />,
			view: <AddBS />,
		},
		{
			type: "Billing Statements",
			icon: <RequestQuoteIcon />,
			view: <BSs />,
		},
		{
			type: "Backlogs",
			icon: <AssignmentLateIcon />,
			view: <Backlogs />,
		},
	];

	return (
		<Box sx={{ display: "flex", flexDirection: "column" }}>
			<CssBaseline />
			{auth ? (
				<Drawer
					sx={{
						width: drawerWidth,
						flexShrink: 0,
						"& .MuiDrawer-paper": {
							width: drawerWidth,
							boxSizing: "border-box",
							mt: "64px",
						},
						display: "flex",
					}}
					variant="permanent"
					anchor="left"
				>
					<Divider />
					<List sx={{ m: "0px", p: "0px", b: "0px" }}>
						{options.map((option, index) => (
							<ListItem key={index} disablePadding>
								<ListItemButton
									sx={{
										m: 0,
										p: 2,
										backgroundColor: option.type == choice ? "#1976d2" : "",
										color: option.type == choice ? "white" : "black",
										":hover": {
											backgroundColor:
												option.type == choice ? "#1976d2" : "#d1d1d1",
										},
									}}
									onClick={() => {
										setView(option.view);
										setChoice(option.type);
									}}
								>
									<ListItemIcon
										sx={{
											color: option.type == choice ? "white" : "#757575",
										}}
									>
										{option.icon}
									</ListItemIcon>
									<ListItemText primary={option.type} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Drawer>
			) : (
				<></>
			)}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					bgcolor: "background.default",
					p: 3,
					ml: `${drawerWidth}px`,
				}}
			>
				<Toolbar />
				{view}
			</Box>
		</Box>
	);
}

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import AccountInfo from "./AccountInfo";

function Navbar(props: { setView: any }) {
	const { setView } = props;
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

	const handleLogout = () => {
		logout();
	};

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const settings = [
		{
			settingName: "Account",
			action: () => {
				setView(<AccountInfo />);
			},
		},
		{
			settingName: "Logout",
			action: () => {
				handleLogout();
			},
		},
	];

	const { logout } = useLogout();
	const { auth } = useAuthContext();

	return (
		<AppBar position="relative" sx={{ boxShadow: "none", m: 0, position: "fixed", zIndex: 2 }}>
			<Container maxWidth={false}>
				<Toolbar disableGutters>
					<LocalShippingIcon sx={{ mr: 1 }} />
					<Typography fontSize={"25px"}>TCB - MSTSC DMS</Typography>
					<Box sx={{ flexGrow: 1, display: { md: "flex" } }} />
					{auth && (
						<>
							<Box sx={{ flexGrow: 0 }}></Box>
							<Box sx={{ ml: 4, flexGrow: 0 }}>
								<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
									<Avatar src="/broken-image.jpg" />
								</IconButton>
								<Menu
									sx={{ mt: "45px" }}
									id="menu-appbar"
									anchorEl={anchorElUser}
									anchorOrigin={{
										vertical: "top",
										horizontal: "right",
									}}
									keepMounted
									transformOrigin={{
										vertical: "top",
										horizontal: "right",
									}}
									open={Boolean(anchorElUser)}
									onClose={handleCloseUserMenu}
								>
									{settings.map((setting, settingIndex) => (
										<MenuItem key={settingIndex} onClick={setting.action}>
											<Typography sx={{ textAlign: "center" }}>
												{setting.settingName}
											</Typography>
										</MenuItem>
									))}
								</Menu>
							</Box>
						</>
					)}
				</Toolbar>
			</Container>
		</AppBar>
	);
}
export default Navbar;

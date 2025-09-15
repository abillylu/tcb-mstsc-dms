import "./assets/main.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AuthContextProvider } from "./context/AuthContext";
import { SOAsContextProvider } from "./context/SOAsContext";
import { ContainersContextProvider } from "./context/ContainersContext";
import { CustomersContextProvider } from "./context/CustomersContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
			<AuthContextProvider>
				<SOAsContextProvider>
					<ContainersContextProvider>
						<CustomersContextProvider>
							<App />
						</CustomersContextProvider>
					</ContainersContextProvider>
				</SOAsContextProvider>
			</AuthContextProvider>
		</LocalizationProvider>
	</React.StrictMode>,
);

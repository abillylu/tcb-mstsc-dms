import { CustomersContext, CustomersContextType } from "../context/CustomersContext";
import { useContext } from "react";

export const useCustomersContext = (): CustomersContextType => {
	const context = useContext(CustomersContext);

	if (!context) {
		throw Error("useCustomersContext must be used inside a CustomersContextProvider");
	}

	return context;
};

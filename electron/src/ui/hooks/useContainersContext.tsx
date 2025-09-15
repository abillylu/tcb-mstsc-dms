import { ContainersContext, ContainersContextType } from "../context/ContainersContext";
import { useContext } from "react";

export const useContainersContext = (): ContainersContextType => {
	const context = useContext(ContainersContext);

	if (!context) {
		throw Error("useContainersContext must be used inside a ContainersContextProvider");
	}

	return context;
};

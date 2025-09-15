import { SOAsContext, SOAsContextType } from "../context/SOAsContext";
import { useContext } from "react";

export const useSOAsContext = (): SOAsContextType => {
	const context = useContext(SOAsContext);

	if (!context) {
		throw Error("useSOAsContext must be used inside a SOAsContextProvider");
	}

	return context;
};

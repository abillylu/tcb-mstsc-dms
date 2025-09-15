import { useState } from "react";

const useFlash = () => {
	const [appear, setAppear] = useState(false);

	const flash = () => {
		setAppear(!appear);
		return true;
	};

	return [appear, setAppear, flash];
};

export default useFlash;

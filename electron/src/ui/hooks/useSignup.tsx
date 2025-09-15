import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
	const [error, setError] = useState<String | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { dispatch } = useAuthContext();

	const signup = async (email: string, password: string, name: string) => {
		setIsLoading(true);
		setError(null);

		const response = await fetch(import.meta.env.VITE_SIGNUP_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password, name }),
		});

		const json = await response.json();

		if (!response.ok) {
			setIsLoading(false);
			setError(json.error);
		}

		if (response.ok) {
			localStorage.setItem("user", JSON.stringify(json));

			dispatch({ type: "login_user", payload: json });

			setIsLoading(false);
		}
	};

	return { signup, isLoading, setError, error };
};

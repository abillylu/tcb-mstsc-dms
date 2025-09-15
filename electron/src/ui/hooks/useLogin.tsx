import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
	const [error, setError] = useState<String | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { dispatch } = useAuthContext();

	const login = async (email: string, password: string) => {
		setIsLoading(true);
		setError(null);

		const response = await fetch(import.meta.env.VITE_LOGIN_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
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

	return { login, isLoading, error };
};

import { Auth } from "../context/AuthContext";

const useFetch = () => {
	const fetchResource = async (URI: string, method: string, body: Object, auth: Auth) => {
		const response = await fetch(URI, {
			method,
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${auth?.token}`,
			},
		});

		const json = await response.json();

		return [response.ok, json];
	};

	return [fetchResource];
};

export default useFetch;

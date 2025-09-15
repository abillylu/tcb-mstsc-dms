import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import { useCustomersContext } from "./hooks/useCustomersContext";
import { useContainersContext } from "./hooks/useContainersContext";
import { useAuthContext } from "./hooks/useAuthContext";
import AuthForms from "./components/AuthForms";
import { useSOAsContext } from "./hooks/useSOAsContext";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
);

interface ResourceType {
	url: string;
	action: string;
	name: string;
	dispatch: Function;
}

function App() {
	const [view, setView] = useState("Dashboard");

	const { dispatch: customersDispatch } = useCustomersContext();
	const { dispatch: containersDispatch } = useContainersContext();
	const { auth, dispatch: authDispatch } = useAuthContext();
	const { dispatch: soasDispatch } = useSOAsContext();

	async function getResources(resource: ResourceType) {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		myHeaders.append("Authorization", `Bearer ${auth?.token}`);

		try {
			const response = await fetch(resource.url, {
				method: "GET",
				headers: myHeaders,
			});

			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			const json = await response.json();
			await resource.dispatch({ type: resource.action, payload: json });
		} catch (error: any) {
			if (auth) {
				localStorage.removeItem("user");
				authDispatch({ type: "logout_user", payload: null });
			}
			console.error(error.message);
		}
	}

	const resources = [
		{
			url: import.meta.env.VITE_CUSTOMERS_URL,
			name: "customers",
			dispatch: customersDispatch,
			action: "get_customers",
		},
		{
			url: import.meta.env.VITE_CONTAINERS_URL,
			name: "containers",
			dispatch: containersDispatch,
			action: "get_containers",
		},
		{
			url: import.meta.env.VITE_SOAS_URL,
			name: "soas",
			dispatch: soasDispatch,
			action: "get_soas",
		},
	];

	const handleInserts = async (payload: { table: any }) => {
		const [customers, containers, soas] = resources;

		switch (payload.table) {
			case import.meta.env.VITE_CUSTOMERS_TABLE:
				await getResources(customers);
				return;
			case import.meta.env.VITE_CONTAINERS_TABLE:
				await getResources(containers);
				return;
			case import.meta.env.VITE_SOAS_TABLE:
				await getResources(soas);
				return;
			case import.meta.env.VITE_BSS_TABLE:
				await getResources(soas);
				return;
			default:
				return;
		}
	};

	useEffect(() => {
		supabase
			.channel("resources_changes")
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: import.meta.env.VITE_CUSTOMERS_TABLE },
				handleInserts,
			)
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: import.meta.env.VITE_CONTAINERS_TABLE },
				handleInserts,
			)
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: import.meta.env.VITE_SOAS_TABLE },
				handleInserts,
			)
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: import.meta.env.VITE_BSS_TABLE },
				handleInserts,
			)
			.subscribe();
		for (let resource of resources) {
			if (auth) {
				getResources(resource);
			}
		}
	}, [customersDispatch, containersDispatch, soasDispatch, auth]);

	return (
		<>
			<Navbar setView={setView} />
			{auth && <Dashboard view={view} setView={setView} />}
			{!auth && <AuthForms />}
		</>
	);
}

export default App;

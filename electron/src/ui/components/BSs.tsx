import { useSOAsContext } from "../hooks/useSOAsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { Box, TextField } from "@mui/material";
import { useState } from "react";
import BS from "./BS";

const BSs = () => {
	const { SOAs } = useSOAsContext();
	const { auth } = useAuthContext();

	const [search, setSearch] = useState("");

	const downloadBS = async (id: string, bs_number: string, representative: boolean) => {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		myHeaders.append("Authorization", `Bearer ${auth?.token}`);

		const url = import.meta.env.VITE_BS_DOWNLOAD_URL;
		try {
			await fetch(url, {
				method: "POST",
				body: JSON.stringify({ id, representative }),
				headers: myHeaders,
			})
				.then((res) => res.blob())
				.then((blob) => {
					const link = document.createElement("a");
					link.href = URL.createObjectURL(blob);
					link.setAttribute("download", `TCB_BS_${bs_number}.pdf`);
					document.body.appendChild(link);
					link.click();
				});
		} catch (error: any) {
			console.error(error.message);
		}
	};

	return (
		<Box>
			<TextField
				fullWidth
				type="text"
				label={"Search"}
				value={search}
				onChange={(e) => {
					setSearch(e.target.value);
				}}
				required
			/>
			<Box
				sx={{
					display: "grid",
					gap: 2,
					maxHeight: "650px",
					overflow: "auto",
					m: 2,
				}}
			>
				{SOAs?.filter((soa) => soa.billing_statement !== null)
					?.filter((soa) => {
						const lowercase = search.toLowerCase();

						return search === ""
							? true
							: soa.soa_number.toLowerCase().includes(lowercase) ||
									soa.billing_statement?.bs_number
										.toLowerCase()
										.includes(lowercase) ||
									soa.date_issued.toLocaleString().includes(lowercase) ||
									soa.h_name.toLowerCase().includes(lowercase) ||
									soa.c_name.toLowerCase().includes(lowercase) ||
									soa.c_address_line_1.toLowerCase().includes(lowercase) ||
									soa.c_address_line_2.toLowerCase().includes(lowercase) ||
									soa.c_city.toLowerCase().includes(lowercase) ||
									soa.containers.some((container) =>
										container.container.van_number
											.toLowerCase()
											.includes(lowercase),
									) ||
									soa.p_name.toLowerCase().includes(lowercase) ||
									soa.r_name.toLowerCase().includes(lowercase);
					})
					.map((soa, soaIndex) => {
						return (
							<div key={soa.billing_statement?.id}>
								<BS soa={soa} downloadBS={downloadBS} soaIndex={soaIndex} />
							</div>
						);
					})}
			</Box>
		</Box>
	);
};

export default BSs;

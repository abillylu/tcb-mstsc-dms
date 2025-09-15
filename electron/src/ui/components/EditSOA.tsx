import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useSOAsContext } from "../hooks/useSOAsContext";
import { useState } from "react";
import { useCustomersContext } from "../hooks/useCustomersContext";
import AddSOA from "./AddSOA";
import dayjs, { type Dayjs } from "dayjs";
import { Box } from "@mui/material";
import FlashMessage from "./FlashMessage";

interface CustomerInput {
	id: string;
	name: string;
	address_line_1: string;
	address_line_2: string;
	city: string;
	region: string;
	postal_code: string;
	createdAt: Date;
}

interface ContainerInput {
	id: string;
	van_number: string;
	size: string;
	createdAt: Dayjs;
	date_delivered: Dayjs;
	location: string;
	amount: string;
}

interface SOAInput {
	soa_number: string;
	date_issued: Dayjs;
	customer: CustomerInput;
	containers: ContainerInput[];
	location: string;
	amount: string;
	status: boolean;
	error: null | string;
	success: boolean;
}

const DAY = 86400000; //day =  24 * 60 * 60 * 1000

const EditSOA = () => {
	const SOAs = useSOAsContext().SOAs!.filter((SOA) =>
		+new Date() - +new Date(SOA.createdAt) < DAY ? true : false,
	);
	const { customers } = useCustomersContext();
	const [chosenSOA, setChosenSOA] = useState<SOAInput | null>(null);

	const [soaNumber, setSoaNumber] = useState<string | null>(null);
	const [selectableSOAs, setSelectableSOAs] = useState(SOAs?.map((soa) => soa.soa_number));
	const [success, setSuccess] = useState<boolean>(false);

	const submitSOA = () => {
		setSoaNumber(null);
		setSuccess(true);
	};

	return (
		<div>
			<Autocomplete
				value={soaNumber}
				options={selectableSOAs!}
				clearOnBlur
				sx={{ my: "10px" }}
				onHighlightChange={() => {
					setSoaNumber(null);
				}}
				onChange={(event, value) => {
					setSoaNumber(value);

					const soa = SOAs?.filter((SOA) => SOA.soa_number == value)[0];

					console.log(event);

					const flattenedContainers = soa!.containers.map((container) => {
						return {
							id: container?.container.id,
							van_number: container?.container.van_number,
							size: container?.container.size,
							createdAt: dayjs(
								new Date(container?.date_delivered).toISOString().split("T")[0],
							).set("hour", 12),
							date_delivered: dayjs(
								new Date(container?.date_delivered).toISOString().split("T")[0],
							).set("hour", 12),
							location: container?.location,
							amount: container?.amount.toString(),
						};
					});

					const customer = customers!.filter((customer) => customer.id === soa?.c_id)[0];

					setChosenSOA({
						soa_number: soa!.soa_number,
						date_issued: dayjs(
							new Date(soa!.date_issued).toISOString().split("T")[0],
						).set("hour", 12),
						customer,
						containers: flattenedContainers,
						location: flattenedContainers[0].location,
						amount: flattenedContainers[0].amount.toString(),
						status: false,
						error: null,
						success: false,
					});
				}}
				renderInput={(params) => (
					<TextField {...params} label="Choose an SOA Number to edit" required />
				)}
			/>

			<Box display="flex">
				<FlashMessage
					message={"Only SOAs created within the day can be edited."}
					alertType={"warning"}
					appear={success}
					setAppear={() => {
						setSuccess(!success);
					}}
				/>
			</Box>

			{soaNumber !== null && (
				<AddSOA
					mode={"edit"}
					soaNumber={soaNumber}
					submitSOA={submitSOA}
					setSelectableSOAs={setSelectableSOAs}
					givenState={chosenSOA}
				/>
			)}
		</div>
	);
};

export default EditSOA;

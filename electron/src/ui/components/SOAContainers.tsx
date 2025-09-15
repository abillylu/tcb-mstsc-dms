import SOAContainerForm from "./SOAContainerForm";

const SOAContainers = (props: {
	mode: any;
	loadContainers: any;
	containers: any;
	dispatch: any;
	amount: any;
	location: any;
}) => {
	const { mode, loadContainers, containers, dispatch, amount, location } = props;

	return (
		<>
			{containers.map((container: any) => {
				return (
					<SOAContainerForm
						mode={mode}
						loadContainers={loadContainers}
						key={container.id}
						dispatch={dispatch}
						container={container}
						location={location}
						amount={amount}
					/>
				);
			})}
		</>
	);
};

export default SOAContainers;

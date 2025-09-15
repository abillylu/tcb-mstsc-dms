import { createContext, useReducer, ReactNode, Dispatch } from "react";

interface Container {
	id: string;
	van_number: string;
	size: string;
	createdAt: string;
	upatedAt: string;
}

interface ContainersState {
	containers: Container[] | null;
}

interface ContainersProviderProps {
	children: ReactNode;
}

type ContainersAction =
	| { type: "get_containers"; payload: Container[] }
	| { type: "create_container"; payload: Container }
	| { type: "update_container"; payload: Container }
	| { type: "delete_container"; payload: number };

export interface ContainersContextType {
	containers: Container[] | null;
	dispatch: Dispatch<ContainersAction>;
}

export const ContainersContext = createContext<ContainersContextType | undefined>(undefined);

export const containersReducer = (
	state: ContainersState,
	action: ContainersAction,
): ContainersState => {
	switch (action.type) {
		case "get_containers":
			return {
				containers: action.payload,
			};
		case "create_container":
			return {
				containers: [action.payload, ...(state.containers ?? [])],
			};

		case "update_container":
			return state;

		case "delete_container":
			return state;

		default:
			return state;
	}
};

export const ContainersContextProvider = ({ children }: ContainersProviderProps) => {
	const [state, dispatch] = useReducer(containersReducer, {
		containers: null,
	});

	return (
		<ContainersContext.Provider value={{ containers: state.containers, dispatch }}>
			{children}
		</ContainersContext.Provider>
	);
};

import { createContext, ReactNode, useReducer, Dispatch } from "react";

export interface Customer {
	id: string;
	name: string;
	address_line_1: string;
	address_line_2: string;
	city: string;
	region: string;
	postal_code: string;
	createdAt: Date;
	updatedAt: Date;
}

interface CustomersState {
	customers: Customer[] | null;
}

interface CustomersProviderProps {
	children: ReactNode;
}

type CustomersAction =
	| { type: "get_customers"; payload: Customer[] }
	| { type: "create_customer"; payload: Customer }
	| { type: "update_customer"; payload: Customer }
	| { type: "delete_customer"; payload: number };

export interface CustomersContextType {
	customers: Customer[] | null;
	dispatch: Dispatch<CustomersAction>;
}

export const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

export const customersReducer = (
	state: CustomersState,
	action: CustomersAction,
): CustomersState => {
	switch (action.type) {
		case "get_customers":
			return {
				customers: action.payload,
			};
		case "create_customer":
			return {
				customers: [action.payload, ...(state.customers ?? [])],
			};
		case "update_customer":
			return state;

		case "delete_customer":
			return state;

		default:
			return state;
	}
};

export const CustomersContextProvider = ({ children }: CustomersProviderProps) => {
	const [state, dispatch] = useReducer(customersReducer, {
		customers: null,
	});

	return (
		<CustomersContext.Provider value={{ customers: state.customers, dispatch }}>
			{children}
		</CustomersContext.Provider>
	);
};

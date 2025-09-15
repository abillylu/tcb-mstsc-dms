import { createContext, ReactNode, useReducer, Dispatch } from "react";

export interface Container {
	id: string; //
	van_number: string;
	size: string;
}

export interface SOAContainer {
	date_delivered: Date;
	location: string;
	amount: number;
	container: Container;
}

export interface Name {
	name: string;
}

export interface BillingStatement {
	id: string;
	bs_number: string;
	date_issued: Date;
	prepared_by: Name;
	soa_id: string;
}

export interface SOA {
	id: string;
	soa_number: string;
	billing_statement: BillingStatement | null;
	date_issued: Date;
	h_name: string;
	delivery_receipt: string | null;
	pull_out_receipt: string | null;
	equipment_receipt: string | null;
	condition_report: string | null;
	extra: string | null;
	createdAt: Date;
	containers: SOAContainer[];
	c_id: string; //
	c_name: string;
	c_address_line_1: string;
	c_address_line_2: string;
	c_city: string;
	p_name: string;
	r_name: string;
}

interface SOAState {
	SOAs: SOA[] | null;
}

interface SOAProviderProps {
	children: ReactNode;
}

type SOAsAction =
	| { type: "get_soas"; payload: SOA[] }
	| { type: "create_soa"; payload: SOA }
	| { type: "update_soa"; payload: BillingStatement }
	| { type: "edit_soa"; payload: SOA }
	| { type: "delete_soa"; payload: number };

export interface SOAsContextType {
	SOAs: SOA[] | null;
	dispatch: Dispatch<SOAsAction>;
}

const flattenObject = (obj: any, parentKey: string, exclude: string[]) => {
	let ret = {} as SOA | any;

	const keys = Object.keys(obj);

	for (let key of keys) {
		if (
			typeof obj[key] === "object" &&
			obj[key] !== null &&
			!exclude.includes(key) &&
			!Array.isArray(obj[key])
		) {
			ret = { ...ret, ...flattenObject(obj[key], key, []) };
		} else {
			ret[parentKey === null ? key : parentKey === "" ? key : parentKey[0] + "_" + key] =
				obj[key];
		}
	}

	return ret;
};

export const SOAsContext = createContext<SOAsContextType | undefined>(undefined);

export const soasReducer = (state: SOAState, action: SOAsAction): SOAState => {
	switch (action.type) {
		case "get_soas":
			return {
				SOAs: action.payload?.map((soa) =>
					flattenObject(soa, "", ["billing_statement"]),
				) as SOA[],
			};
		case "create_soa":
			return {
				SOAs: [
					flattenObject(action.payload, "", ["billing_statement"]),
					...(state.SOAs ?? []),
				],
			};

		case "update_soa":
			let soa = {
				...state.SOAs?.find((soa) => soa.id === action.payload.soa_id),
				billing_statement: action.payload,
			} as SOA;

			let updatedSOA: SOA[] = state.SOAs!.filter((soa) => soa.id !== action.payload.soa_id);

			return {
				...state,
				SOAs: [soa, ...updatedSOA],
			};

		case "edit_soa":
			const transform = {
				...flattenObject(action.payload, "", ["billing_statement"]),
				billing_statement: action.payload.billing_statement,
			};

			transform.containers = transform.containers.map(
				(container: {
					date_delivered: any;
					location: any;
					amount: any;
					container: { id: any; van_number: any; size: any };
				}) => {
					return {
						date_delivered: container.date_delivered,
						location: container.location,
						amount: container.amount,
						container: {
							id: container.container.id,
							van_number: container.container.van_number,
							size: container.container.size,
						},
					};
				},
			);

			return {
				...state,
				SOAs: [
					transform,
					...(state.SOAs!.filter((soa) => soa.id !== action.payload.id) ?? []),
				],
			};
		case "delete_soa":
			return state;

		default:
			return state;
	}
};

export const SOAsContextProvider = ({ children }: SOAProviderProps) => {
	const [state, dispatch] = useReducer(soasReducer, {
		SOAs: null,
	});

	return (
		<SOAsContext.Provider value={{ SOAs: state.SOAs, dispatch }}>
			{children}
		</SOAsContext.Provider>
	);
};

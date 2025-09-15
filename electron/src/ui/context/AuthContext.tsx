import { createContext, useReducer, useEffect, ReactNode, Dispatch } from "react";

export interface Auth {
	id: string;
	email: string;
	name: string | null;
	type: string;
	token: string;
	signature: string | null;
}

interface AuthState {
	auth: Auth | null;
}

interface AuthProviderProps {
	children: ReactNode;
}

type AuthAction = { type: "login_user"; payload: Auth } | { type: "logout_user"; payload: null };

export interface AuthContextType {
	auth: Auth | null;
	dispatch: Dispatch<AuthAction>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
	switch (action.type) {
		case "login_user":
			return {
				...state,
				auth: action.payload,
			};
		case "logout_user":
			return {
				...state,
				auth: action.payload,
			};
		default:
			return state;
	}
};

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
	const [state, dispatch] = useReducer(authReducer, {
		auth: null,
	});

	useEffect(() => {
		const user: any = JSON.parse(localStorage.getItem("user")!);

		if (user) {
			dispatch({ type: "login_user", payload: user });
		}
	}, []);

	return (
		<AuthContext.Provider value={{ auth: state.auth, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};

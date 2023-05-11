import { createContext, useEffect, useReducer } from 'react';
import type { FC, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GlobalLoader from 'components/GlobalLoader';
import { useJwt } from 'react-jwt';
import { PUBLIC_ROUTES } from '../index';

const TOKEN_KEY = 'TOKEN_KEY';

interface JWTUser {
	state: string;
	id: string;
	email: string;
}
interface Error {
	id: string;
	message: string;
}

interface AppState {
	loading: boolean;
	user?: JWTUser;
	userJWT?: string;
	setUserJWT: (userJWT?: string) => void;

	errors: Error[];
	pushError: (e: Error) => void;
	pushErrors: (errors: Error[]) => void;
	popError: (id: string) => void;
	clearErrors: () => void;
}

export interface AppContextValue {
	loading: boolean;
	user?: JWTUser;
	userJWT?: string;
	setUserJWT: (userJWT?: string) => void;
	errors: Error[];
	pushError: (e: Error) => void;
	pushErrors: (errors: Error[]) => void;
	popError: (id: string) => void;
	clearErrors: () => void;
}

interface UserProviderProps {
	children: ReactNode;
}

type SetUserJWTAction = {
	type: 'SET-USER-JWT';
	payload: {
		userJWT?: string;
	};
};

type PushErrorAction = {
	type: 'PUSH_ERROR';
	payload: {
		message: string;
		id: string;
	};
};

type PushErrorsAction = {
	type: 'PUSH_ERRORS';
	payload: {
		errors: Error[];
	};
};

type PopErrorAction = {
	type: 'POP_ERROR';
	payload: {
		id: string;
	};
};

type ClearErrorsAction = {
	type: 'CLEAR_ERRORS';
};

type Action = SetUserJWTAction | ClearErrorsAction | PopErrorAction | PushErrorsAction | PushErrorAction;

const initialAppState: AppState = {
	loading: true,
	userJWT: undefined,
	setUserJWT: () => {
		/* */
	},
	errors: [],
	pushError: () => {
		/* */
	},
	pushErrors: () => {
		/* */
	},
	popError: () => {
		/* */
	},
	clearErrors: () => {
		/* */
	},
};

const reducer = (state: AppState, action: Action): AppState => {
	switch (action.type) {
		case 'SET-USER-JWT': {
			const { payload } = action;
			return {
				...state,
				userJWT: payload.userJWT,
				loading: false,
			};
		}
		case 'PUSH_ERROR': {
			const {
				payload: { message, id },
			} = action;
			return {
				...state,
				errors: [...state.errors, { id, message }],
			};
		}
		case 'PUSH_ERRORS': {
			const {
				payload: { errors },
			} = action;
			return {
				...state,
				errors: [...state.errors, ...errors],
			};
		}
		case 'POP_ERROR': {
			const {
				payload: { id },
			} = action;
			return {
				...state,
				errors: state.errors.filter(e => e.id !== id),
			};
		}
		case 'CLEAR_ERRORS': {
			return {
				...state,
				errors: [],
			};
		}
		default: {
			return { ...state };
		}
	}
};

const AppContext = createContext<AppContextValue>({
	...initialAppState,
});

export const AppProvider: FC<UserProviderProps> = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialAppState);
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { decodedToken } = useJwt<JWTUser>(state.userJWT ?? 'err');

	useEffect(() => {
		if (state.loading) {
			return;
		}
		if (state.userJWT) {
			localStorage.setItem(TOKEN_KEY, state.userJWT);
			navigate('/');
		} else {
			localStorage.removeItem(TOKEN_KEY);
			// is public route
			if (PUBLIC_ROUTES.some(p => pathname.startsWith(p))) {
				//
			} else {
				navigate('/login');
			}
		}
	}, [state.userJWT]);

	useEffect(() => {
		const loadedKey = localStorage.getItem(TOKEN_KEY);

		if (loadedKey) {
			dispatch({ type: 'SET-USER-JWT', payload: { userJWT: loadedKey } });
			navigate('/');
		} else {
			dispatch({ type: 'SET-USER-JWT', payload: { userJWT: undefined } });

			// is public route
			if (PUBLIC_ROUTES.some(p => pathname.startsWith(p))) {
				//
			} else {
				navigate('/login');
			}
		}
	}, []);

	if (state.loading) {
		return <GlobalLoader />;
	}

	return (
		<AppContext.Provider
			value={{
				...state,
				setUserJWT: (userJWT?: string) => dispatch({ type: 'SET-USER-JWT', payload: { userJWT } }),
				pushErrors: (errors: Error[]): void =>
					dispatch({
						type: 'PUSH_ERRORS',
						payload: { errors },
					}),
				pushError: (error: Error): void =>
					dispatch({
						type: 'PUSH_ERRORS',
						payload: { errors: [error] },
					}),
				popError: (id: string): void =>
					dispatch({
						type: 'POP_ERROR',
						payload: { id },
					}),
				clearErrors: () =>
					dispatch({
						type: 'CLEAR_ERRORS',
					}),
				user: decodedToken ?? undefined,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppContext;

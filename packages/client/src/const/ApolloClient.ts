import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

// todo
const ENV_API = 'http://localhost:2000';

const OverrideCache = new Proxy(new InMemoryCache(), {
	get(target, name, receiver) {
		//   console.info(`Accessing ${name} on ${target}`);
		return Reflect.get(target, name, receiver);
	},
});

export const useApolloClient = (token: string | undefined): ApolloClient<any> =>
	new ApolloClient({
		ssrMode: typeof window === 'undefined',

		cache: OverrideCache,
		defaultOptions: {
			watchQuery: {
				fetchPolicy: 'no-cache',
				errorPolicy: 'all',
			},
			query: {
				fetchPolicy: 'no-cache',
				errorPolicy: 'all',
			},
		},
		link: new HttpLink({
			uri: `${ENV_API}/graphql`,
			fetch: (url: string, init: any): any =>
				fetch(url, {
					...init,
					headers: {
						authorization: token,
						...init.headers,
					},
				}).then(response => response),
		}),
	});

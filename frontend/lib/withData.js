import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import { endpoint } from '../config';

// Set up the Apollo client (ie. graphql in the client)
function createClient({ headers }) {
	return new ApolloClient({
		uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
		request: operation => {
			operation.setContext({

				// makes sure cookies for login are included
				fetchOptions: {
					credentials: 'include',
				},
				headers,
			});
		},
	});
}

export default withApollo(createClient);

import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import { endpoint } from '../config';
import { LOCAL_STATE_QUERY } from '../components/Cart.js';

// Set up the Apollo client (ie. graphql in the client)
function createClient({ headers }) {
	return new ApolloClient({
		// Server side data
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
		// Local data
		clientState: {
			resolvers: {
				Mutation: {
					toggleCart(_, variables, client) {
						// Read the cartOpen value from the cache
						const { cartOpen } = client.cache.readQuery({
							query: LOCAL_STATE_QUERY,
						});

						// write the Cart state to the opposite
						const data = {
							data: { cartOpen: !cartOpen}
						};

						console.log({data});

						client.cache.writeData(data);
						return data;
					}
				}
			},
			defaults: {
				cartOpen: true,
			},
		},
	});
}

export default withApollo(createClient);

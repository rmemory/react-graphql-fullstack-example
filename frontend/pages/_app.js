import App, { Container } from 'next/app';
import Page from '../components/Page';

import { ApolloProvider } from 'react-apollo';
import withData from '../lib/withData';

/* Parent page. All app state will be stored here */
class MyApp extends App {
	/* 
	 * A next.js lifecycle method, which runs before render occurs
	 * 
	 * This method crawls the page to check for all GraphQL 
	 * queries and mutations to determine which need to be 
	 * called. Stated differently, this is how the data gets
	 * obtained from the server prior to render.
	 * 
	 * It is required for server side render.
	 */
	static async getInitialProps({ Component, ctx }) {
		let pageProps = {};
		
		// If the page has props, then those props will be surfaced
		// via pageProps, which are passed to the Component
		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx);
		}

		// This exposes the query to the user
		pageProps.query = ctx.query;
		return { pageProps };
	}

	render () {
		const { Component, apollo, pageProps } = this.props;

		return (
			<Container>
				<ApolloProvider client={apollo}>
					<Page>
						<Component {...pageProps}/>
					</Page>
				</ApolloProvider>
			</Container>
		)
	}
}

export default withData(MyApp);
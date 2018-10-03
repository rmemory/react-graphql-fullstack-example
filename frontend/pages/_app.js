import App, { Container } from 'next/app';
import { ApolloProvider } from 'react-apollo';

import withData from '../lib/withData';
import Page from "../components/Page";

/* Next.js uses the App component to initialize pages. You can override it 
 * and control the page initialization. Which allows you to do amazing things 
 * like:
 *
 * Persisting layout between page changes
 * Keeping state when navigating pages
 * Custom error handling using componentDidCatch
 * Inject additional data into pages (for example by processing GraphQL queries)
 */
class MyApp extends App {
	static async getInitialProps({ Component, router, ctx }) {
		let pageProps = {}
	
		// If the component has props
		if (Component.getInitialProps) {
			// Crawl the component looking for queries and mutations
			pageProps = await Component.getInitialProps(ctx)
		}
	
		// this exposes the query to the user
		pageProps.query = ctx.query;

		// Passed as props to render
		return { pageProps }
	}

	render() {
		const { Component, apollo, pageProps } = this.props;

		return (
			<Container>
				<ApolloProvider client={apollo}>
					<Page>
						<Component { ...pageProps } />
					</Page>
				</ApolloProvider>
			</Container>
		)
	}
}

export default withData(MyApp);
import App, { Container } from 'next/app';

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
	
		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx)
		}
	
		// Passed as props to render
		return { pageProps }
	}

	render() {
		const { Component, pageProps } = this.props;

		return (
			<Container>
				<Page>
					<Component />
				</Page>
			</Container>
		)
	}
}

export default MyApp;
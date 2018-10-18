This stack consists of frontend and backend component, where each of those are themselves split into two parts. This readme is for the frontend.

# Frontend (which actually has a server side component to it)

The frontend consists of a both React and Apollo. The React part is controlled via Next.js. Apollo manages state, caching, and is the client side interface to the GraphQL database on the backend.

## Next.js

Next.js handles the webpack build aspects, code splitting, and also renders each component on the server, which may or may not be the same as the database.

In Next.js each "server side" route is defined inside of the pages folder, using a single React component per route. These are all rendered by Next on the server. Each route in turn serves up a React component (or even multiple Components) which are rendered on the client side.

### getInitialProps

Next.js provides a server side method called getInitialProps(), which Next calls before it sends the Component to the client. In this app, it is used to resolve the query params in the URL and resolve the Component CSS to prevent flicker.

In theory that same getInitialProps() method, could be used to get the data required for the Component from the database before the Component is sent to the client. Here is a rather simple example of what that could look like:

```
getInitialProps = async function() {
	const result = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
	const data = await result.json();

	return {
		bpi: data.bpi
	};
}
```

The "bpi" data above becomes accessible on the client side Component via the usual props.

```
list = <li className="list-group-item">
		Bitcoin rate for {this.props.bpi.USD.description}:
		<span className="badge badge-primary">{this.props.bpi.USD.code}</span>
		<strong>{this.props.bpi.USD.rate}</strong>
	</li>
```

### Routing using pages

The pages directory in the project contains the routes. They are rendered on the server (calling getInitialProps first).

The concept of server side routing is useful in order that the entire application isn't loaded all at once, as is the case in a typical single page app. Additionally, Next.js provides webpack tooling behind the scenes which uses module splitting, which insures that only the modules required by a particular module are loaded for the components which use them.

A simple index route is created by creating a file pages/index.js, which contains the following:

```
const Index = () => (
  <div>
    <p>Hello Next.js</p>
  </div>
)

export default Index
```

### Hot module reloading

Next.js has hot module reloading for development, and displays all errors in the browser. 

### Client side routing

Even though it supports server side routing as described above, Next.js does not preclude the usage of client side routing. In order to support client-side navigation, Next.js's Link API is used, which is exported via next/link.

```
import Link from 'next/link'

const Index = () => (
  <div>
    <Link href="/about">
      <a>About Page</a>
    </Link>
    <p>Hello Next.js</p>
  </div>
)

export default Index
```

Usage of Link above is all that is required to implement client side routing. next/link does all the location.history handling for you.

Note that styles to links must be done on the a tag, not the Link component. Stated differently, this works:

```
<Link href="/about">
  <a style={{ fontSize: 20 }}>About Page</a>
</Link>
```

This does not (or more accurately the style is ignored)

```
<Link href="/about" style={{ fontSize: 20 }}>
  <a>About Page</a>
</Link>
```

Links in Next are High Order Components:

https://reactjs.org/docs/higher-order-components.html

Also note that buttons can be used instead of anchor tags. Clicking on this button causes the server to serve the about link (page).

```
<Link href="/about">
  <button>Go to About Page</button>
</Link>
```
Or anything, including a div. You just need to add the onClick property. See the docs for more examples including the HOC withRouter

https://github.com/zeit/next.js#routing

https://github.com/zeit/next.js#using-a-higher-order-component

### pages/_app.js

In this application, the only component that implements the getInitialProps is _app.js, which is basically the root for all state and handling layout for all pages.

https://nextjs.org/docs/#custom-app

The basic __app.js might look like this:

```
import App, { Container } from 'next/app';
import Page from "../components/Page";

class MyApp extends App {
	render() {
		const { Component } = this.props;

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
```

In the example above, Page is a client side component, and Component is the Route Component being rendered. That said, we need to add more functionality to our _app.js, and thus it is a bit more complex.

## Apollo

Apollo handles for us






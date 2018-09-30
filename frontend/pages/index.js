import Items from '../components/Items';

/*
 * Each "page" js file is a route
 * Note that next.js means we don't have to import React
 */

const Home = props => (
	<div>
		<Items />
	</div>
);

export default Home;
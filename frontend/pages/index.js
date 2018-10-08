import Items from '../components/Items';

const Home = (props) => (
	// query params are strings, but this one needs to be numeric
	// and return a value of 1 of page query param is not defined
	<Items queryParamPageNumber={parseFloat(props.query.page) || 1}/>
);

export default Home;
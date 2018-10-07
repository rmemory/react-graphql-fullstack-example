import UpdateItem from '../components/UpdateItem';

const Update = (props) => (
	<div>
		{/* IDs are in the query params on the update page. 
			See _app.js */}
		<UpdateItem id={props.query.id}/>
	</div>
);

/* We could wrap this in withRouter HOC to get the query params,
   but there is no need to use an HOC because we have exposed the
   query params to all pages in our _app.js getInitialProps. */
export default Update;
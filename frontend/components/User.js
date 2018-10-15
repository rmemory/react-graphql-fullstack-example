import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const CURRENT_USER_QUERY = gql`
	query {
		me {
			id
			email
			name
			permissions
		}
	}
`;

/*
 * Run the user query. This is intended to be used as a render prop component
 * meaning it is a child of some other component. For example,
 * 
 * <User>
	{
		(data) => {
			console.log(data)
			return <p>User</p>
		}
	}
	</User>
*/
class User extends Component {
	render() {
		return (
			// All props from parent component will be passed along by default
			<Query {...this.props} query={CURRENT_USER_QUERY}>
				{payload => this.props.children(payload)}
			</Query>
		);
	}
}

User.propTypes = {
	children: PropTypes.func.isRequired,
}

export default User;
export { CURRENT_USER_QUERY };
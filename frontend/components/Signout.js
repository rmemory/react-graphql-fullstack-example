import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const SIGN_OUT_MUTATION = gql`
	mutation SIGN_OUT_MUTATION {
		signout {
			message
		}
	}
`;

class Signout extends Component {
	render() {
		return (
			<Mutation 
				mutation={SIGN_OUT_MUTATION}
				refetchQueries = {[{
					query: CURRENT_USER_QUERY
				}]}
			>
			{
				(signoutMutation) => <button onClick={signoutMutation}>Sign out</button>
			}
			</Mutation>
		);
	}
}

export default Signout;
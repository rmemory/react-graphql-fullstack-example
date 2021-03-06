import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNUP_MUTATION = gql`
	mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
		signup(email: $email, name: $name, password: $password) {
			id
			email
			name
		}
	}
`;

class Signup extends Component {
	state = {
		email: '',
		name: '',
		password: '',
	}

	saveToState = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	render() {
		return (
			<Mutation 
				mutation={SIGNUP_MUTATION} 
				variables={this.state}
				refetchQueries={[
					{
						query: CURRENT_USER_QUERY,
						variables: {},
					}
				]}
			>
				{(signupMutationFunction, {error, loading}) => {
					return (
						<Form
							method="post"
							onSubmit={async (e) => {
								e.preventDefault();
								const res = await signupMutationFunction(); //variables passed here

								// Only reaches here if signup fails
								this.setState({
									id: '',
									name: '',
									password: '',
								});
							}}
						>
							<fieldset disabled={loading} aria-busy={loading}>
								<h2>Sign up for an account</h2>
								{/* TODO, better error parsing needed */}
								<Error error={error} /> 

								<label htmlFor="email">
									Email
									<input 
										type="text" 
										name="email" 
										placeholder="email" 
										value={this.state.email} 
										onChange={this.saveToState}/>
								</label>
								<label htmlFor="name">
									Name
									<input 
										type="text" 
										name="name" 
										placeholder="name" 
										value={this.state.name} 
										onChange={this.saveToState}/>
								</label>
								<label htmlFor="password">
									Password
									<input 
										type="password" 
										name="password" 
										value={this.state.password} 
										onChange={this.saveToState}/>
								</label>
								<button type="submit">Sign Up!</button>
							</fieldset>
						</Form>
					);
				}}
			</Mutation>
		);
	}
}

export default Signup;
import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import Error from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
	query SINGLE_ITEM_QUERY($id: ID!) {
		item(where: { id: $id }) {
			id
			title
			description
			price
		}
	}
`;

const UPDATE_ITEM_MUTATION = gql`
	mutation UPDATE_ITEM_MUTATION($id: ID!, $title: String, $description: String, $price: Int) {
		updateItem(id: $id, title: $title, description: $description, price: $price) {
		id
		title
		description
		price
		}
	}
`;

class UpdateItem extends Component {
	state = {
		// Empty default state, because we are only putting things
		// into state if those items have changed. Unchanged items
		// will not make it into state.
	};

	handleChange = e => {
		const { name, type, value } = e.target;
		const val = type === 'number' ? parseFloat(value) : value;
		this.setState({ [name]: val });
	};

	updateItem = async (e, updateItemMutation) => {
		e.preventDefault();
		console.log('Updating Item!!');
		console.log(this.state);
		const res = await updateItemMutation({
			variables: {
				id: this.props.id,

				// Only include the fields which have changed
				...this.state,
			},
		});
		console.log('Updated!!');
	};

	render() {
		return (
			<Query 
				query={SINGLE_ITEM_QUERY}
				variables={{
						id: this.props.id,
					}}
			>
				{({ data, loading }) => {
					if (loading) return <p>Loading...</p>;

					// Without the e.preventDefault in the updateItem above, it causes 
					// all of the elements from the form to be put onto the query 
					// params in the URL, which in turn will cause this component to
					// puke because it needs the ID in the query params. This conditional
					// prevents that error from occuring. Also, it protects against a situation 
					// where the user reaches the update page (possibly by directly typing in
					// that URL) but they haven't included the necessary ID in the query params.
					if (!data.item) return <p>No Item Found for ID {this.props.id}</p>;

					return (
						<Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
							{(updateItemMutation, { loading, error }) => (
								<Form onSubmit={e => this.updateItem(e, updateItemMutation)}>
									<Error error={error} />
									<fieldset disabled={loading} aria-busy={loading}>
										<label htmlFor="title">
											Title
											<input 
												type="text" 
												id="title" 
												name="title" 
												placeholder="Title" 
												required
												defaultValue={data.item.title}
												onChange={this.handleChange}
											/>
										</label>

										<label htmlFor="price">
											Price
											<input 
												type="number" 
												id="price" 
												name="price" 
												placeholder="Price" 
												required
												defaultValue={data.item.price}
												onChange={this.handleChange}
											/>
										</label>

										<label htmlFor="description">
											Description
											<textarea
												id="description" 
												name="description" 
												placeholder="Enter a description" 
												required
												defaultValue={data.item.description}
												onChange={this.handleChange}
											/>
										</label>
										<button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>
									</fieldset>
								</Form>
							)}
						</Mutation>
					);
				}}
			</Query>
		);
	}
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };

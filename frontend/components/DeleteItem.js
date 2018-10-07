import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { ALL_ITEMS_QUERY } from './Items';

// Stuff after deleteItem is the return value, which in this case
// is the ID of the item deleted
const DELETE_ITEM_MUTATION = gql`
	mutation DELETE_ITEM_MUTATION($id: ID!) {
		deleteItem(id: $id) {
			id
		}
	}
`;

class DeleteItem extends Component {
	update = (cache, payload) => {
		// manually update the cache on the client so it matches 
		// the server
		// 1. read the cahce for the items we want (the list of 
		//	  of the items, which includes the one we deleted 
		//	  still).
		const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
		console.log(data, payload);
		// 2. filter the deleted item out of the page
		data.items = data.items.filter(item => {
			console.log(item);
			return item.id !== payload.data.deleteItem.id;
		});

		// 3. Put the filtered items back into the cache
		cache.writeQuery({query: ALL_ITEMS_QUERY, data });
	}

	render() {
		return (
			<Mutation 
				mutation={DELETE_ITEM_MUTATION} 
				variables={{id: this.props.id }}
				update={this.update}>
				{(deleteItemMutation, {error}) => {
					return <button onClick={() => {
						if(confirm('Are you sure you want to delete this item?')) {
							deleteItemMutation();
						}
					}}>
						{this.props.children}
					</button>
				}}
			</Mutation>
		);
	}
}

export default DeleteItem;
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';

import Item from './Item';

// GraphQL query (only the information we need, not like REST)
const ALL_ITEMS_QUERY = gql`
	query ALL_ITEMS_QUERY {
		items {
			id
			title
			price
			description
			image
			largeImage
		}
	}
`;

const Center = styled.div`
	text-align: center;
`;

const ItemsList = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 60px;
	max-width: ${props => props.theme.maxWidth}
	margin: 0 auto;
`;

class Items extends Component {
	render() {
		return (
			<Center>
				{/* Instead of a "high order component" like is used in Redux,
					we instead are using Apollo and they recommend using 
					render props, like we are doing here. To be clear, Apollo
					still does support the high order component method, but 
					they recomment render props. Furthermore, mutations, or 
					the error or loading states with high order components,
					which is yet another reason to use render props like we 
					are doing here.*/}
				<Query query={ALL_ITEMS_QUERY}>
					{/* Incoming data from query is the payload, which we 
						destructure as we only care about data, error, and
						loading
						
						We must supply a function in the child props of the
						Query. */}
					{({data, error, loading}) => {
						if (loading) return <p>Loading ...</p>
						if (error) return <p>Error: {error.message}</p>

						return <ItemsList>
							{data.items.map(item => <Item key={item.id} item={item}/>)}
						</ItemsList>
					}}
				</Query>
			</Center>
		);
	}
}

export default Items;
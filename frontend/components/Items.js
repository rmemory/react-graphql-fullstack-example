import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from './Item';

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

const CenterDiv = styled.div`
	text-align: center;
`;

const ItemsListDiv = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 60px;
	max-width: ${props => props.theme.maxWidth};
	margin: 0 auto;
`;

class Items extends Component {
	render() {
		return (
			<CenterDiv>
				<Query query={ALL_ITEMS_QUERY}>
					{({data, loading, error}) => {
						if (loading) return <p>Loading ...</p>
						if (error) return <p>Error: {error.message}</p>
						return <ItemsListDiv>
							{data.items.map(item=> {
								console.log(item.description);
								return <Item key={item.id} item={item}/>
							})}
						</ItemsListDiv>
					}}
				</Query>
			</CenterDiv>
		);
	}
}

export default Items;
export { ALL_ITEMS_QUERY };

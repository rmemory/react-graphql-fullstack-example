import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';

import Item from './Item';
import Pagination from "./Pagination";
import { perPage } from "../config";

const ALL_ITEMS_QUERY = gql`
	query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
		items(first: $first, skip: $skip, orderBy: createdAt_ASC) {
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
				<Pagination queryParamPageNumber={this.props.queryParamPageNumber} />
					<Query 
						query={ALL_ITEMS_QUERY} 
						// fetchPolicy="network-only" // means never use the cache
						variables={{
						skip: this.props.queryParamPageNumber * perPage - perPage,
						first: perPage
					}}>
						{({data, loading, error}) => {
							if (loading) return <p>Loading ...</p>
							if (error) return <p>Error: {error.message}</p>
							
							return <ItemsListDiv>
								{data.items.map(item=> {
									// console.log(item.description);
									return <Item key={item.id} item={item}/>
								})}
							</ItemsListDiv>
						}}
					</Query>
				<Pagination queryParamPageNumber={this.props.queryParamPageNumber} />
			</CenterDiv>
		);
	}
}

export default Items;
export { ALL_ITEMS_QUERY };

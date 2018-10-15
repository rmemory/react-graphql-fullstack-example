import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';

import { perPage } from "../config";

import PaginationStyles from './styles/PaginationStyles';

const PAGINATION_QUERY = gql`
	query PAGINATION_QUERY {
		itemsConnection {
			aggregate {
				count
			}
		}
	}
`;

class Pagination extends Component {
	render() {
		return (
				<Query query={PAGINATION_QUERY}>
					{({data, loading, error})=> {
						const count = data.itemsConnection.aggregate.count;
						const pages = Math.ceil(count / perPage);
						const page = this.props.queryParamPageNumber;
						return (
							<PaginationStyles>
								<Head>
									<title>Sick Fits! - Page {page} of {pages}</title>
								</Head>
								<Link
									prefetch
									href={{
										pathname: "items",
										query: { page: page - 1 }
									}}
								>
									<a className="prev" aria-disabled={page <= 1}>Prev</a>
								</Link>
								<p>Page {this.props.queryParamPageNumber} of {pages}</p>
								<p>{count} Items Total</p>
								<Link
									prefetch
									href={{
										pathname: "items",
										query: { page: page + 1 }
									}}
								>
									<a className="next" aria-disabled={page >= pages}>Next</a>
								</Link>
							</PaginationStyles>
						);
					}}
				</Query>
		);
	}
}

export default Pagination;
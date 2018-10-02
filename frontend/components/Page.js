import React, { Component } from 'react';
import styled, { ThemeProvider, injectGlobal } from 'styled-components';

import Header from './Header';
import Meta from './Meta';

const theme = {
	red: '#FF0000',
	black: '#393939',
	grey: '#3A3A3A',
	lightgrey: '#E1E1E1',
	offWhite: '#EDEDED',
	maxWidth: '1000px',
	bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
};

const PageDiv = styled.div`
	background: white;
	color: ${props => props.theme.black};
`;

const ComponentDiv = styled.div`
	max-width: ${props => props.theme.maxWidth};
	margin: 0 auto;
	padding: 2rem;
`;

/* Page wraps all other Components. See pages/_app.js. */
class Page extends Component {
	render() {
		return (
			<ThemeProvider theme={theme}>
				<PageDiv>
					<Meta />
					<Header />

					{/* All components (other than those above like Meta, Header) are
					rendered inside of InnerDiv */}
					<ComponentDiv>
						{this.props.children}
					</ComponentDiv>
				</PageDiv>
			</ThemeProvider>
		);
	}
}

export default Page;
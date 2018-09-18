import React, { Component } from 'react';
import Meta from './Meta';
import Header from './Header';
import styled, { ThemeProvider, injectGlobal } from 'styled-components';

/* 
 * Wraps all components, general theming goes here
 */

 const theme = {
	red: '#FF0000',
	black: '#393939',
	grey: '#3A3A3A',
	lightgrey: '#E1E1E1',
	offWhite: '#EDEDED',
	maxWidth: '1000px',
	// No horizontal offset, vertical offset, blur size, spread, color
	bs: '0 12px 24px 0 rgba(0,0,0,0.09)',
 }

const StyledPage = styled.div`
	background: white;
	color: ${props => props.theme.black};;
`;

const Inner = styled.div`
	max-width: ${props => props.theme.maxWidth};
	margin: 0 auto; // Center horizontally according to max width
	padding: 2rem;
`;

export default class Page extends Component {
	render() {
		return (
			<ThemeProvider theme={theme}>
				<StyledPage>
					<Meta />
					<Header />
					<Inner>{this.props.children}</Inner>
				</StyledPage>
			</ThemeProvider>
		);
	}
}

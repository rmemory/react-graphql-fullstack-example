import React, { Component } from 'react';
import Meta from './Meta';
import Header from './Header';
import styled from 'styled-components';

/* 
 * Wraps all components, general theming goes here
 */

const MyButton = styled.button`
	display: block;
	background: red;
	font-size: 50px;
	color: ${props => props.green ? 'green' : 'black'};
	span {
		font-size: 100px;
	}
	.big-arrow {
		font-size: 125px;
	}
`;

// const BigArrow = styled.span`
// 	font-size: 100px;
// `;

export default class Page extends Component {
	render() {
		return (
			<div>
				<Meta />
				<Header />
				<MyButton green={true}>
					Click Me
					<span>-></span>
				</MyButton>
				<MyButton>
					Click Me
					<span className="big-arrow">-></span>
				</MyButton>
				{this.props.children}
			</div>
		);
	}
}

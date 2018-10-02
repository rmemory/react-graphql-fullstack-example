import React, { Component } from 'react';
import styled from 'styled-components';

import Header from './Header';
import Meta from './Meta';

const MyButton = styled.button`
	background: red;
	font-size: ${props => props.huge ? '100px' : '50px'};

	span {
		font-size: 100px;
	}

	.medium-arrow {
		font-size: 75px;
	}
`;

/* Page wraps all other Components. See pages/_app.js. */
class Page extends Component {
	render() {
		return (
			<div>
				<Meta />
				<Header />
				<MyButton>
					Click Me
					<span>-></span>
				</MyButton>

				<MyButton huge>
					Click Me
					<span className="medium-arrow">-></span>
				</MyButton>
				{this.props.children}
			</div>
		);
	}
}

export default Page;
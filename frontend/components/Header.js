import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';
import NProgress from 'nprogress';

import Cart from './Cart';
import Nav from './Nav';

Router.onRouteChangeStart = () => {
	NProgress.start();
};

Router.onRouteChangeComplete = () => {
	NProgress.done();
};

Router.onRouteChangeError = () => {
	NProgress.done();
};

const HeaderDiv = styled.div`
	.bar {
		border-bottom: 10px solid ${props => props.theme.black};
		display: grid;
		grid-template-columns: auto 1fr;
		justify-content: space-between;
		align-items: stretch;
		
		@media (max-width: 1300px) {
			grid-template-columns: 1fr;
			justify-content: center;
		}
	}

	.sub-bar {
		display: grid;
		grid-template-columns: 1fr auto;
		border-bottom: 1px solid ${props => props.theme.lightgrey};
	}
`;

const LogoH1 = styled.h1`
	font-size: 4rem;
	margin-left: 2rem;
	position: relative;
	z-index: 2;
	transform: skew(-7deg);

	a {
		padding: 0.5rem 1rem;
		background: ${props => props.theme.red};
		color: white;
		text-transform: uppercase;
		text-decoration: none;
	}

	@media (max-width: 1300px) {
		margin: 0;
		text-align: center;
	}
`;

const Header = () => (
	<HeaderDiv>
		<div className="bar">
			<LogoH1>
				<Link href="/">
					<a>Sick Fits</a>
				</Link>
			</LogoH1>
			<Nav />
		</div>
		<div className="sub-bar">
			<p>Search</p>
		</div>
		<Cart/>
	</HeaderDiv>
);

export default Header;
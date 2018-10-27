import Link from 'next/link';
import { Mutation } from 'react-apollo';

import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout'
import { TOGGLE_CART_MUTATION } from '../components/Cart.js';

const Nav = () => (
	<User>
		{
			({data: { me }}) => {
				return (
					<NavStyles>
						{/* Always show for all users */}
						<Link href="/">
							<a>Shop</a>
						</Link>

						{/* Only show if the user is signed in  */}
						{me && (
							<>
								<Link href="/sell">
									<a>Sell</a>
								</Link>
								<Link href="/orders">
									<a>Orders</a>
								</Link>
								<Link href="/me">
									<a>Account</a>
								</Link>
								<Signout />

								<Mutation mutation={TOGGLE_CART_MUTATION}>
									{(toggleCart) => (
										<button onClick={toggleCart}>My Cart</button>
									)}
								</Mutation>

							</>
						)}

						{/* Not signed in */}
						{!me && (
							<Link href="/signup">
								<a>Signin</a>
							</Link>
						)}
					</NavStyles>
				)
			}
		}
	</User>
);

export default Nav;
import Link from 'next/link';

import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout'

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
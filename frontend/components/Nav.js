/* By using Link instead of a regular anchor link, it means
 * the link is bound to HTML5 push state */
import Link from 'next/link';

const Nav = () => (
	<div>
		<Link href="/">
			<a>Go home!</a>
		</Link>
		<Link href="/sell">
			<a>Sell!</a>
		</Link>
	</div>
)

export default Nav;
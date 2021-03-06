// let's go!
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');

// Create the Yoga server
const server = createServer();

// Use express middleware to handle cookies (JWT)
/*
 * This puts the cookie into a nicely formatted cookie
 * object rather than just a cookie string.
 */
server.express.use(cookieParser());

// decode the JWT so we can get the user Id on each request
server.express.use((req, res, next) => {
	const { token } = req.cookies;
	if (token) {
		// Get the token from the cookie, and the userId from  the token
		const { userId } = jwt.verify(token, process.env.APP_SECRET);
		
		// put the userId onto the req for requests in the "next" chain to access
		req.userId = userId;
	}
	next();
});

// Use express middleware to populate current user

server.express.use(async (req, res, next) => {
	// if they aren't logged in, skip this
	if (!req.userId) 
		return next();

	const user = await db.query.user(
		{ where: { id: req.userId } },
		'{ id, permissions, email, name }'
	);
	req.user = user;
	next();
});

server.start(
	{
		// Approved front end URLs only
		// can access the server
		cors: {
			credentials: true,
			origin: process.env.FRONTEND_URL,
		},
	},

	deets => {
		console.log(`Server is now running on port http://localhost:${deets.port}`);
	}
);
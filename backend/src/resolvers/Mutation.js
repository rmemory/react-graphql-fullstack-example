const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail');
const { hasPermission } = require('../utils');

const mutations = {
	async createItem(parent, args, ctx, info) {
		if (!ctx.request.userId) {
			throw new Error('You must be logged in to create an item')
		}

		const item = await ctx.db.mutation.createItem({
			data: {
				/* This is how we create a relationship between
				   user and item */
				user: {
					connect: {
						id: ctx.request.userId,
					},
				},
				...args
			}
		}, info);

		return item;
	},

	async updateItem(parent, args, ctx, info) {
		// Make a copy of the item(s) being updated
		const updates = { ...args };

		// remove the ID from the copy, because we aren't
		// changing the ID value in the database
		delete updates.id;

		// run the update mutation
		const item = await ctx.db.mutation.updateItem({
			data: updates,
			where: {
				// again, we aren't updating the ID value, but
				// we do need to use the ID in the where clause.
				id: args.id
			}
			// info somehow tells Prisma GraphQL what to return
			// in this case an item as per schema.graphql. More
			// specifically, info is the stuff inside the curly 
			// braces **after** the mutation/query function 
			// specified in the gql graphql-tag from the front 
			// end component
		}, info);

		console.log(item);
		return item; 
	},

	async deleteItem(parent, args, ctx, info) {
		const where = { id: args.id };
		// 1. find and get the item. Typically we would pass in 
		// info here (which is the query obtained from the frontend). 
		// In this case we are using raw graphql, aka `{ id title}`
		const item = await ctx.db.query.item({where}, `{ id title user {id}}`);

		// 2. Check to make sure they own the ID or have permissions.
		const ownsItem = item.user.id === ctx.request.userId;
		const hasPermissions = ctx.request.user.permissions.some(permission => ['ADMIN', 'ITEMDELETE'].includes(permission));

		if (!ownsItem && hasPermissions) {
			throw new Error('You don\'t have permission to delete that item');
		} 

		// 3. Delete it
		return await ctx.db.mutation.deleteItem({where}, info);
	},

	async signup(parent, args, ctx, info) {
		// make sure email is always lower case
		args.email = args.email.toLowerCase();

		// one-way hash the password
		// SALT length is 10 (makes each hash value unique)
		const password = await bcrypt.hash(args.password, 10);

		// create the user
		const user = await ctx.db.mutation.createUser({
			data: {
				...args, // includes password, but this is overriden
				password: password, // Override password
				permissions: { set: ['USER']} // default permission is USER
			},
		}, info);

		// create JWT token for user (this is the authentication mechanism)
		// Use https://jwt.io to decode the jwt value stored in token
		const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

		/*
		 * set the jwt as a cookie.
		 * 
		 * By using a cookie to store the JWT token it allows us to perform
		 * server side render of the "logged in parts". 
		 * 
		 * The server controls how long the cookie is good for, and the 
		 * frontend always returns the cookie with the JWT as a payload, 
		 * allowing the server to determine if the front end is using an 
		 * authenticated user .... and if not to take appropriate action.
		 * 
		 * Cookies are always sent from the client to the server on each 
		 * request. Data stored in local storage does not.
		 */ 
		ctx.response.cookie('token', token, {
			httpOnly: true, // The cookie and hence JWT token can only be accessed via http, and not JS
			maxAge: 1000 * 60 * 60 * 24 * 365, // one year timeout on cookie and signin
		});

		// return the user object to the mutation (called by Apollo on the front end)
		return user;
	},

	async signin(parent, {email, password}, ctx, info) {
		// check if there is a user associated with that email
		const user = await ctx.db.query.user({where: {email: email}})

		// check if the password is correct
		if (!user) {
			// Might not want to return a message here for security reasons
			// because this tells a hacker that the email address doesn't
			// have an account, where if the error doesn't appear but the
			// login is unsuccessful, that means there is an account now 
			// they just need to guess the password
			throw new Error(`Unrecognized signin credentials`);
		}

		// generate the JWT token for the session (comparing hash to hash)
		const valid = await bcrypt.compare(password, user.password);

		if (!valid) {
			throw new Error(`Invalid password`);
		}

		// set the cookie with the token
		const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
		ctx.response.cookie('token', token, {
			httpOnly: true, // The cookie and hence JWT token can only be accessed via http, and not JS
			maxAge: 1000 * 60 * 60 * 24 * 365, // one year timeout on cookie and signin
		});

		console.log(user);

		// return the user
		return user;
	},

	async signout(parent, args, ctx, info) {
		ctx.response.clearCookie('token');
		return { message: 'Goodbye'}
	},

	async requestReset(parent, args, ctx, info) {
		//1. Check if real user
		const user = await ctx.db.query.user({where: {email: args.email}});
		if (!user) {
			throw new Error(`No such user found for email ${args.email}`);
		}

		//2. Set a reset token and expiry on that user
		const randomBytesPromisified = promisify(randomBytes);

		const resetToken = (await randomBytesPromisified(20)).toString('hex');
		const resetTokenExpiry = Date.now() + 36000000; // 1 hour
		const res = await ctx.db.mutation.updateUser({
			where: {email: args.email},
			data: {resetToken: resetToken, resetTokenExpiry: resetTokenExpiry}
		});

		//3. email them that reset token and return
		const mailRes = await transport.sendMail({
			from: 'jake@barlow.com',
			to: user.email,
			subject: 'Your password reset token',
			html: makeANiceEmail(`Your password reset token is here!
								 \n\n
								 <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">
									 Click here to reset
								</a>`)
		});

		// Return
		return { message: 'Thanks' };
	}, 

	async resetPassword(parent, args, ctx, info) {
		// Check if passwords match
		if (args.password != args.confirmPassword) {
			throw new Error("New password does not match confirmed password");
		}

		// Check if it is a legit reset token
		// Check if token has expired
		const [user] = await ctx.db.query.users({
			where: {
				resetToken: args.resetToken,
				resetTokenExpiry_gte: Date.now() - 36000000,
			}
		});

		if (!user) {
			throw new Error(`Invalid password reset token`);
		}

		// Hash the new password
		// Save the new password and remove resetToken, resetTokenExpiry
		// SALT length is 10 (makes each hash value unique)
		const password = await bcrypt.hash(args.password, 10);

		// update the user
		const updatedUser = await ctx.db.mutation.updateUser({
			where: {
				email: user.email
			},
			data: {
				password: password, // Override password
				resetToken: null,
				resetTokenExpiry: null,
			},
		});

		// generate new JWT
		// Set the new JWT cookie
		const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
		ctx.response.cookie('token', token, {
			httpOnly: true, // The cookie and hence JWT token can only be accessed via http, and not JS
			maxAge: 1000 * 60 * 60 * 24 * 365, // one year timeout on cookie and signin
		});

		// return the updated user
		return updatedUser;
	},

	async updatePermissions(parent, args, ctx, info) {
		//1. Check if they are logged in
		if (!ctx.request.userId) {
			throw new Error("You must be logged in");
		}

		//2. Query the current user
		const currentUser = await ctx.db.query.user({
			where: {
				id: ctx.request.userId,
			}
		}, info);

		//3. check if they have permissions to do this
		hasPermission(currentUser, ['ADMIN', ' PERMISSIONUPDATE']);

		//4. update the permissions
		return ctx.db.mutation.updateUser({
			data: {
				permissions: {
					set: args.permissions,
				}
			},
			where: {
				id: args.userId, // might not be and doesn't have to be current logged in user
			},
		}, info);
	},
	
	/*
	mutation createDog {
`		createDog(name: "inko") {
			name
		}
`	}
	*/
	/*
	createDog(parent, args, ctx, info) {
		global.dogs = global.dogs || [];

		const newDog = { name: args.name };
		global.dogs.push(newDog);
		return newDog;
	}
	*/
};

module.exports = mutations;

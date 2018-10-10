const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');

const mutations = {
	async createItem(parent, args, ctx, info) {
		// TODO: check if user is logged in
		const item = await ctx.db.mutation.createItem({
			data: {
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
		const item = await ctx.db.query.item({where}, `{ id title}`);

		// 2. Check to make sure they own the ID or have permissions.
		// TODO

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
	}
	
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

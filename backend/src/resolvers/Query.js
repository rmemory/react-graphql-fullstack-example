const { forwardTo} = require('prisma-binding');

const Query = {
	/*
	query allItems {
		items {
			title
			id
		}
	} */

	/* This is equivalent to getAllItems, with no validation or 
	   authentication */

	/* Here is the long hand way of doing items: forwardTo('db;) */
	async items(parent, args, ctx, info){
		const items = await ctx.db.query.items(args);
		return items;
	},
	// items: forwardTo('db'),

	/* Get a single item */
	item: forwardTo('db'),

	/* Get aggreate data */
	itemsConnection: forwardTo('db'),

	// Get current logged in user if any, null is valid if no user logged in
	me(parent, args, ctx, info) {
		// Check if there is a current user id
		if (!ctx.request.userId) {
			return null; // no user, but this is a valid response
		}

		return ctx.db.query.user({
			where: {id: ctx.request.userId},
		}, info);
	},

	/* Some simply examples */
	/*
	query getDogs {
		dogs {
			name
		}
	}
	 */
	/*
	dogs(parent, args, ctx, info) {
		global.dogs = global.dogs || [];
		return global.dogs;
	}
	*/
};

module.exports = Query;

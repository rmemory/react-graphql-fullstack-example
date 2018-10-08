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
		const items = await ctx.db.query.items();
		return items;
	},
	// items: forwardTo('db'),

	/* Get a single item */
	item: forwardTo('db'),

	/* Get aggreate data */
	itemsConnection: forwardTo('db'),

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

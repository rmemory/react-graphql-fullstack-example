const { forwardTo} = require('prisma-binding');

const Query = {
	/*
	query allItems {
		items {
			title
			id
		}
	}
	 */
	items: forwardTo('db'),
	// async items(parent, args, ctx, info){
	// 	const items = await ctx.db.query.items();
	// 	return items;
	// }
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

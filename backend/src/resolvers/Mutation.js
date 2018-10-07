

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

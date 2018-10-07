

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
			// in this case an item as per schema.graphql.
			// I guess info contains the mutation from the client 
			// side, although I still don't know how that tells
			// prisma to return an "Item". Something to do with 
			// ASTs
		}, info);

		console.log(item);
		return item; 
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

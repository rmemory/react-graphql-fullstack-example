const Mutations = {
	async createItem(parent, args, ctx, info) {
		// TODO: Authenticate user
		const argsForPrisma = args.data;
		const item = await ctx.db.mutation.createItem({
			data: {
				// ...args
				...argsForPrisma
			},
		}, info);

		return item;
	},
};

module.exports = Mutations;

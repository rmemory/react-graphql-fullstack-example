const { GraphQLServer } = require('graphql-yoga');

const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const db = require('./db');

// Create the GraphQL Yoga Server

function createServer() {
	return new GraphQLServer({
		typeDefs: 'src/schema.graphql',
		resolvers: {
			Mutation: Mutation,
			Query: Query,
		},
		

		/*
		 * Turn off resolver warnings (its magic)
		 */
		resolverValidationOptions: {
			requireResolversForResolveType: false,
		},

		/*
		 * Each HTTP request and db is passed to resolvers via ctx
		 */
		context: req => ({ ...req, db }),
	});
}

module.exports = createServer;
// This file connects to the prisma DB and gives us
// access to the DB

const { Prisma } = require('prisma-binding');

// Created by the npm run deploy step
const db = new Prisma({ 
	typeDefs: 'src/generated/prisma.graphql',
	endpoint: process.env.PRISMA_ENDPOINT,
	secret: process.env.PRISMA_SECRET,

	// console logs queries and mutations if true (noisy)
	debug: false,
});

module.exports = db;
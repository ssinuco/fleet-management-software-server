const fs = require('fs');
const path = require('path');

const Query = require('./resolvers/Query');
const Taxi = require('./resolvers/Taxi');
const Trajectory = require('./resolvers/Trajectory');

const { PrismaClient } = require("@prisma/client");
const { ApolloServer } = require('apollo-server-express');
const express = require('express');

const resolvers = {
  Query,
  Taxi,
  Trajectory
}

const prisma = new PrismaClient({ log: [{ level: "query", emit: "event" }] });
prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Duration: ' + e.duration + 'ms')
});

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, './schemas/schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: {
    prisma,
  }
});

(async () => {

  await server.start();
  const app = express();
  server.applyMiddleware({
     app,
     path: '/graphql'
  });

  // Modified server startup
  await new Promise(resolve => app.listen({ port: 8080 }, resolve));
  console.log(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`);
})();

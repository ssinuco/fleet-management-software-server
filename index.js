const fs = require('fs');
const path = require('path');

const Query = require('./resolvers/Query');
const Taxi = require('./resolvers/Taxi');
const Trajectory = require('./resolvers/Trajectory');

const { PrismaClient } = require("@prisma/client");
const { ApolloServer, gql } = require('apollo-server-fastify');
const fastify = require('fastify')

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

(async function () {
  await server.start();

  const app = fastify({ logger: true });
  app.register(server.createHandler());
  await app.listen(8080, function (err, address) {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    app.log.info(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`)
  });
})();


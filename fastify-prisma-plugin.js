const fp = require('fastify-plugin')
const { PrismaClient } = require("@prisma/client");

function prismaPlugin (fastify, opts, done) {
  console.log("creating prisma client...");
  const prisma = new PrismaClient({ log: [{ level: "query", emit: "event" }] });
  prisma.$on('query', (e) => {
    console.log('Query: ' + e.query)
    console.log('Duration: ' + e.duration + 'ms')
  });
  fastify.decorate('prisma', prisma);
  done();
}

module.exports = fp(prismaPlugin);

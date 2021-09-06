const fastify = require('fastify')
const fastifyCORS = require('fastify-cors');

const app = fastify({ logger: true });
app.register(fastifyCORS, {
  origin: "*",
  methods: ['GET', 'PUT', 'POST'],
});
app.register(require('./fastify-prisma-plugin'));
app.register(require('./routes'));

app.listen(8080, function (err, address) {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`server listening on ${address}`)
})

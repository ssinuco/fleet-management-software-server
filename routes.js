const { DateTime } = require("luxon");
const taxisSchema = require("./schemas/get-taxis-schema");
const trajectoriesSchema = require("./schemas/get-trajectories-schema");

async function routes(fastify, options) {
  fastify.get("/api/taxis", {schema: taxisSchema}, async (req, res) => {
    const { query, page, pageSize } = req.query;

    console.log(query, page, pageSize);

    const taxis = await fastify.prisma.taxi.findMany({
      where: {
        plate: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: Number(pageSize),
      skip: Number((Number(page) - 1) * pageSize) || 0,
      orderBy: {
        plate: "asc",
      },
    });
    return taxis;
  });

  fastify.get("/api/trajectories/:taxiId", {schema: trajectoriesSchema}, async (req, res) => {
    const { taxiId } = req.params;
    const { date } = req.query;

    const startDate = DateTime.fromISO(date).setZone("America/Bogota");
    const endDate = startDate.plus({ days: 1 });

    const trajectories = await fastify.prisma.trajectory.findMany({
      where: {
        taxiId: Number(taxiId),
        date: {
          gte: new Date(startDate.toISO()),
          lt: new Date(endDate.toISO()),
        },
      },
    });
    return trajectories;
  });
}
module.exports = routes;

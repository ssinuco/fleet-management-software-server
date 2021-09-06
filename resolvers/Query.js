const { DateTime } = require("luxon");

async function taxis (parent, args, context) {
  const { query, page, pageSize } = args;

  return context.prisma.taxi.findMany({
    where: {
      plate: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: Number(pageSize) || undefined,
    skip: Number((page - 1) * pageSize) || undefined,
    orderBy: {
      plate: "asc",
    },
  });
};

async function trajectories (parent, args, context) {
  const { taxiId, date } = args;

  const startDate = DateTime.fromISO(date).setZone("America/Bogota");
  const endDate = startDate.plus({ days: 1 });

  return  context.prisma.trajectory.findMany({
    where: {
      taxiId: Number(taxiId),
      date: {
        gte: new Date(startDate.toISO()),
        lt: new Date(endDate.toISO()),
      },
    },
  });
}

module.exports = {
  taxis,
  trajectories
};

const { DateTime } = require("luxon");
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({log: [{ level: 'query', emit: 'event' }],});
prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Duration: ' + e.duration + 'ms')
})

const app = express();
app.use(express.json());

app.get('/api/taxis', async(req, res) => {
  const { query, page, pageSize } = req.query

  console.log(query, page, pageSize);

  const taxis = await prisma.taxi.findMany({
    where: {
      plate : {
        contains: query,
        mode: 'insensitive',
     }
    },
    take: Number(pageSize) || undefined,
    skip: Number( (page - 1) * pageSize) || undefined,
    orderBy: {
      plate: 'asc'
    },
  })
  res.json(taxis)
});

app.get('/api/trajectories/:taxiId', async(req, res, next) => {
  const { taxiId } = req.params;
  const { date } = req.query

  const startDate = DateTime.fromISO(date).setZone("America/Bogota");
  const endDate = startDate.plus({days: 1});

  const trajectories = await prisma.trajectory.findMany({
    where: {
      taxiId : Number(taxiId),
      date: {
        gte: new Date(startDate.toISO()),
        lt:  new Date(endDate.toISO()),
      }
    }
  })
  res.json(trajectories);
});

const server = app.listen(8080, () => console.log('🚀 Server ready at: http://localhost:8080'))

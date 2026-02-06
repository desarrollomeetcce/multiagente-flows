// engine/followUpWorker.js
const Queue = require('bull');
const prisma = require('../prisma/client');
const { executeActions } = require('./services/executor');

const queue = new Queue('FOLLOW_UP_EXECUTION');

queue.process(async (job) => {
  const { responseId, event } = job.data;

  const response = await prisma.response.findUnique({
    where: { id: responseId },
    include: { actions: { orderBy: { position: 'asc' } } },
  });

  await executeActions(response, event);

  await prisma.followUpJob.update({
    where: { id: job.id },
    data: {
      executedAt: new Date(),
      status: 'DONE',
    },
  });
});

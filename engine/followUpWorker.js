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

const responseExecutionQueue = new Queue('RESPONSE_EXECUTION_QUEUE');

responseExecutionQueue.process(async (job) => {
  const { responseId, event } = job.data;

  console.log('[RESPONSE_EXECUTION_QUEUE] Job recibido', {
    jobId: job.id,
    responseId,
    session: event?.session,
  });

  const response = await prisma.response.findUnique({
    where: { id: responseId },
    include: {
      activations: { include: { tags: true } },
      actions: { orderBy: { position: 'asc' } },
      rules: true,
    },
  });

  if (!response) {
    console.warn(
      '[RESPONSE_EXECUTION_QUEUE] Response no encontrada',
      responseId
    );
    return;
  }

  // 🎯 LO ÚNICO QUE DEBE HACER ESTA QUEUE
  await executeActions(response, event);

  console.log(
    '[RESPONSE_EXECUTION_QUEUE] Job ejecutado correctamente',
    job.id
  );
});
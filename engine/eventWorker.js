// engine/eventWorker.js
const Queue = require('bull');
const { RESPONSE_EVENT_QUEUE } = require('../src/queues/queueNames');
const handleIncomingMessage = require('./handlers/incomingMessage');
const handleTagAssigned = require('./handlers/tagAssigned');
const handleTagremoved = require('./handlers/tagRemoved');

const queue = new Queue(RESPONSE_EVENT_QUEUE);

queue.process(async (job) => {
  const event = job.data;
  console.log(`Evento recibido`)
  console.log(event)
  if (event.type === 'INCOMING_MESSAGE') {
    return handleIncomingMessage(event);
  }

  if (event.type === 'TAG_ASSIGNED') {
    return handleTagAssigned(event);
  }
  if (event.type === 'TAG_REMOVED') {
    return handleTagremoved(event);
  }


});

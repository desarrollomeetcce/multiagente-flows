// engine/eventWorker.js
const { Worker } = require("bullmq");
const { RESPONSE_EVENT_QUEUE } = require("../src/queues/queueNames");
const handleIncomingMessage = require("./handlers/incomingMessage");
const handleTagAssigned = require("./handlers/tagAssigned");

/**
 * Worker BullMQ
 * - Conexión automática a localhost
 * - Sin IP / puerto explícito
 */
const worker = new Worker(
  RESPONSE_EVENT_QUEUE,
  async (job) => {
    const event = job.data;

    console.log("Evento recibido");
    console.log(event);

    if (event.type === "INCOMING_MESSAGE") {
      return handleIncomingMessage(event);
    }

    if (event.type === "TAG_ASSIGNED") {
      return handleTagAssigned(event);
    }
  }
);

/**
 * Logs útiles (opcional pero recomendado)
 */
worker.on("completed", (job) => {
  console.log(`Job ${job.id} procesado`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} falló`, err);
});

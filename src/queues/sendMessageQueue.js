const { Queue } = require("bullmq");

/**
 * Cache de colas por nombre
 * (simula el new Queue(name) de Bull)
 */
const queues = {};

/**
 * Obtiene o crea la cola
 */
function getQueue(queueName) {
  if (!queues[queueName]) {
    queues[queueName] = new Queue(queueName);
  }
  return queues[queueName];
}

/**
 * Envía un mensaje a una cola (Bull-like)
 * @param {string} queueName - nombre de la cola (ej. SINGLE_MESSAGEwp_1)
 * @param {object} payload  - payload del mensaje
 */
async function sendMessageQueue(queueName, payload) {
  const messageQueue = getQueue(queueName);

  try {
    console.log(`Queue ${queueName}`);
    console.log(payload);

    await messageQueue.add("job", payload, {
      removeOnComplete: true,
      removeOnFail: 50,
    });
  } catch (err) {
    console.error("[sendMessageQueue] Error:", err);
    throw err;
  }
}

module.exports = {
  sendMessageQueue,
};

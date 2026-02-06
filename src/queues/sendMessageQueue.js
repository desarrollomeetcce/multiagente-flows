const Queue = require('bull');

/**
 * Envía un mensaje a una cola Bull y la cierra
 * @param {string} queueName - nombre de la cola (ej. SINGLE_MEESAGEwp_1)
 * @param {object} payload  - payload del mensaje
 */
async function sendMessageQueue(queueName, payload) {
  const messageQueue = new Queue(queueName);

  try {
    console.log(`Queue ${queueName}`)
    console.log(payload)
    await messageQueue.add(payload);
  } catch (err) {
    console.error('[sendMessageQueue] Error:', err);
    throw err;
  } finally {
    // ⚠️ importante para no dejar conexiones colgadas
    await messageQueue.close();
  }
}

module.exports = {
  sendMessageQueue,
};

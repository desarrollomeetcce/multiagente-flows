// engine/handlers/incomingMessage.js
const { findResponses } = require('../services/matcher');
const { executeActions } = require('../services/executor');

function normalize(text = '') {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // quita acentos
}

module.exports = async (event) => {
  if (!event.text) return;

  // 1️⃣ Traer responses activas por sesión
  const responses = await findResponses({
    session: event.session,
    activationWhere: {
      keyword: {
        not: null, // solo activaciones con keyword
      },
    },
  });

  const message = normalize(event.text);

  // 2️⃣ Match REAL: el mensaje contiene el keyword
  const matchedResponses = responses.filter((response) =>
    response.activations.some((activation) => {
      if (!activation.keyword) return false;

      const keyword = normalize(activation.keyword);
      return message.includes(keyword);
    })
  );

  // 3️⃣ Ejecutar
  for (const response of matchedResponses) {
    await executeActions(response, event);
  }
};

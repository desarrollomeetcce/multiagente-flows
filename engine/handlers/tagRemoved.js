const { findResponses } = require("../services/matcher");
const { executeActions } = require("../services/executor");

function delayToSecondsFromActivation(activation) {
  if (!activation) return 0;

  // 🟢 Caso normalizado (UI)
  if (activation.delay) {
    const { days = 0, hours = 0, minutes = 0 } = activation.delay;

    return days * 86400 + hours * 3600 + minutes * 60;
  }

  // 🟡 Caso plano (BD)
  const days = Number(activation.delayDays || 0);
  const hours = Number(activation.delayHours || 0);
  const minutes = Number(activation.delayMinutes || 0);

  return days * 86400 + hours * 3600 + minutes * 60;
}

module.exports = async (event) => {
  const tagIds = Array.isArray(event.tagId)
    ? event.tagId.map(Number)
    : [];

  console.log("[TAG_REMOVED]");
  console.log("Session:", event.session);
  console.log("Tag IDs:", tagIds);

  // ⛔ no tiene sentido buscar sin tags
  if (tagIds.length === 0) {
    console.log("No tagIds, skipping");
    return;
  }

  const responses = await findResponses({
    session: event.session,
    activationWhere: {
      tags: {
        some: {
          tagId: { in: tagIds },
        },
      },
    },
  });

  console.log("Responses encontradas:", responses.length);

  for (const response of responses) {
    console.log("→ Procesando response:", response.id, response.type);

    // 🔥 calcular delay de activación
    const delaySeconds = delayToSecondsFromActivation(response.activations[0]);

    // ⏱️ SI HAY DELAY → QUEUE
    if (delaySeconds > 0) {
      console.log(
        `⏱️ Encolando response ${response.id} con delay de ${delaySeconds}s`
      );

      await responseExecutionQueue.add(
        {
          responseId: response.id,
          event,
        },
        {
          delay: delaySeconds * 1000, // Bull usa ms
          removeOnComplete: true,
          attempts: 3,
        }
      );

      continue; // ⛔ NO ejecutar aquí
    }

    // ⚡ SIN DELAY → COMO HOY
    console.log(`⚡ Ejecutando response ${response.id} inmediatamente`);
    await executeActions(response, event);
  }
};

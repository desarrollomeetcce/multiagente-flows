const { findResponses } = require("../services/matcher");
const { executeActions } = require("../services/executor");

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
    console.log("→ Ejecutando response:", response.id, response.type);

    if (response.type === "AUTO_RESPONSE") {
      await executeActions(response, event);
    }

    if (response.type === "FOLLOW_UP") {
      await executeActions(response, event);
    }
  }
};

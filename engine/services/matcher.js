// engine/services/matcher.js
const prisma = require('../../prisma/client');

module.exports.findResponses = async ({ activationWhere, session }) => {
  return prisma.response.findMany({
    where: {
      enabled: true,

      // 🔒 filtrar por sesión
      sessions: {
        some: {
          session: session,
        },
      },

      // 🔥 activations
      activations: {
        some: activationWhere,
      },
    },
    include: {
      activations: { include: { tags: true } },
      actions: { orderBy: { position: 'asc' } },
      rules: true,
    },
  });
};

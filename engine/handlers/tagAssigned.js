const { findResponses } = require('../services/matcher');
const { executeActions } = require('../services/executor');
const { scheduleFollowUp } = require('../services/followUp');

module.exports = async (event) => {
  const responses = await findResponses({
    session: event.session,
    activationWhere: {
      
      tags: {
        some: {
          tagId: event.tagId.map(t => Number(t)),
        },
      },
    },
  });

  for (const response of responses) {
    if (response.type === 'AUTO_RESPONSE') {
      await executeActions(response, event);
    }

    if (response.type === 'FOLLOW_UP') {
      await executeActions(response, event);
    }
  }
};

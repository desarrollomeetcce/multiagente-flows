// engine/handlers/incomingMessage.js
const { findResponses } = require('../services/matcher');
const { executeActions } = require('../services/executor');

module.exports = async (event) => {
    const responses = await findResponses({
        session: event.session,
        activationWhere: {
            OR: [
                { keyword: event.text },
                { tags: { some: { tagId: { in: event.tags || [] } } } },
            ]
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

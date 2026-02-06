const { sendMessageQueue } = require("./sendMessages");


function log(...args) {
  console.log('[EXECUTOR]', ...args);
}

function sleep(seconds) {
  log('⏱️ Sleep', seconds, 'seconds');
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function isMediaAction(type) {
  const isMedia = [
    'send_image',
    'send_video',
    'send_audio',
    'send_document',
    'sticker',
  ].includes(type);

  log('🧩 isMediaAction?', type, '=>', isMedia);
  return isMedia;
}

async function sendText(action, event) {
  log('✉️ Enviando TEXTO', {
    session: event.session,
    to: event.idChat,
    text: action.text,
  });

  await sendMessageQueue(
    'SINGLE_MEESAGE' + event.session,
    {
      to: event.idChat,
      message: action.text,
      session: event.session,
      clientID: event.contactId,
    }
  );

  log('✅ Texto enviado');
}

async function sendFile(action, event) {
  log('📎 Enviando MEDIA', {
    session: event.session,
    to: event.idChat,
    type: action.type,
    file: action.payload || action.file,
    caption: action.text || null,
  });

  await sendMessageQueue(
    'MESSAGE_FILE' + event.session,
    {
      to: event.idChat,
      session: event.session,
      fileID: action.payload || action.file,
      caption: action.text || null,
      type: action.type,
    }
  );

  log('✅ Media enviada');
}

/**
 * Agregar etiquetas
 */
async function addTag(action, event) {
  
  const jsonTags = JSON.parse(action.payload)
  const tags = jsonTags.tags
  

  log('🏷️ Agregando TAGS', {
    session: event.session,
    to: event.idChat,
    client: event.contactId,
    tags,
  });

  await sendMessageQueue(
    'TAG_MASSIVE_MESSAGE',
    {
      session: event.session,
      to: event.idChat,
      client: event.contactId,
      tagIDs: tags,
      msg: 'add_tag_from_response',
      userGroupId: event.userGroupId || null,
    }
  );

  log('✅ Tags agregados');
}

/**
 * Remover etiquetas
 */
async function removeTag(action, event) {
  const tags = Array.isArray(action.payload?.tags)
    ? action.payload.tags
    : [action.payload?.tags];

  log('🏷️ Removiendo TAGS', {
    session: event.session,
    to: event.idChat,
    client: event.contactId,
    tags,
  });

  await sendMessageQueue(
    'TAG_MASSIVE_MESSAGE',
    {
      session: event.session,
      to: event.idChat,
      client: event.contactId,
      tagIDs: tags,
      msg: 'remove_tag_from_response',
      userGroupId: event.userGroupId || null,
    }
  );

  log('✅ Tags removidos');
}

/**
 * Ejecuta las acciones de una response en orden
 */
module.exports.executeActions = async (response, event) => {
  log('🚀 Ejecutando response', {
    responseId: response.id,
    responseType: response.type,
    actionsCount: response.actions.length,
    session: event.session,
  });

  for (const [index, action] of response.actions.entries()) {
    log(`➡️ Acción #${index + 1}`, {
      type: action.type,
      delaySeconds: action.delaySeconds,
    });

    // ⏱️ Delay explícito
    if (action.type === 'delay' && action.delaySeconds) {
      log('⏸️ Delay explícito');
      await sleep(action.delaySeconds);
      continue;
    }

    // ⏱️ Delay implícito
    if (action.delaySeconds) {
      log('⏸️ Delay implícito');
      await sleep(action.delaySeconds);
    }

    // ✉️ TEXTO
    if (action.type === 'send_text') {
      await sendText(action, event);
    }

    // 📎 MEDIA
    if (isMediaAction(action.type)) {
      await sendFile(action, event);
    }

    // 🏷️ TAGS
    if (action.type === 'add_tag') {
      await addTag(action, event);
    }

    if (action.type === 'remove_tag') {
      await removeTag(action, event);
    }

    log(`✔️ Acción #${index + 1} completada`);
  }

  log('🏁 Todas las acciones ejecutadas');
};

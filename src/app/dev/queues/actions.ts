'use server';

import { sendMessageQueue } from "@/queues/sendMessageQueue";

export async function sendQueueMessageAction(queue: string, payload: string) {
  let parsed;

  try {
    parsed = JSON.parse(payload);
  } catch (err) {
    throw new Error("JSON inválido");
  }

  await sendMessageQueue(queue, parsed);

  return { ok: true };
}

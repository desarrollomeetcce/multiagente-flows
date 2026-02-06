import { ResponseDefinition } from "./types";


export function normalizeResponseForDB(
  response: ResponseDefinition
) {
  return {
    ...response,
    activations: response.activations.map(a => ({
      ...a,
      
    })),
  };
}


export function hydrateActionsFromDB(dbActions: any[]) {
  return dbActions.map((act) => {
    let payload: any = {};

    try {
      payload = act.payload ? JSON.parse(act.payload) : {};
    } catch (err) {
      console.error("Payload inválido en action", act.id, act.payload);
    }

    return {
      id: act.id,
      type: act.type,

      // comunes
      delaySeconds: act.delaySeconds ?? 0,
      text: act.text ?? "",

      // TODO viene del payload
      file: payload.file ?? null,
      replies: payload.replies ?? [],
      contactName: payload.contactName ?? "",
      contactPhone: payload.contactPhone ?? "",

      // tags (add_tag, remove_tag, etc)
      tags: (payload.tags ?? []).map((tagId: string) => ({
        id: String(tagId),
      })),
    };
  });
}

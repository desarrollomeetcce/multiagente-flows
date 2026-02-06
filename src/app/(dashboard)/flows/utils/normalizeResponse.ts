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


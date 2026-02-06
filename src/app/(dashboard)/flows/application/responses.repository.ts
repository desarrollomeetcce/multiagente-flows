'use server'
import { ResponseDefinition } from "../utils/types";
import { prisma } from "@/app/shared/utils/prisma";


export async function createResponse(response: ResponseDefinition) {
  
  await prisma.response.create({
    data: {
      id: response.id,
      name: response.name,
      type: response.type,
      enabled: response.enabled,
      sessions: {
        create: response.sessions.map(session => ({
          session,
        })),
      },
      
      activations: {
        create: response.activations.map(a => ({
          id: a.id,
          type: a.type,
          keyword: a.keyword,
          delayFrom: a.delayFrom,
          delayDays: a.delay?.days,
          delayHours: a.delay?.hours,
          delayMinutes: a.delay?.minutes,
          tags: {
            create: a.tagOptions?.map(t => ({
              tagId: Number(t.id),
            })) ?? [],
          },
        })),
      },

      actions: {
        create: response.actions.map((act, index) => ({
          id: act.id,
          type: act.type,
          delaySeconds: act.delaySeconds,
          text: act.text,
          payload: JSON.stringify({
            file: act.file,
            replies: act.replies,
            contactName: act.contactName,
            contactPhone: act.contactPhone,
            tags: act.tags?.map(t => t.id),
          }),
          position: index,
        })),
      },

      rules: {
        create: {
          noGroups: response.rules.noGroups,
          onlySchedule: response.rules.onlySchedule,
          ignoreIfOpen: response.rules.ignoreIfOpen,
          ignoreIfArchived: response.rules.ignoreIfArchived,
        },
      },
    },
  });
}

'use server'
import { ResponseDefinition } from "../utils/types";
import { prisma } from "@/app/shared/utils/prisma";


export type ResponseType = "AUTO_RESPONSE" | "FOLLOW_UP";

interface GetResponsesParams {
  type: ResponseType;
  search?: string;
  enabled?: boolean | null;
}

export async function getResponses(params: GetResponsesParams) {
  const { type, search, enabled } = params;

  return prisma.response.findMany({
    where: {
      type,
      ...(enabled !== null && enabled !== undefined && {
        enabled,
      }),
      ...(search && {
        name: {
          contains: search,
        },
      }),
    },
    orderBy: {
      id: "desc",
    },
  });
}

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

export async function toggleResponse(id: string) {
  const current = await prisma.response.findUnique({
    where: { id },
    select: { enabled: true },
  });

  if (!current) return;

  await prisma.response.update({
    where: { id },
    data: { enabled: !current.enabled },
  });
}

export async function getResponseById(id: string) {
  return prisma.response.findUnique({
    where: { id },
    include: {
      activations: {
        include: { tags: true },
      },
      actions: {
        orderBy: { position: "asc" },
      },
      rules: true,
      sessions: true,
    },
  });
}


export async function updateResponse(response: ResponseDefinition) {
  await prisma.$transaction(async (tx) => {

    // ❌ NO borres ResponseSession antes
    // ❌ NO borres ResponseAction antes
    // ❌ NO borres ResponseActivation antes

    // ✅ SOLO limpia el pivote profundo
    await tx.activationTag.deleteMany({
      where: {
        activation: {
          responseId: response.id,
        },
      },
    });
    

    // ✅ Update principal con nested writes
    await tx.response.update({
      where: { id: response.id },
      data: {
        name: response.name,
        type: response.type,
        enabled: response.enabled,

        // ===== SESSIONS =====
        sessions: {
          deleteMany: {},   // Prisma ya tiene al parent en contexto
          create: response.sessions.map((session) => ({
            session,
          })),
        },

        // ===== ACTIVATIONS =====
        activations: {
          deleteMany: {},
          create: response.activations.map((a) => ({
            id: a.id,
            type: a.type,
            keyword: a.keyword,
            delayFrom: a.delayFrom,
            delayDays: a.delay?.days,
            delayHours: a.delay?.hours,
            delayMinutes: a.delay?.minutes,
            tags: {
              create:
                a.tagOptions?.map((t) => ({
                  tagId: Number(t.id),
                })) ?? [],
            },
          })),
        },

        // ===== ACTIONS =====
        actions: {
          deleteMany: {},
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
              tags: act.tags?.map((t) => t.id),
            }),
            position: index,
          })),
        },

        // ===== RULES (1-1) =====
        rules: {
          upsert: {
            create: {
              noGroups: response.rules.noGroups,
              onlySchedule: response.rules.onlySchedule,
              ignoreIfOpen: response.rules.ignoreIfOpen,
              ignoreIfArchived: response.rules.ignoreIfArchived,
            },
            update: {
              noGroups: response.rules.noGroups,
              onlySchedule: response.rules.onlySchedule,
              ignoreIfOpen: response.rules.ignoreIfOpen,
              ignoreIfArchived: response.rules.ignoreIfArchived,
            },
          },
        },
      },
    });
  });
}

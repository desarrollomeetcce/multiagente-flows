

/* =======================
   TIPOS
======================= */

import { pulpoFetch } from "../lib/pulpoFecth";



export interface UserSession {
  id: number;
  userGroupId: number;
  sessionAuth: string;
  name: string;
  phone: string;
  color: string;
  status: string;
  type: string
  wabaId: string | null;
  businessStatus: string | null;
  createdAt: string;
  updatedAt: string;

  Tags: any[];
  Statuses: any[];
}

interface SessionsResponse {
  status: "Success" | "Error";
  count: number;
  sessions: UserSession[];
}

/* =======================
   SERVICE
======================= */

export const SessionsService = {
  getAll: async (): Promise<UserSession[]> => {
    const res = await pulpoFetch<SessionsResponse>(
      "/api/v2/getUserSessions",
      {
        method: "POST",
      }
    );

    return res.sessions;
  },
};
